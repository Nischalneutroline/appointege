import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Pool } from '@neondatabase/serverless'
import { Role } from '@prisma/client'
// import logger from '@/lib/logger'

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
})

export type ReturnType<T = any> = {
  data: T | null
  status: number
  success: boolean
  message: string
  errorDetail: string | null
}

export async function POST(req: NextRequest) {
  let pool: any
  try {
    // logger.info('Starting POST /api/search')
    const session = await auth()
    const { query, businessName } = await req.json()
    // logger.info('Parsed search request', { query, businessName })

    if (!query && !businessName) {
      //   logger.warn('Invalid search request: missing query or businessName')
      return NextResponse.json(
        {
          success: false,
          message: 'Query or businessName required',
          data: null,
          status: 400,
          errorDetail: null,
        },
        { status: 400 },
      )
    }

    const userRole = session?.user?.role || 'GUEST'
    const userId = session?.user?.id
    // logger.info('User role determined', { userRole, userId })

    // Resolve businessId from businessName if provided
    let targetBusinessId: string | null = null
    if (businessName) {
      const business = await prisma.businessDetail.findFirst({
        where: { name: { equals: businessName, mode: 'insensitive' } },
        select: { id: true, status: true },
      })
      if (!business) {
        // logger.warn('Business not found', { businessName })
        return NextResponse.json(
          {
            success: false,
            message: 'Business not found',
            data: null,
            status: 404,
            errorDetail: null,
          },
          { status: 404 },
        )
      }
      if (
        business.status !== 'ACTIVE' &&
        userRole !== 'ADMIN' &&
        userRole !== 'SUPER_ADMIN'
      ) {
        // logger.warn('Access to inactive business denied', {
        //   businessName,
        //   userRole,
        // })
        return NextResponse.json(
          {
            success: false,
            message: 'Business is not active',
            data: null,
            status: 403,
            errorDetail: null,
          },
          { status: 403 },
        )
      }
      targetBusinessId = business.id
      //   logger.info('Resolved businessName to businessId', {
      //     businessName,
      //     businessId: targetBusinessId,
      //   })
    }

    // Build query conditions
    let whereClause = ''
    const params: any[] = []

    if (userRole === 'SUPER_ADMIN') {
      if (targetBusinessId) {
        whereClause += `AND d.businessId = $1`
        params.push(targetBusinessId)
      }
    } else if (userRole === 'ADMIN') {
      if (!userId) {
        // logger.warn('User not found for ADMIN role', { userId })
        return NextResponse.json(
          {
            success: false,
            message: 'User not found',
            data: null,
            status: 404,
            errorDetail: null,
          },
          { status: 404 },
        )
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          ownedBusinesses: { select: { id: true } },
          businessAdmins: { select: { businessId: true } },
        },
      })
      if (!user) {
        // logger.warn('User not found', { userId })
        return NextResponse.json(
          {
            success: false,
            message: 'User not found',
            data: null,
            status: 404,
            errorDetail: null,
          },
          { status: 404 },
        )
      }
      const businessIds = [
        ...new Set([
          ...user.ownedBusinesses.map((b) => b.id),
          ...user.businessAdmins.map((ba) => ba.businessId),
        ]),
      ]
      if (!businessIds.length) {
        // logger.warn('No accessible businesses for admin', { userId })
        return NextResponse.json(
          {
            success: false,
            message: 'Forbidden: No businesses assigned or owned',
            data: null,
            status: 403,
            errorDetail: null,
          },
          { status: 403 },
        )
      }
      if (targetBusinessId && !businessIds.includes(targetBusinessId)) {
        // logger.warn('Unauthorized business access', {
        //   userId,
        //   businessId: targetBusinessId,
        // })
        return NextResponse.json(
          {
            success: false,
            message: 'Forbidden: You do not have access to this business',
            data: null,
            status: 403,
            errorDetail: null,
          },
          { status: 403 },
        )
      }
      whereClause += `AND d.businessId IN (${businessIds.map((_, i) => `$${i + 1}`).join(',')})`
      params.push(...businessIds)
    } else if (userRole === 'USER') {
      if (!userId) {
        // logger.warn('User not found for USER role', { userId })
        return NextResponse.json(
          {
            success: false,
            message: 'User not found',
            data: null,
            status: 404,
            errorDetail: null,
          },
          { status: 404 },
        )
      }
      whereClause += `AND (a.userId = $${params.length + 1} OR d.userId = $${params.length + 1} OR d.userId IS NULL)`
      params.push(userId)
      whereClause += `AND (b.status = 'ACTIVE' OR b.status IS NULL)`
    } else {
      whereClause += `AND 'GUEST' = ANY(d.accessLevel)`
      whereClause += `AND (b.status = 'ACTIVE' OR b.status IS NULL)`
    }

    // Parse query for filters
    let additionalWhere = ''
    if (query) {
      const lowerQuery = query.toLowerCase()
      const today = new Date().toISOString().split('T')[0]
      if (lowerQuery.includes('today')) {
        additionalWhere += `AND a.selectedDate = $${params.length + 1}`
        params.push(today)
      } else if (lowerQuery.includes('upcoming')) {
        additionalWhere += `AND a.selectedDate >= $${params.length + 1}`
        params.push(today)
      } else if (
        lowerQuery.includes('cancelled') ||
        lowerQuery.includes('canceled')
      ) {
        additionalWhere += `AND a.status = $${params.length + 1}`
        params.push('CANCELLED')
      } else if (lowerQuery.includes('booked')) {
        additionalWhere += `AND a.status = $${params.length + 1}`
        params.push('BOOKED')
      } else if (lowerQuery.includes('missed')) {
        additionalWhere += `AND a.status = $${params.length + 1}`
        params.push('MISSED')
      }
    }

    // Initialize Neon pool
    pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const client = await pool.connect()

    // Create a readable stream for response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          // Perform semantic search or filtered list
          let results
          if (query) {
            const queryVector = await embeddings.embedQuery(query)
            const queryVectorString = `[${queryVector.join(',')}]`
            // logger.info('Generated query embedding', {
            //   query,
            //   vectorLength: queryVector.length,
            // })

            results = await client.query(
              `
              SELECT 
                d.id, 
                d.content, 
                d.serviceId, 
                d.appointmentId, 
                d.businessId, 
                d.userId,
                COALESCE(
                  s.title, 
                  a.customerName, 
                  b.name, 
                  u.name
                ) as primary_field,
                COALESCE(
                  s.description, 
                  a.email, 
                  b.industry, 
                  u.email
                ) as secondary_field,
                s.estimatedDuration,
                a.status as appointment_status,
                a.selectedDate,
                a.selectedTime,
                b.status as business_status,
                u.isActive as user_status
              FROM "Document" d
              LEFT JOIN "Service" s ON d.serviceId = s.id
              LEFT JOIN "Appointment" a ON d.appointmentId = a.id
              LEFT JOIN "BusinessDetail" b ON d.businessId = b.id
              LEFT JOIN "User" u ON d.userId = u.id
              WHERE '${userRole}' = ANY(d.accessLevel)
              ${whereClause}
              ${additionalWhere}
              ORDER BY d.embedding <-> $1::vector
              LIMIT 10
              `,
              [queryVectorString, ...params],
            )
            // logger.info('Semantic search completed', {
            //   query,
            //   userRole,
            //   resultCount: results.rows.length,
            // })
          } else {
            results = await client.query(
              `
              SELECT 
                d.id, 
                d.content, 
                d.serviceId, 
                d.appointmentId, 
                d.businessId, 
                d.userId,
                COALESCE(
                  s.title, 
                  a.customerName, 
                  b.name, 
                  u.name
                ) as primary_field,
                COALESCE(
                  s.description, 
                  a.email, 
                  b.industry, 
                  u.email
                ) as secondary_field,
                s.estimatedDuration,
                a.status as appointment_status,
                a.selectedDate,
                a.selectedTime,
                b.status as business_status,
                u.isActive as user_status
              FROM "Document" d
              LEFT JOIN "Service" s ON d.serviceId = s.id
              LEFT JOIN "Appointment" a ON d.appointmentId = a.id
              LEFT JOIN "BusinessDetail" b ON d.businessId = b.id
              LEFT JOIN "User" u ON d.userId = u.id
              WHERE '${userRole}' = ANY(d.accessLevel)
              ${whereClause}
              ${additionalWhere}
              ORDER BY 
                COALESCE(a.selectedDate, 'infinity'::date) DESC,
                COALESCE(s.title, a.customerName, b.name, u.name)
              LIMIT 10
              `,
              params,
            )
            // logger.info('Filtered search completed', {
            //   userRole,
            //   resultCount: results.rows.length,
            // })
          }

          // Stream results
          const response: ReturnType = {
            success: true,
            data: results.rows,
            status: 200,
            message: 'Search successful',
            errorDetail: null,
          }

          // Send results incrementally
          for (const row of results.rows) {
            controller.enqueue(
              encoder.encode(JSON.stringify({ partial: row }) + '\n'),
            )
            await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate streaming delay
          }

          // Send final response
          controller.enqueue(encoder.encode(JSON.stringify(response) + '\n'))
          controller.close()
        } catch (error) {
          //   logger.error(
          //     `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          //     { error },
          //   )
          const errorResponse: ReturnType = {
            success: false,
            data: null,
            status: 500,
            message: 'Failed to search',
            errorDetail:
              error instanceof Error ? error.message : 'Unknown error',
          }
          controller.enqueue(
            encoder.encode(JSON.stringify(errorResponse) + '\n'),
          )
          controller.close()
        } finally {
          client.release()
          await pool.end()
        }
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    // logger.error(
    //   `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    //   { error },
    // )
    return NextResponse.json(
      {
        success: false,
        data: null,
        status: 500,
        message: 'Failed to search',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
