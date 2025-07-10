// import { NextRequest, NextResponse } from 'next/server'
// import { ZodError } from 'zod'
// import { prisma } from '@/lib/prisma'
// import { getServiceById } from '@/db/service'
// import { Prisma } from '@prisma/client'
// import { Service } from '@/app/(protected)/admin/service/_types/service'
// import { serviceSchema } from '@/app/(protected)/admin/service/_schemas/service'
// import { ReturnType } from '@/features/shared/api-route-types'

// export async function POST(
//   req: NextRequest,
// ): Promise<NextResponse<ReturnType>> {
//   try {
//     const body = (await req.json()) as Service

//     const parsedData = serviceSchema.parse(body)

//     const newService = await prisma.service.create({
//       data: {
//         title: parsedData.title,
//         description: parsedData.description,
//         estimatedDuration: parsedData.estimatedDuration,
//         status: parsedData.ServiceStatus || 'ACTIVE', // Fallback to default if undefined
//         serviceAvailability: {
//           create: parsedData.serviceAvailability?.map((availability) => ({
//             weekDay: availability.weekDay,
//             timeSlots: {
//               create: availability.timeSlots?.map((timeSlot) => ({
//                 startTime: timeSlot.startTime, // Explicitly convert to Date
//                 endTime: timeSlot.endTime, // Explicitly convert to Date
//               })),
//             },
//           })),
//         },
//         businessDetailId: parsedData.businessDetailId,
//       },
//     })

//     if (!newService) {
//       return NextResponse.json(
//         {
//           data: null,
//           status: 500,
//           success: false,
//           message: 'Failed to create service',
//           errorDetail: 'Service creation returned null',
//         },
//         { status: 500 },
//       )
//     }

//     return NextResponse.json(
//       {
//         data: newService,
//         status: 201,
//         success: true,
//         message: 'New Service created successfully!',
//         errorDetail: null,
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientValidationError) {
//       // Handle the validation error specifically
//       return NextResponse.json(
//         {
//           data: null,
//           status: 400,
//           success: false,
//           message: 'Prisma Validation failed',
//           errorDetail: error,
//         },
//         { status: 400 },
//       )
//     }
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         {
//           data: null,
//           status: 400,
//           success: false,
//           message: 'Zod Validation failed!',
//           errorDetail: error,
//         },
//         { status: 400 },
//       )
//     }
//     return NextResponse.json(
//       {
//         data: null,
//         status: 500,
//         success: false,
//         message: 'Failed to create service!',
//         errorDetail: error,
//       },
//       { status: 500 },
//     )
//   }
// }

// //fetch all service
// export async function GET(): Promise<NextResponse<ReturnType>> {
//   try {
//     // get all services
//     const services = await prisma.service.findMany({
//       include: {
//         appointments: true,
//         serviceAvailability: {
//           include: {
//             timeSlots: true,
//           },
//         },
//         businessDetail: {
//           include: {
//             businessAvailability: {
//               include: {
//                 timeSlots: true,
//               },
//             },
//             holiday: true,
//           },
//         },
//       },
//     })

//     if (services.length === 0) {
//       return NextResponse.json(
//         {
//           data: null,
//           status: 404,
//           success: false,
//           message: 'No services found!',
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }

//     return NextResponse.json(
//       {
//         data: services,
//         status: 200,
//         success: true,
//         message: 'Services fetched successfully!',
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         data: null,
//         status: 500,
//         success: false,
//         message: 'Failed to fetch services!',
//         errorDetail: error,
//       },
//       { status: 500 },
//     )
//   }
// }
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { serviceSchema } from '@/app/(protected)/admin/service/_schemas/service'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma, Service } from '@prisma/client'

// Interface for user data with business relations
interface UserWithBusiness {
  id: string
  role: string
  ownedBusinesses: { id: string }[]
  businessAdmins?: { businessId: string }[] // Optional to handle missing table
}

