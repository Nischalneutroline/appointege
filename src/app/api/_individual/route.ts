// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { individualSchema } from "@/features/individual/schemas/schema";
// import { ZodError } from "zod";

// export async function POST(req: NextRequest) {
//   const userId = "123231231"; //fetch userId from clerk authentication
//   if (!userId) return new Response("Unauthorized", { status: 401 });

//   const data = await req.json();
//   const parsedData = individualSchema.parse(data);

//   try {
//     const individual = await prisma.individual.create({
//       data: {
//         bio: parsedData.bio,
//         position: parsedData.position,
//         profileImage: parsedData.profileImage,
//         country: parsedData.country,
//         userId: userId, // Assign Clerk's user ID here
//       },
//     });

//     return NextResponse.json(individual, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   const individuals = await prisma.individual.findMany({
//     include: { user: true, eventTypes: true },
//   });

//   return NextResponse.json(individuals);
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const { id } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Individual ID is required!" },
//         { status: 400 }
//       );
//     }

//     const parsedData = individualSchema.parse(body);

//     // Fetch the existing individual to check if it exists
//     const existingIndividual = await prisma.individual.findUnique({
//       where: { id: id },
//     });

//     if (!existingIndividual) {
//       return NextResponse.json(
//         { error: "Individual not found" },
//         { status: 404 }
//       );
//     }

//     // Update individual profile
//     const updatedIndividual = await prisma.individual.update({
//       where: { id: id },
//       data: {
//         bio: parsedData.bio,
//         position: parsedData.position,
//         profileImage: parsedData.profileImage,
//         country: parsedData.country,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Individual profile updated successfully",
//         individual: updatedIndividual,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return NextResponse.json(
//         { error: "Validation failed", details: error.errors[0].message },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Internal server error", message: error },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return NextResponse.json(
//         { error: "Individual ID is required!" },
//         { status: 400 }
//       );
//     }

//     // Fetch the existing individual to check if it exists
//     const existingIndividual = await prisma.individual.findUnique({
//       where: { id: id },
//     });

//     if (!existingIndividual) {
//       return NextResponse.json(
//         { error: "Individual not found" },
//         { status: 404 }
//       );
//     }

//     // Delete the individual profile
//     const deletedIndividual = await prisma.individual.delete({
//       where: { id: id },
//     });

//     if (!deletedIndividual) {
//       return NextResponse.json(
//         { error: "Individual could not be deleted" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Individual profile deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete individual profile", message: error },
//       { status: 500 }
//     );
//   }
// }
