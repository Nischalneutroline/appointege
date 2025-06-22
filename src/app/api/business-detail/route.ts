import { NextRequest, NextResponse } from "next/server";
import { businessDetailSchema } from "@/features/business-detail/schemas/schema";
import { BusinessDetail } from "@/features/business-detail/types/types";
import { ZodError } from "zod";
import {
  BusinessStatus,
  WeekDays,
  HolidayType,
  AvailabilityType,
} from "@/features/business-detail/types/types";
import { prisma } from "@/lib/prisma";
import { getBusinessDetailById } from "@/db/businessDetail";

// Create a new business detail
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = businessDetailSchema.parse(body);

    // create business in prisma

    const existingBusiness = await prisma.businessDetail.findUnique({
      where: { email: parsedData.email },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Business with this email already exists!" },
        { status: 400 }
      );
    }

    const newBusiness = await prisma.businessDetail.create({
      data: {
        name: parsedData.name,
        industry: parsedData.industry,
        email: parsedData.email,
        phone: parsedData.phone,
        website: parsedData.website,
        businessRegistrationNumber: parsedData.businessRegistrationNumber,
        status: parsedData.status,
        address: {
          create: parsedData.address.map((address) => ({
            street: address.street,
            city: address.city,
            country: address.country,
            zipCode: address.zipCode,
            googleMap: address.googleMap || "",
          })),
        },
        businessAvailability: {
          create: parsedData.businessAvailability.map((availability) => ({
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
        holiday: {
          create: parsedData.holiday.map((holiday) => ({
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
        holiday: true,
      },
    });

    if (!newBusiness) {
      return NextResponse.json(
        { error: "Failed to create business" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Business created successfully!", business: newBusiness },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", detail: error },
      { status: 500 }
    );
  }
}

// Fetch all business details
export async function GET() {
  try {
    const businessDetails = await prisma.businessDetail.findMany({
      include: {
        address: true,
        businessAvailability: {
          include: {
            timeSlots: true,
          },
        },
        holiday: true,
      },
    });

    if (businessDetails.length === 0) {
      return NextResponse.json(
        { error: "No business details found" },
        { status: 404 }
      );
    }

    return NextResponse.json(businessDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch business details", details: error },
      { status: 500 }
    );
  }
}

// Update an existing business detail
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const parsedData = businessDetailSchema.parse(body);

    // Log parsed data for debugging
    console.log("Parsed Data:", JSON.stringify(parsedData, null, 2));

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
          upsert: parsedData.address.map((addr: any) => ({
            where: { id: addr.id || "" }, // Use empty string as fallback if no ID
            update: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || "",
            },
            create: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || "",
            },
          })),
        },

        // Handle business availability
        businessAvailability: {
          upsert: parsedData.businessAvailability.map((availability: any) => ({
            where: { id: availability.id || "" },
            update: {
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                upsert: availability.timeSlots.map((slot: any) => ({
                  where: { id: slot.id || "" },
                  update: {
                    type: slot.type,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                  create: {
                    type: slot.type,
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
                create: availability.timeSlots.map((slot: any) => ({
                  type: slot.type,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            },
          })),
        },

        // Handle holidays
        holiday: {
          upsert: parsedData.holiday.map((holiday: any) => ({
            where: { id: holiday.id || "" },
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
    });

    return NextResponse.json(
      { message: "Business updated successfully", data: updatedBusiness },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Prisma Error:", error); // Log the full error for debugging
    return NextResponse.json(
      { error: "Internal server error", detail: error },
      { status: 500 }
    );
  }
}

// Delete a business detail
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 }
      );
    }

    const existingBusiness = await getBusinessDetailById(id);

    if (!existingBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    });

    if (!deletedBusiness) {
      return NextResponse.json(
        { error: "Business couldn't be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Business deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete business", detail: error },
      { status: 500 }
    );
  }
}
