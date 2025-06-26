import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/db/user'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { userSchema } from '@/app/(protected)/admin/customer/_schema/schema'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma } from '@prisma/client'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        {
          message: 'User with id not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: null,
        },
        { status: 404 },
      )
    }
    return NextResponse.json(
      {
        message: 'User fetched successfully',
        data: user,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch user',
        data: null,
        status: 500,
        success: false,
        errorDetail: null,
      },
      { status: 500 },
    )
  }
}

// PUT: Update an existing User
export async function PUT(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const { id } = await params
    const body = await req.json()

    const parsedData = userSchema.parse(body)

    // Find the user by email (in a real scenario, use a unique identifier like userId)
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found!',
          data: null,
          status: 404,
          success: false,
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
        data: updatedUser,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
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
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: 'Zod Validation failed',
          data: null,
          status: 400,
          success: false,
          errorDetail: error,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        message: 'Internal server error',
        data: null,
        status: 500,
        success: false,
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}

// DELETE: Delete a User
export async function DELETE(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const { id } = await params

    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        {
          message: 'User not found!',
          data: null,
          status: 404,
          success: false,
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
        data: existingUser,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to delete appointment',
        data: null,
        status: 500,
        success: false,
        errorDetail: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
