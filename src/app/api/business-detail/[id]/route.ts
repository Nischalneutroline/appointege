import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementOrOfferById } from '@/db/announcement-offer'
import { getAppointmentById } from '@/db/appointment'
import { getBusinessDetailById } from '@/db/businessDetail'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { BusinessTimeType, Prisma, WeekDays } from '@prisma/client'
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
    const { id } = await params
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

    // Use a transaction to delete related records and update the business
    const updatedBusiness = await prisma.$transaction(async (tx) => {
      // Delete related timeSlots for serviceAvailability
      await tx.serviceTime.deleteMany({
        where: {
          serviceAvailability: {
            businessDetailId: id,
          },
        },
      })

      // Delete serviceAvailability records
      await tx.serviceAvailability.deleteMany({
        where: { businessDetailId: id },
      })

      // Delete related timeSlots for businessAvailability
      await tx.businessTime.deleteMany({
        where: {
          businessAvailability: {
            businessId: id,
          },
        },
      })

      // Delete businessAvailability records
      await tx.businessAvailability.deleteMany({
        where: { businessId: id },
      })

      // Delete existing addresses
      await tx.businessAddress.deleteMany({
        where: { businessId: id },
      })

      // Delete existing holidays
      await tx.holiday.deleteMany({
        where: { businessId: id },
      })

      // Update the business with new data
      return await tx.businessDetail.update({
        where: { id },
        data: {
          name: parsedData.name,
          industry: parsedData.industry,
          email: parsedData.email,
          phone: parsedData.phone,
          website: parsedData.website,
          businessRegistrationNumber: parsedData.businessRegistrationNumber,
          status: parsedData.status,
          timeZone: parsedData.timeZone,
          businessOwner: parsedData.businessOwner,
          address: {
            create: parsedData.address.map((address) => ({
              street: address.street,
              city: address.city,
              country: address.country,
              zipCode: address.zipCode,
              googleMap: address.googleMap || '',
            })),
          },
          businessAvailability: {
            create: parsedData.businessAvailability?.map((availability) => ({
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  type: slot.type || BusinessTimeType.WORK, // Ensure type is set
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            })),
          },
          serviceAvailability: {
            create: parsedData.serviceAvailability?.map((availability) => ({
              weekDay: availability.weekDay,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            })),
          },
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
          serviceAvailability: {
            include: { timeSlots: true },
          },
          holiday: true,
        },
      })
    })

    return NextResponse.json(
      {
        data: updatedBusiness,
        status: 200,
        success: true,
        message: 'Business updated successfully!',
        errorDetail: null,
      },
      { status: 200 },
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

    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to create update business!',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
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
