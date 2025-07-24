import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementOrOfferById } from '@/db/announcement-offer'
import { getAppointmentById } from '@/db/appointment'
import { getBusinessDetailById } from '@/db/businessDetail'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { Prisma, WeekDays } from '@prisma/client'
import { businessDetailSchema } from '@/app/(protected)/admin/business-settings/_schema/schema'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const business = await getBusinessDetailById(id)

    if (!business) {
      return NextResponse.json(
        { message: 'Business Detail with id not found!', success: false },
        { status: 404 },
      )
    }
    return NextResponse.json(
      {
        data: business,
        success: true,
        message: 'Business fetched successfully!',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch business-detail!',
        success: false,
        error: error,
      },
      { status: 500 },
    )
  }
}

// Update an existing business detail
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params // or Get the ID from the request body
    const body = await req.json()

    if (!id) {
      return NextResponse.json(
        { message: 'Business ID is required!', success: false },
        { status: 400 },
      )
    }

    const parsedData = businessDetailSchema.parse(body)

    const business = await getBusinessDetailById(id)

    if (!business) {
      return NextResponse.json(
        { message: 'Business Detail with id not found!', success: false },
        { status: 404 },
      )
    }

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    })
    if (deletedBusiness) {
      const updatedBusiness = await prisma.businessDetail.create({
        data: {
          id: id,
          name: parsedData.name,
          industry: parsedData.industry,
          email: parsedData.email,
          phone: parsedData.phone,
          website: parsedData.website,
          businessOwner: parsedData.businessOwner,
          businessRegistrationNumber: parsedData.businessRegistrationNumber,
          status: parsedData.status,
          timeZone: parsedData.timeZone,

          // Handle addresses
          address: {
            create: parsedData.address.map((address) => ({
              street: address.street,
              city: address.city,
              country: address.country,
              zipCode: address.zipCode,
              googleMap: address.googleMap || '',
            })),
          },
          // Handle business availability
          businessAvailability: {
            create: parsedData.businessAvailability?.map((availability) => ({
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  type: slot.type,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            })),
          },

          // Handle service availability
          serviceAvailability: {
            create: parsedData.serviceAvailability?.map((availability) => ({
              weekDay: availability.weekDay as WeekDays,
              // Add other fields as needed
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            })),
          },

          // Handle holidays
          holiday: {
            create: parsedData.holiday?.map((holiday) => ({
              holiday: holiday.holiday,
              type: holiday.type,
              date: holiday.date || null,
            })),
          },
        },
        include: {
          address: true,
          businessAvailability: {
            include: {
              timeSlots: true,
            },
          },
          serviceAvailability: { include: { timeSlots: true } },
          holiday: true,
        },
      })

      if (updatedBusiness) {
        return NextResponse.json(
          {
            message: 'Business updated successfully!',
            data: updatedBusiness,
            success: true,
          },
          { status: 200 },
        )
      }
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error('Validation error:', error.message)
      // Handle the validation error specifically
      return {
        error: 'Validation failed',
        details: error, // or use error.stack for full stack trace
      }
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation failed!', error: error, success: false },
        { status: 400 },
      )
    }
    console.error('Prisma Error:', error) // Log the full error for debugging
    return NextResponse.json(
      { message: 'Internal server error!', error: error, success: false },
      { status: 500 },
    )
  }
}

// Delete a business detail
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'Business ID is required!', success: false },
        { status: 400 },
      )
    }

    const existingBusiness = await getBusinessDetailById(id)

    if (!existingBusiness) {
      return NextResponse.json(
        { message: 'Business not found!', success: false },
        { status: 404 },
      )
    }

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    })

    if (!deletedBusiness) {
      return NextResponse.json(
        {
          message: "Business couldn't be deleted!",
          success: false,
          data: deletedBusiness,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Business deleted successfully!', success: true },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete business!', error: error, success: false },
      { status: 500 },
    )
  }
}
