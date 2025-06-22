// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { eventSchema } from "@/features/individual-event/schemas/schema";
// import { ZodError } from "zod";

// // Zoom API credentials
// const ZOOM_API_KEY = process.env.ZOOM_API_KEY; // Store this securely
// const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET; // Store this securely

// // Function to create Zoom meeting and return the link
// async function createZoomMeeting(): Promise<string> {
//     try {
//       const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${ZOOM_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           topic: "New Event Meeting", // You can customize this
//           type: 2, // Scheduled meeting
//           start_time: new Date().toISOString(), // Set start time
//           duration: 60, // Set duration in minutes
//           settings: {
//             host_video: true,
//             participant_video: true,
//             audio: "voip", // Can set to 'voip' or 'both'
//           },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create Zoom meeting');
//       }

//       const data = await response.json();
//       console.log('data',data);
//       return data.join_url; // Zoom meeting link
//     } catch (error) {
//       console.error("Error creating Zoom meeting:", error);
//       throw new Error('Failed to create Zoom meeting');
//     }
//   }

// export async function POST(req: NextRequest) {
//     try {
//       const body = await req.json();

//       // Validate the body using the Zod schema
//       const parsedData = eventSchema.parse(body);

//       // Create the event type with nested availability creation
//       const eventType = await prisma.event.create({
//         data: {
//           title: parsedData.title,
//           description: parsedData.description,
//           duration: parsedData.duration,
//           location: parsedData.location,
//           slug: parsedData.slug,
//           userId: parsedData.userId,
//           availability: {
//             create: parsedData.availability?.map((availability) => ({
//               dayOfWeek: availability.dayOfWeek,
//               startTime: availability.startTime,
//               endTime: availability.endTime,
//             })),
//           },
//         },
//       });

//       // Create Zoom meeting and get the link
//       const zoomLink = await createZoomMeeting();

//       // Now, you can create a meeting record for the event
//       const meeting = await prisma.meeting.create({
//         data: {
//           eventTypeId: eventType.id,
//           timeSlot: new Date().toISOString(), // Set appropriate time for meeting
//           videoUrl: zoomLink,
//           videoProvider: "ZOOM",
//         },
//       });

//       return NextResponse.json({ message: 'Event created successfully', eventType, meeting }, { status: 201 });
//     } catch (error) {
//       if (error instanceof ZodError) {
//         return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
//       }
//       console.error(error);
//       return NextResponse.json({ error: 'Internal server error', message: error }, { status: 500 });
//     }
//   }
