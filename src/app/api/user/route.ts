import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getUserByEmail, getUserById } from '@/db/user'
import { User } from '@/app/(protected)/admin/customer/_types/customer'
import { userSchema } from '@/app/(protected)/admin/customer/_schema/schema'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma } from '@prisma/client'

// let users: User[] = [
//   {
//     id: "1",
//     email: "john.doe@example.com",
//     password: "SecurePass123!",
//     name: "John Doe",
//     phone: "+1234567890",
//     role: Role.USER,
//     address: {
//       street: "123 Main St",
//       city: "New York",
//       country: "USA",
//       zipCode: "10001",
//     },
//   },
// ]

// create return type

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  {
    try {
      const body = (await req.json()) as User
      const { email, password, name, phone, address, role } =
        userSchema.parse(body)

      const existingUser = await getUserByEmail(email)
      if (existingUser) {
        return NextResponse.json({
          message: 'User with this email already exists!',
          success: false,
          status: 409,
          data: null,
          errorDetail: null,
        })
      }

      // TODO: Hash password here (e.g., await bcrypt.hash(password, 10))

      const newUser = await prisma.user.create({
        data: {
          email,
          password, // Replace with hashedPassword later
          name,
          phone,
          address: address ? { create: { ...address } } : undefined,
          role,
        },
      })

      return NextResponse.json(
        {
          message: 'User created successfully',
          success: true,
          status: 201,
          data: newUser,
          errorDetail: null,
        },
        { status: 201 },
      )
    } catch (error) {
      console.error('Error creating user:', error)
      // Prisma Validation
      if (error instanceof Prisma.PrismaClientValidationError) {
        // Handle the validation error specifically
        return NextResponse.json(
          {
            data: null,
            status: 400,
            success: false,
            message: 'Prisma Validation failed',
            errorDetail: error,
          },
          { status: 400 },
        )
      }

      // Zode Validation
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            message: 'Zod Validation failed',
            success: false,
            status: 400,
            data: null,
            errorDetail: error,
          },
          { status: 400 },
        )
      }
      // Handle other errors
      return NextResponse.json(
        {
          message: 'Internal server error',
          success: false,
          status: 500,
          data: null,
          errorDetail: error,
        },
        { status: 500 },
      )
    }
  }
}

// GET: Retrieve all Users
export async function GET(): Promise<NextResponse<ReturnType>> {
  try {
    // get all users
    const users = await prisma.user.findMany()
    console.log(users)

    // Check if there are any users
    if (users.length === 0) {
      return NextResponse.json(
        {
          message: 'No users found!',
          success: false,
          status: 404,
          data: null,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Return the users
    return NextResponse.json(
      {
        message: 'Users fetched successfully',
        success: true,
        status: 200,
        data: users,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      {
        message: 'Failed to fetch users!',
        success: false,
        status: 500,
        data: null,
        errorDetail:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as Error).message
            : String(error),
      },
      { status: 500 },
    )
  }
}

// PUT: Update an existing User
export async function PUT(req: NextRequest): Promise<NextResponse<ReturnType>> {
  try {
    const body = (await req.json()) as User

    const parsedData = userSchema.parse(body)

    const { id } = body

    // Find the user by email (in a real scenario, use a unique identifier like userId)
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found!',
          success: false,
          status: 404,
          data: null,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Update the user in primsa
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: parsedData.email,
        password: parsedData.password,
        name: parsedData.name,
        phone: parsedData.phone,
        address: parsedData.address && {
          update: {
            street: parsedData.address.street,
            city: parsedData.address.city,
            country: parsedData.address.country,
            zipCode: parsedData.address.zipCode,
          },
        },
        role: parsedData.role,
      },
    })

    return NextResponse.json(
      {
        message: 'User updated successfully!',
        success: true,
        status: 200,
        data: updatedUser,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    // Prisma Validation
    if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle the validation error specifically
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Prisma Validation failed',
          errorDetail: error,
        },
        { status: 400 },
      )
    }

    // Zode Validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Zod Validation failed',
          success: false,
          status: 400,
          data: null,
          errorDetail: error,
        },
        { status: 400 },
      )
    }
    // Handle other errors
    return NextResponse.json(
      {
        message: 'Internal server error',
        success: false,
        status: 500,
        data: null,
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}

// DELETE: Delete a User
export async function DELETE(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    const body = (await req.json()) as User

    const { id } = body

    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found!',
          success: false,
          status: 404,
          data: null,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        message: 'User deleted successfully',
        success: true,
        status: 200,
        data: null,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to delete user!',
        success: false,
        status: 500,
        data: null,
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}
