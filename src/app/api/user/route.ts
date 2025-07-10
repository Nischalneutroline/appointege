// import { NextRequest, NextResponse } from 'next/server'
// import { z } from 'zod'
// import { prisma } from '@/lib/prisma'
// import { getUserByEmail, getUserById } from '@/db/user'
// import { User } from '@/app/(protected)/admin/customer/_types/customer'
// import { userSchema } from '@/app/(protected)/admin/customer/_schema/schema'
// import { ReturnType } from '@/features/shared/api-route-types'
// import { Prisma } from '@prisma/client'

// // let users: User[] = [
// //   {
// //     id: "1",
// //     email: "john.doe@example.com",
// //     password: "SecurePass123!",
// //     name: "John Doe",
// //     phone: "+1234567890",
// //     role: Role.USER,
// //     address: {
// //       street: "123 Main St",
// //       city: "New York",
// //       country: "USA",
// //       zipCode: "10001",
// //     },
// //   },
// // ]

// // create return type

// export async function POST(
//   req: NextRequest,
// ): Promise<NextResponse<ReturnType>> {
//   {
//     try {
//       const body = (await req.json()) as User
//       const { email, password, name, phone, address, role } =
//         userSchema.parse(body)

//       const existingUser = await getUserByEmail(email)
//       if (existingUser) {
//         return NextResponse.json({
//           message: 'User with this email already exists!',
//           success: false,
//           status: 409,
//           data: null,
//           errorDetail: null,
//         })
//       }

//       // TODO: Hash password here (e.g., await bcrypt.hash(password, 10))

//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           password, // Replace with hashedPassword later
//           name,
//           phone,
//           address: address ? { create: { ...address } } : undefined,
//           role,
//         },
//       })

//       return NextResponse.json(
//         {
//           message: 'User created successfully',
//           success: true,
//           status: 201,
//           data: newUser,
//           errorDetail: null,
//         },
//         { status: 201 },
//       )
//     } catch (error) {
//       console.error('Error creating user:', error)
//       // Prisma Validation
//       if (error instanceof Prisma.PrismaClientValidationError) {
//         // Handle the validation error specifically
//         return NextResponse.json(
//           {
//             data: null,
//             status: 400,
//             success: false,
//             message: 'Prisma Validation failed',
//             errorDetail: error,
//           },
//           { status: 400 },
//         )
//       }

//       // Zode Validation
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           {
//             message: 'Zod Validation failed',
//             success: false,
//             status: 400,
//             data: null,
//             errorDetail: error,
//           },
//           { status: 400 },
//         )
//       }
//       // Handle other errors
//       return NextResponse.json(
//         {
//           message: 'Internal server error',
//           success: false,
//           status: 500,
//           data: null,
//           errorDetail: error,
//         },
//         { status: 500 },
//       )
//     }
//   }
// }

// // GET: Retrieve all Users
// export async function GET(): Promise<NextResponse<ReturnType>> {
//   try {
//     // get all users
//     const users = await prisma.user.findMany({
//       include: {
//         appointments: {
//           include: {
//             service: true,
//           },
//         },
//       },
//     })
//     console.log(users)

//     // Check if there are any users
//     if (users.length === 0) {
//       return NextResponse.json(
//         {
//           message: 'No users found!',
//           success: false,
//           status: 404,
//           data: null,
//           errorDetail: null,
//         },
//         { status: 404 },
//       )
//     }

//     // Return the users
//     return NextResponse.json(
//       {
//         message: 'Users fetched successfully',
//         success: true,
//         status: 200,
//         data: users,
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     // Handle errors
//     return NextResponse.json(
//       {
//         message: 'Failed to fetch users!',
//         success: false,
//         status: 500,
//         data: null,
//         errorDetail:
//           typeof error === 'object' && error !== null && 'message' in error
//             ? (error as Error).message
//             : String(error),
//       },
//       { status: 500 },
//     )
//   }
// }

// // PUT: Update an existing User
// export async function PUT(req: NextRequest): Promise<NextResponse<ReturnType>> {
//   try {
//     const body = (await req.json()) as User

//     const parsedData = userSchema.parse(body)

//     const { id } = body

//     // Find the user by email (in a real scenario, use a unique identifier like userId)
//     const existingUser = await getUserById(id)

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           message: 'User not found!',
//           success: false,
//           status: 404,
//           data: null,
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
//         success: true,
//         status: 200,
//         data: updatedUser,
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     // Prisma Validation
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

//     // Zode Validation
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           message: 'Zod Validation failed',
//           success: false,
//           status: 400,
//           data: null,
//           errorDetail: error,
//         },
//         { status: 400 },
//       )
//     }
//     // Handle other errors
//     return NextResponse.json(
//       {
//         message: 'Internal server error',
//         success: false,
//         status: 500,
//         data: null,
//         errorDetail: error,
//       },
//       { status: 500 },
//     )
//   }
// }

// // DELETE: Delete a User
// export async function DELETE(
//   req: NextRequest,
// ): Promise<NextResponse<ReturnType>> {
//   try {
//     const body = (await req.json()) as User

//     const { id } = body

//     const existingUser = await getUserById(id)

//     if (!existingUser) {
//       return NextResponse.json(
//         {
//           message: 'User not found!',
//           success: false,
//           status: 404,
//           data: null,
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
//         success: true,
//         status: 200,
//         data: null,
//         errorDetail: null,
//       },
//       { status: 200 },
//     )
//   } catch (error) {
//     return NextResponse.json(
//       {
//         message: 'Failed to delete user!',
//         success: false,
//         status: 500,
//         data: null,
//         errorDetail: error,
//       },
//       { status: 500 },
//     )
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserByEmail } from '@/db/user'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Updated schema for stronger password validation
export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    )
    .optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['GUEST', 'USER', 'ADMIN', 'SUPER_ADMIN']).optional(),
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      country: z.string(),
      zipCode: z.string(),
    })
    .optional(),
  businessId: z.string().optional(),
})

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

