import { NextRequest, NextResponse } from "next/server"
import {
  userSchema,
  userUpdateSchema,
} from "@/features/customer/schemas/schema"
import { User, Role } from "@/features/customer/types/types"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getUserByEmail, getUserById } from "@/db/user"
import * as bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as User
    const { email, password, name, phone, address, role } =
      userSchema.parse(body)

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists!" },
        { status: 400 }
      )
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        address: address ? { create: { ...address } } : undefined,
        role,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error", message: String(error) },
      { status: 500 }
    )
  }
}

// GET: Retrieve all Users
export async function GET() {
  try {
    // get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        address: {
          select: {
            street: true,
            city: true,
            country: true,
            zipCode: true,
          },
        },
      },
    })
    console.log(users)

    // Check if there are any users
    if (users.length === 0) {
      return NextResponse.json({ error: "No users found!" }, { status: 404 })
    }

    // Return the users
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "Failed to fetch users!", details: error },
      { status: 500 }
    )
  }
}

// PUT: Update an existing User
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as User

    const parsedData = userUpdateSchema.parse(body)

    const { id, password } = parsedData

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required!" },
        { status: 400 }
      )
    }

    // Find the user by email (in a real scenario, use a unique identifier like userId)
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 })
    }

    const updateData: Prisma.UserUpdateInput = {
      email: parsedData.email,
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
    }

    // Only hash and set password if a new one is provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    // Update the user in primsa
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(
      { message: "User updated successfully!", user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}

// DELETE: Delete a User
export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as User

    const { id } = body

    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        error: "Failed to delete appointment",
        details: error,
      },
      { status: 500 }
    )
  }
}
