// import { NextRequest, NextResponse } from 'next/server'
// import { getUserById } from '@/db/user'
// import { ZodError } from 'zod'
// import { prisma } from '@/lib/prisma'
// import { userSchema } from '@/app/(protected)/admin/customer/_schema/schema'
// import { ReturnType } from '@/features/shared/api-route-types'
// import { Prisma } from '@prisma/client'

// interface ParamsProps {
//   params: Promise<{ id: string }>
// }

// export async function GET(
//   req: NextRequest,
//   { params }: ParamsProps,
// ): Promise<NextResponse<ReturnType>> {
//   try {
//     const { id } = await params
//     const user = await getUserById(id)

//     if (!user) {
//       return NextResponse.json(
//         {
//           message: 'User with id not found',
//           data: null,
//           status: 404,
//           success: false,
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }
//     return NextResponse.json(
//       {
//         message: 'User fetched successfully',
//         data: user,
//         status: 200,
//         success: true,
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: 'Failed to fetch user',
//         data: null,
//         status: 500,
//         success: false,
//         errorDetail: null,
//       },
//       { status: 500 },
//     )
//   }
// }

// // PUT: Update an existing User
// export async function PUT(
//   req: NextRequest,
//   { params }: ParamsProps,
// ): Promise<NextResponse<ReturnType>> {
//   try {
//     const { id } = await params
//     const body = await req.json()

//     const parsedData = userSchema.parse(body)

//     // Find the user by email (in a real scenario, use a unique identifier like userId)
//     const existingUser = await getUserById(id)

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           message: 'User not found!',
//           data: null,
//           status: 404,
//           success: false,
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }

//     // Update the user in primsa
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         email: parsedData.email,
//         password: parsedData.password,
//         name: parsedData.name,
//         phone: parsedData.phone,
//         address: parsedData.address && {
//           update: {
//             street: parsedData.address.street,
//             city: parsedData.address.city,
//             country: parsedData.address.country,
//             zipCode: parsedData.address.zipCode,
//           },
//         },
//         role: parsedData.role,
//       },
//     })

//     return NextResponse.json(
//       {
//         message: 'User updated successfully!',
//         data: updatedUser,
//         status: 200,
//         success: true,
//         errorDetail: null,
//       },
//       { status: 200 },
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
//           message: 'Zod Validation failed',
//           data: null,
//           status: 400,
//           success: false,
//           errorDetail: error,
//         },
//         { status: 400 },
//       )
//     }
//     return NextResponse.json(
//       {
//         message: 'Internal server error',
//         data: null,
//         status: 500,
//         success: false,
//         errorDetail: error,
//       },
//       { status: 500 },
//     )
//   }
// }

// // DELETE: Delete a User
// export async function DELETE(
//   req: NextRequest,
//   { params }: ParamsProps,
// ): Promise<NextResponse<ReturnType>> {
//   try {
//     const { id } = await params

//     const existingUser = await getUserById(id)

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           message: 'User not found!',
//           data: null,
//           status: 404,
//           success: false,
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }

//     await prisma.user.delete({
//       where: { id },
//     })

//     return NextResponse.json(
//       {
//         message: 'User deleted successfully',
//         data: existingUser,
//         status: 200,
//         success: true,
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: 'Failed to delete appointment',
//         data: null,
//         status: 500,
//         success: false,
//         errorDetail: (error as Error).message,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserById } from '@/db/user'
import { userSchema } from '@/app/(protected)/admin/customer/_schema/schema'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// Helper function to check user access
async function hasUserAccess(
  currentUser: {
    id: string
    role: Role
    businessAdmins: { businessId: string }[]
    ownedBusinesses: { id: string }[]
  },
  targetUserId: string,
): Promise<boolean> {
  if (currentUser.role === Role.SUPER_ADMIN) {
    return true
  }
  if (currentUser.role === Role.USER) {
    return currentUser.id === targetUserId
  }
  if (currentUser.role === Role.ADMIN) {
    const adminBusinessIds = currentUser.businessAdmins.map(
      (ba) => ba.businessId,
    )
    const ownedBusinessIds = currentUser.ownedBusinesses.map((b) => b.id)
    const accessibleBusinessIds = [
      ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
    ]
    const businessCustomer = await prisma.businessCustomer.findFirst({
      where: {
        userId: targetUserId,
        businessId: { in: accessibleBusinessIds },
      },
    })
    const businessAdmin = await prisma.businessAdmin.findFirst({
      where: {
        userId: targetUserId,
        businessId: { in: accessibleBusinessIds },
      },
    })
    return !!businessCustomer || !!businessAdmin
  }
  return false // GUEST has no access
}

