import { NextRequest, NextResponse } from "next/server";
import { announcementOrOfferSchema } from "@/features/announcement-offer/schemas/schema";
import {
  AnnouncementOrOffer,
  Showon,
  TargetAudience,
  ExpirationDuration,
} from "@/features/announcement-offer/types/types";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { inngestClient } from "@/tasks/inngest/client";

// Create a new announcement or offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = announcementOrOfferSchema.parse(body);

    // create announcement in prisma
    const newAnnouncement = await prisma.announcementOrOffer.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        audience: parsedData.audience,
        isImmediate: parsedData.isImmediate,
        scheduledAt: parsedData.scheduledAt,
        showOn: parsedData.showOn,
        expiredAt: parsedData.expiredAt,
      },
    });

    try {
      await inngestClient.send({
        name: "announcement/send",
        data: {
          id: newAnnouncement.id,
          lastUpdate: newAnnouncement.updatedAt.getTime(),
        },
        ts: new Date(newAnnouncement.scheduledAt).getTime(),
      });
      return NextResponse.json(
        {
          message: "Announcement or offer created and scheduled successfully",
          announcement: newAnnouncement,
        },
        { status: 201 }
      );
    } catch (scheduleError) {
      // If scheduling fails, still return a 201 but with a warning

      return NextResponse.json(
        {
          message: "Announcement or offer created, but scheduling failed.",
          announcement: newAnnouncement,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    console.log("Error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch all announcements or offers
export async function GET() {
  try {
    const announcementOrOffers = await prisma.announcementOrOffer.findMany();

    if (announcementOrOffers.length === 0) {
      return NextResponse.json(
        { error: "No announcements found" },
        { status: 404 }
      );
    }
    return NextResponse.json(announcementOrOffers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

// Update an existing announcement or offer
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = announcementOrOfferSchema.parse(body);

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Announcement/Offer Id required!" },
        { status: 400 }
      );
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id);

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      );
    }

    // update announcement in prisma
    const updatedAnnouncement = await prisma.announcementOrOffer.update({
      where: { id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        audience: parsedData.audience,
        isImmediate: parsedData.isImmediate,
        scheduledAt: parsedData.scheduledAt,
        showOn: parsedData.showOn,
        expiredAt: parsedData.expiredAt,
      },
    });

    if (!updatedAnnouncement) {
      return NextResponse.json(
        { error: "Announcement/Offer couldn't be updated" },
        { status: 404 }
      );
    }

    try {
      await inngestClient.send({
        name: "announcement/send",
        data: {
          id: updatedAnnouncement.id,
          lastUpdate: updatedAnnouncement.updatedAt.getTime(),
        },
        ts: new Date(updatedAnnouncement.scheduledAt).getTime(),
      });

      return NextResponse.json(
        {
          message: "Announcement updated successfully",
          announcement: updatedAnnouncement,
        },
        { status: 200 }
      );
    } catch (scheduleError) {
      // If scheduling fails, still return a 201 but with a warning

      return NextResponse.json(
        {
          message: "Announcement or offer updated, but scheduling failed.",
          announcement: updatedAnnouncement,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete an announcement or offer
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Announcement Id required!" },
        { status: 400 }
      );
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id);
    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement/Offer not found" },
        { status: 404 }
      );
    }

    const deletedAnnouncement = await prisma.announcementOrOffer.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        message: "Announcement deleted successfully",
        announcement: deletedAnnouncement,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    );
  }
}