// Helper function to check if user has access to a service
async function hasServiceAccess(
  user: UserWithBusiness,
  service: Service,
): Promise<boolean> {
  if (user.role === 'SUPER_ADMIN') {
    return true // SUPER_ADMIN has access to all services
  }

  if (user.role === 'ADMIN') {
    const adminBusinessIds =
      user.businessAdmins?.map((ba) => ba.businessId) ?? []
    const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
    const accessibleBusinessIds = [
      ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
    ]
    return accessibleBusinessIds.includes(service.businessDetailId ?? '')
  }

  return false // No access for USER, GUEST, or other roles
}

// Create a new service
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    console.log('Session:', { session })
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to create a service',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Fetch user with business relations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedBusinesses: { select: { id: true } },
        businessAdmins: { select: { businessId: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: Insufficient permissions to create service',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const parsedData = serviceSchema.parse(body)

    // Validate business access for ADMIN
    if (user.role === 'ADMIN' && parsedData.businessDetailId) {
      const adminBusinessIds =
        user.businessAdmins?.map((ba) => ba.businessId) ?? []
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ]
      if (!accessibleBusinessIds.includes(parsedData.businessDetailId)) {
        return NextResponse.json(
          {
            data: null,
            status: 403,
            success: false,
            message: 'Forbidden: You do not have access to this business',
            errorDetail: null,
          },
          { status: 403 },
        )
      }
    }

    // Create new service
    const newService = await prisma.service.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        estimatedDuration: parsedData.estimatedDuration,
        status: parsedData.ServiceStatus || 'ACTIVE', // Fixed: Use lowercase 'status'
        serviceAvailability: {
          create: parsedData.serviceAvailability?.map((availability) => ({
            weekDay: availability.weekDay,
            timeSlots: {
              create: availability.timeSlots?.map((timeSlot) => ({
                startTime: timeSlot.startTime,
                endTime: timeSlot.endTime,
              })),
            },
          })),
        },
        businessDetailId: parsedData.businessDetailId,
      },
      include: {
        serviceAvailability: { include: { timeSlots: true } },
        businessDetail: true,
      },
    })

    return NextResponse.json(
      {
        data: newService,
        status: 201,
        success: true,
        message: 'Service created successfully!',
        errorDetail: null,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Prisma Validation failed',
          errorDetail: error.message,
        },
        { status: 400 },
      )
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Zod Validation failed!',
          errorDetail: error.errors,
        },
        { status: 400 },
      )
    }
    console.error('Error creating service:', error)
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to create service!',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// import { generateServiceEmbedding } from '@/lib/ai/embedding'
// import { Role } from '@prisma/client'
// import logger from '@/lib/logger'
// import { z } from 'zod'

// const serviceSchema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().min(1, 'Description is required'),
//   estimatedDuration: z
//     .number()
//     .int()
//     .positive('Estimated duration must be a positive integer'),
//   status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
//   businessDetailId: z.string().optional(),
// })

// export type ReturnType<T = any> = {
//   data: T | null
//   status: number
//   success: boolean
//   message: string
//   errorDetail: string | null
// }

// export async function POST(req: Request) {
//   try {
//     logger.info('Starting POST /api/service')
//     const session = await auth()
//     if (!session?.user?.id) {
//       logger.warn('Unauthorized access attempt to create service', {
//         path: '/api/service',
//       })
//       return NextResponse.json(
//         {
//           data: null,
//           status: 401,
//           success: false,
//           message: 'Unauthorized',
//           errorDetail: null,
//         },
//         { status: 401 },
//       )
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       include: { ownedBusinesses: { select: { id: true } } },
//     })
//     if (!user) {
//       logger.warn('User not found', { userId: session.user.id })
//       return NextResponse.json(
//         {
//           data: null,
//           status: 404,
//           success: false,
//           message: 'User not found',
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }

//     if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
//       logger.warn('Forbidden access attempt', {
//         userId: user.id,
//         role: user.role,
//       })
//       return NextResponse.json(
//         {
//           data: null,
//           status: 403,
//           success: false,
//           message: 'Forbidden: Insufficient permissions',
//           errorDetail: null,
//         },
//         { status: 403 },
//       )
//     }

//     const body = await req.json()
//     const parsedData = serviceSchema.parse(body)
//     logger.info('Parsed service data', { parsedData })