// POST: Create a new user (supports GUEST registration and admin linking)
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    const session = await auth()
    const body = await req.json()
    const parsedData = userSchema.parse(body)
    const { email, password, name, phone, address, role, businessId } =
      parsedData

    // Allow GUEST registration without session
    if (!session && role !== Role.GUEST) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message:
            'Unauthorized: Please log in to create a user (except for guest registration)',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Restrict role assignment
    if (
      session &&
      role &&
      role !== Role.GUEST &&
      role !== Role.USER &&
      session.user?.role !== Role.SUPER_ADMIN
    ) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message:
            'Forbidden: Only SUPER_ADMIN can assign ADMIN or SUPER_ADMIN roles',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Validate businessId for ADMIN
    let validatedBusinessId: string | undefined
    if (session && session.user?.role === Role.ADMIN && businessId) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { businessAdmins: true, ownedBusinesses: true },
      })
      if (!user) {
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
      const adminBusinessIds = user.businessAdmins.map((ba) => ba.businessId)
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
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

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        {
          data: null,
          status: 409,
          success: false,
          message: 'User with this email already exists',
          errorDetail: null,
        },
        { status: 409 },
      )
    }

    // Hash password
    if (!password) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Password is required',
          errorDetail: null,
        },
        { status: 400 },
      )
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user and link to business
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        address: address ? { create: { ...address } } : undefined,
        role: role || Role.GUEST,
        businessCustomers: validatedBusinessId
          ? {
              create: {
                businessId: validatedBusinessId,
              },
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
        data: {
          ...newUser,
          password: null, // Add password property as required by ReturnType
        },
        status: 201,
        success: true,
        message: 'User created successfully',
        errorDetail: null,
      },
      { status: 201 },
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error creating user:', error)
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
        message: 'Failed to create user',
        errorDetail: errorMessage,
      },
      { status: 500 },
    )
  }
}

// GET: Retrieve all users (ADMIN/SUPER_ADMIN only, includes BusinessCustomer)
export async function GET(): Promise<NextResponse<ReturnType>> {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to view users',
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { businessAdmins: true, ownedBusinesses: true },
    })
    if (!user) {
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

    // Restrict to ADMIN/SUPER_ADMIN
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: Only ADMIN or SUPER_ADMIN can view all users',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    let users
    if (user.role === Role.SUPER_ADMIN) {
      users = await prisma.user.findMany({
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
    } else {
      const adminBusinessIds = user.businessAdmins.map((ba) => ba.businessId)
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ]
      users = await prisma.user.findMany({
        where: {
          OR: [
            {
              businessCustomers: {
                some: { businessId: { in: accessibleBusinessIds } },
              },
            },
            {
              businessAdmins: {
                some: { businessId: { in: accessibleBusinessIds } },
              },
            },
          ],
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
    }

    if (users.length === 0) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'No users found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        data: users.map((user) => ({
          ...user,
          password: null,
        })),
        status: 200,
        success: true,
        message: 'Users fetched successfully',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to fetch users',
        errorDetail: errorMessage,
      },
      { status: 500 },
    )
  }
}