// GET: Retrieve a single user
export async function GET(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to view user',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessAdmins: true, ownedBusinesses: true },
    })
    if (!currentUser) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'Current user not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    const { id } = await params
    const targetUser = await getUserById(id)
    if (!targetUser) {
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

    // Check access
    const hasAccess = await hasUserAccess(currentUser, id)
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: You do not have access to this user',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    return NextResponse.json(
      {
        data: {
          id: targetUser.id,
          email: targetUser.email,
          name: targetUser.name,
          phone: targetUser.phone,
          role: targetUser.role,
          emailVerified: targetUser.emailVerified,
          isActive: targetUser.isActive,
          image: targetUser.image,
          lastActive: targetUser.lastActive,
          createdAt: targetUser.createdAt,
          updatedAt: targetUser.updatedAt,
          password: null, // Do not expose password, but required by type
          businessCustomers: await prisma.businessCustomer.findMany({
            where: { userId: id },
            select: { businessId: true },
          }),
        },
        status: 200,
        success: true,
        message: 'User fetched successfully',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching user:', error)
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to fetch user',
        errorDetail: errorMessage,
      },
      { status: 500 },
    )
  }
}

// PUT: Update a user (supports GUEST to USER upgrade)
export async function PUT(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to update user',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessAdmins: true, ownedBusinesses: true },
    })
    if (!currentUser) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'Current user not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    const { id } = await params
    const body = await req.json()
    const parsedData = userSchema.parse(body)
    const { email, password, name, phone, address, role, businessId } =
      parsedData

    const targetUser = await getUserById(id)
    if (!targetUser) {
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

    // Check access
    const hasAccess = await hasUserAccess(currentUser, id)
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: You do not have access to this user',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Validate businessId for ADMIN
    let validatedBusinessId: string | undefined
    if (currentUser.role === Role.ADMIN && businessId) {
      const adminBusinessIds = currentUser.businessAdmins.map(
        (ba) => ba.businessId,
      )
      const ownedBusinessIds = currentUser.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ]
      if (!accessibleBusinessIds.includes(businessId)) {
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
      validatedBusinessId = businessId
    }

    // Restrict role updates
    if (role && role !== targetUser.role) {
      if (
        currentUser.role !== Role.SUPER_ADMIN &&
        !(targetUser.role === Role.GUEST && role === Role.USER)
      ) {
        return NextResponse.json(
          {
            data: null,
            status: 403,
            success: false,
            message:
              'Forbidden: Only.SUPER_ADMIN can update roles (except GUEST to USER)',
            errorDetail: null,
          },
          { status: 403 },
        )
      }
    }

    // Hash password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : targetUser.password

    // Update user and link to business
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        address: address ? { update: { ...address } } : undefined,
        role: role || targetUser.role,
        businessCustomers: validatedBusinessId
          ? {
              upsert: [
                {
                  where: {
                    userId_businessId: {
                      userId: id,
                      businessId: validatedBusinessId,
                    },
                  },
                  create: {
                    businessId: validatedBusinessId,
                  },
                  update: {},
                },
              ],
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        emailVerified: true,
        isActive: true,
        image: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
        businessCustomers: {
          select: { businessId: true },
        },
      },
    })

    return NextResponse.json(
      {
        data: { ...updatedUser, password: null }, // Do not expose password, but required by type
        status: 200,
        success: true,
        message: 'User updated successfully',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error updating user:', error)
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Prisma Validation failed',
          errorDetail: errorMessage,
        },
        { status: 400 },
      )
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Zod Validation failed',
          errorDetail: error.errors,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to update user',
        errorDetail: errorMessage,
      },
      { status: 500 },
    )
  }
}

// DELETE: Delete a user
export async function DELETE(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to delete user',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessAdmins: true, ownedBusinesses: true },
    })
    if (!currentUser) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'Current user not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    const { id } = await params
    const targetUser = await getUserById(id)
    if (!targetUser) {
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

    // Check access
    const hasAccess = await hasUserAccess(currentUser, id)
    if (!hasAccess) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: You do not have access to this user',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Delete user
    await prisma.user.delete({ where: { id } })

    return NextResponse.json(
      {
        data: null,
        status: 200,
        success: true,
        message: 'User deleted successfully',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error deleting user:', error)
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to delete user',
        errorDetail: errorMessage,
      },
      { status: 500 },
    )
  }
}
