import { prisma } from "../lib/prisma";

// get service by id
async function getAppointmentById(id: string) {
  return await prisma.appointment.findUnique({
    where: {
      id,
    },
  });
}

// Fetch appointment ID by appointment name
async function getAppointmentIdByEmail(
  appointmentEmail: string
): Promise<string | null> {
  const appointment = await prisma.appointment.findFirst({
    where: { email: appointmentEmail },
    select: { id: true },
  });
  return appointment ? appointment.id : null;
}

export { getAppointmentById, getAppointmentIdByEmail };
