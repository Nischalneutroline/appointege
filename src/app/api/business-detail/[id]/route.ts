import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementOrOfferById } from '@/db/announcement-offer'
import { getAppointmentById } from '@/db/appointment'
import { getBusinessDetailById } from '@/db/businessDetail'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { businessDetailSchema } from '@/app/(protected)/admin/business-setting/_schema/schema'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getBusinessDetailById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: 'Business Detail with id not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch business-detail' },
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
        { error: 'Business ID is required' },
        { status: 400 },
      )
    }

    const parsedData = businessDetailSchema.parse(body)

    // Log parsed data for debugging
    console.log('Parsed Data:', JSON.stringify(parsedData, null, 2))

    const updatedBusiness = await prisma.businessDetail.update({
      where: { id },
      data: {
        name: parsedData.name,
        industry: parsedData.industry,
        email: parsedData.email,
        phone: parsedData.phone,
        website: parsedData.website,
        businessRegistrationNumber: parsedData.businessRegistrationNumber,
        status: parsedData.status,

        // Handle addresses
        address: {
          upsert: parsedData.address.map((addr) => ({
            where: { id: addr.id || '' }, // Use empty string as fallback if no ID
            update: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || '',
            },
            create: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || '',
            },
          })),
        },

        // Handle business availability
        businessAvailability: {
          upsert: parsedData.businessAvailability?.map((availability) => ({
            where: { id: availability.id || '' },
            update: {
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                upsert: availability.timeSlots.map((slot) => ({
                  where: { id: slot.id || '' },
                  update: {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                  create: {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                })),
              },
            },
            create: {
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            },
          })),
        },

        // Handle holidays
        holiday: {
          upsert: parsedData.holiday.map((holiday) => ({
            where: { id: holiday.id || '' },
            update: {
              holiday: holiday.holiday,
              type: holiday.type,
              date: holiday.date,
            },
            create: {
              holiday: holiday.holiday,
              type: holiday.type,
              date: holiday.date,
            },
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
        holiday: true,
      },
    })

    return NextResponse.json(
      { message: 'Business updated successfully', data: updatedBusiness },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error },
        { status: 400 },
      )
    }
    console.error('Prisma Error:', error) // Log the full error for debugging
    return NextResponse.json(
      { error: 'Internal server error', detail: error },
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
        { error: 'Business ID is required' },
        { status: 400 },
      )
    }

    const existingBusiness = await getBusinessDetailById(id)

    if (!existingBusiness) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    })

    if (!deletedBusiness) {
      return NextResponse.json(
        { error: "Business couldn't be deleted" },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { message: 'Business deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete business', detail: error },
      { status: 500 },
    )
  }
}
