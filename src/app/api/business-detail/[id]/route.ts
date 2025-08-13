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
        {
          data: null,
          status: 400,
          success: false,
          message: 'Business ID is required!',
          errorDetail: null,
        },
        { status: 400 },
      )
    }

    const parsedData = businessDetailSchema.parse(body)

    // Check if business exists
    const business = await getBusinessDetailById(id)
    if (!business) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'Business Detail with id not found!',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Use a transaction to delete the existing business and create a new one with the same ID
    // Delete the business (cascading deletes handle related records)
    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    })

    console.log('deletedBusiness', deletedBusiness)

    if (deletedBusiness) {
      const newBusiness = await prisma.businessDetail.create({
        data: {
          name: parsedData?.name,
          industry: parsedData?.industry,
          email: parsedData?.email,
          phone: parsedData?.phone,
          website: parsedData?.website,
          businessRegistrationNumber: parsedData?.businessRegistrationNumber,
          taxID: parsedData?.taxID,
          businessType: parsedData?.businessType,
          status: parsedData?.status,
          businessOwner: parsedData?.businessOwner,
          timeZone: parsedData?.timeZone,
          address: {
            create: parsedData?.address?.map((address) => ({
              street: address.street,
              city: address.city,
              state: address.state,
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
                create: availability.timeSlots.map((timeSlot) => ({
                  type: timeSlot.type,
                  startTime: timeSlot.startTime,
                  endTime: timeSlot.endTime,
                })),
              },
            })),
          },
          serviceAvailability: {
            create: parsedData.serviceAvailability?.map((availability) => ({
              weekDay: availability.weekDay as WeekDays,
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
              date: holiday.date,
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
      return NextResponse.json(
        {
          data: newBusiness,
          status: 200,
          success: true,
          message: 'Business updated successfully!',
          errorDetail: null,
        },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        {
          data: null,
          status: 500,
          success: false,
          message: 'Failed to update business!',
          errorDetail: 'Business deletion returned null',
        },
        { status: 500 },
      )
    }
    // Create a new business with the same ID
  } catch (error) {
    console.error('Prisma Error:', error)
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
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to update business!',
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