//     if (user.role === 'ADMIN' && parsedData.businessDetailId) {
//       const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
//       if (!ownedBusinessIds.includes(parsedData.businessDetailId)) {
//         logger.warn('Unauthorized business access', {
//           userId: user.id,
//           businessId: parsedData.businessDetailId,
//         })
//         return NextResponse.json(
//           {
//             data: null,
//             status: 403,
//             success: false,
//             message: 'Forbidden: You do not have access to this business',
//             errorDetail: null,
//           },
//           { status: 403 },
//         )
//       }
//     }

//     const { content, vector } = await generateServiceEmbedding({
//       title: parsedData.title,
//       description: parsedData.description,
//       estimatedDuration: parsedData.estimatedDuration,
//     })
//     logger.info('Generated embedding for service', { title: parsedData.title })

//     const service = await prisma.$transaction(async (tx) => {
//       logger.info('Starting transaction for service and document creation')
//       const newService = await tx.service.create({
//         data: {
//           title: parsedData.title,
//           description: parsedData.description,
//           estimatedDuration: parsedData.estimatedDuration,
//           status: parsedData.ServiceStatus || 'ACTIVE',
//           businessDetailId: parsedData.businessDetailId,
//         },
//       })
//       logger.info('Service created', { serviceId: newService.id })

//       await tx.document.create({
//         data: {
//           content,
//           accessLevel:
//             parsedData.ServiceStatus === 'ACTIVE'
//               ? [Role.ADMIN, Role.USER, Role.GUEST]
//               : [Role.ADMIN, Role.SUPER_ADMIN],
//           embedding: vector,
//           serviceId: newService.id,
//           businessId: parsedData.businessDetailId,
//         },
//       })
//       logger.info('Document created', { serviceId: newService.id })

//       return newService
//     })

//     logger.info('Service and document created successfully', {
//       serviceId: service.id,
//     })
//     return NextResponse.json(
//       {
//         data: service,
//         status: 201,
//         success: true,
//         message: 'Service created successfully!',
//         errorDetail: null,
//       },
//       { status: 201 },
//     )
//   } catch (error) {
//     logger.error(
//       `Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`,
//       {
//         error,
//       },
//     )
//     return NextResponse.json(
//       {
//         data: null,
//         status: 500,
//         success: false,
//         message: 'Failed to create service!',
//         errorDetail: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 },
//     )
//   }
// }
// Fetch all services
export async function GET(req: NextRequest): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to view services',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Fetch user with business relations, handle missing businessAdmins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedBusinesses: { select: { id: true } },
        businessAdmins: { select: { businessId: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: Only admins and super admins can view services',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Fetch services based on user role
    let services: Service[]
    if (user.role === 'SUPER_ADMIN') {
      services = await prisma.service.findMany({
        include: {
          appointments: {
            select: { id: true, status: true, selectedDate: true },
          },
          serviceAvailability: { include: { timeSlots: true } },
          businessDetail: {
            include: {
              businessAvailability: { include: { timeSlots: true } },
              holiday: { select: { id: true, date: true, holiday: true } },
            },
          },
        },
      })
    } else {
      const adminBusinessIds =
        user.businessAdmins?.map((ba) => ba.businessId) ?? []
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ]
      if (accessibleBusinessIds.length === 0) {
        return NextResponse.json(
          {
            data: null,
            status: 403,
            success: false,
            message: 'Forbidden: No businesses assigned or owned by this admin',
            errorDetail: null,
          },
          { status: 403 },
        )
      }
      services = await prisma.service.findMany({
        where: { businessDetailId: { in: accessibleBusinessIds } },
        include: {
          appointments: {
            select: { id: true, status: true, selectedDate: true },
          },
          serviceAvailability: { include: { timeSlots: true } },
          businessDetail: {
            include: {
              businessAvailability: { include: { timeSlots: true } },
              holiday: { select: { id: true, date: true, holiday: true } },
            },
          },
        },
      })
    }

    if (services.length === 0) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'No services found!',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        data: services,
        status: 200,
        success: true,
        message: 'Services fetched successfully!',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to fetch services!',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
