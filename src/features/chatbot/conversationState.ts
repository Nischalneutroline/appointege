import { prisma } from "@/lib/prisma";
import {
  extractEmailFromMessage,
  extractFieldsFromMessage,
} from "./extraction";
import { getAppointmentIdByEmail } from "@/db/appointment";
import { NextResponse } from "next/server";
import { canUserCancelAppointment } from "./appointmentHistory";
import { cancelAppointment } from "./agentTool";
import { getServiceIdByName } from "@/db/service";
import { appointmentGraph } from "./appointmentGraph";
import { getUserIdByEmail } from "@/db/user";
import {
  getExampleForMissingFields,
  getMissingBookingFields,
  getMissingCancellationFields,
  isAppointmentAction,
  isCancellationAction,
  isNegativeIntent,
  isServiceDiscoveryQuery,
} from "./intentDetection";

async function getConversationState(userId: string) {
  let state = await prisma.conversationState.findUnique({ where: { userId } });
  if (!state) {
    state = await prisma.conversationState.create({
      data: { userId, flow: null, collectedFields: {}, missingFields: [] },
    });
  }
  return state;
}

async function updateConversationState(userId: string, updates: Partial<any>) {
  return prisma.conversationState.update({
    where: { userId },
    data: updates,
  });
}

async function clearConversationState(userId: string) {
  await prisma.conversationState.update({
    where: { userId },
    data: { flow: null, collectedFields: {}, missingFields: [] },
  });
}

async function handleAgentConversationFlow({
  user,
  userId,
  userMessage,
  state,
}: {
  user: { id: string; role: string; email: string };
  userId: string;
  userMessage: string;
  state: any;
}) {
  //first check if  they dontwant to book appointment or want to end  the current booking or cancellation state
  if (isServiceDiscoveryQuery(userMessage) || isNegativeIntent(userMessage)) {
    console.log("negative");
    await clearConversationState(userId);
    return null;
  }

  // 1. Ongoing cancellation flow
  if (state.flow === "cancellation") {
    console.log("2nd cancellation");
    // Check if the current message is cancellation-related
    if (!isCancellationAction(userMessage)) {
      await clearConversationState(userId);
      return null;
    }
    let updatedFields: Record<string, any> = {
      ...((state.collectedFields as Record<string, any>) || {}),
    };
    /*  const appointmentIdMatch = extractAppointmentId(userMessage);
    if (appointmentIdMatch) updatedFields.appointmentId = appointmentIdMatch; */
    if (!updatedFields.appointmentEmail) {
      const appointmentEmailMatch = extractEmailFromMessage(userMessage);
      if (appointmentEmailMatch)
        updatedFields.appointmentEmail = appointmentEmailMatch;
    }
    if (!updatedFields.appointmentId && updatedFields.appointmentEmail) {
      updatedFields.appointmentId = await getAppointmentIdByEmail(
        updatedFields.appointmentEmail
      );
      if (!updatedFields.appointmentId) {
        return NextResponse.json({
          answer: `Appointment having email '${updatedFields.appointmentEmail}' not found. Please provide a valid email.`,
        });
      }
    }
    const updatedMissingFields = getMissingCancellationFields(updatedFields);
    await updateConversationState(userId, {
      collectedFields: updatedFields,
      missingFields: updatedMissingFields,
    });
    if (updatedMissingFields.length === 0) {
      if (
        !(await canUserCancelAppointment(user, updatedFields.appointmentId))
      ) {
        return NextResponse.json({
          answer: "You do not have permission to cancel this appointment.",
          status: 403,
        });
      }
      const result = await cancelAppointment({
        appointmentId: updatedFields.appointmentId,
      });
      await clearConversationState(userId);
      return NextResponse.json({
        answer: `Appointment (Email: **${updatedFields.appointmentEmail}**) has been **successfully canceled**. Let me know if you need further assistance!`,
        data: result,
      });
    } else {
      return NextResponse.json({
        answer: `Please provide ${updatedMissingFields} to cancel.`,
      });
    }
  }

  // 2. Detect cancellation intent
  if (isCancellationAction(userMessage)) {
    console.log("1st cancellation");
    /* const appointmentId = extractAppointmentId(userMessage); */
    const appointmentEmail = extractEmailFromMessage(userMessage);
    const initialFields: Record<string, any> = {};
    /*     if (appointmentId) initialFields.appointmentId = appointmentId; */
    if (appointmentEmail) initialFields.appointmentEmail = appointmentEmail;

    // If appointmentId is missing but appointmentName is present, resolve appointmentId dynamically
    if (!initialFields.appointmentId && initialFields.appointmentName) {
      initialFields.appointmentId = await getAppointmentIdByEmail(
        initialFields.appointmentEmail
      );
      if (!initialFields.appointmentId) {
        return NextResponse.json({
          answer: `Appointment having '${initialFields.appointmentEmail}' not found. Please provide a valid appointment email.`,
        });
      }
    }
    const initialMissingFields = getMissingCancellationFields(initialFields);

    await updateConversationState(userId, {
      flow: "cancellation",
      collectedFields: initialFields,
      missingFields: initialMissingFields,
    });

    if (initialMissingFields.length === 0) {
      if (
        !(await canUserCancelAppointment(user, initialFields.appointmentId))
      ) {
        return NextResponse.json({
          answer: "You do not have permission to cancel this appointment.",
          status: 403,
        });
      }
      const result = await cancelAppointment({
        appointmentId: initialFields.appointmentId,
      });
      await clearConversationState(userId);
      return NextResponse.json({
        answer: "Appointment cancelled successfully!",
        data: result,
      });
    } else {
      return NextResponse.json({
        answer: `Please provide ${initialMissingFields} to cancel.`,
      });
    }
  }

  // 3. Ongoing booking flow
  if (state.flow === "booking") {
    console.log("2nd book");
    if (!isAppointmentAction(userMessage)) {
      console.log("no agent");
      await clearConversationState(userId);
      // Optionally, return null so the main handler can process the message as a new intent
      return null;
    }

    const extracted = extractFieldsFromMessage(userMessage);
    let updatedFields: Record<string, any> = { ...extracted };
    if (
      state.collectedFields &&
      typeof state.collectedFields === "object" &&
      !Array.isArray(state.collectedFields)
    ) {
      updatedFields = {
        ...(state.collectedFields as Record<string, any>),
        ...extracted,
      };
    }
    if (!updatedFields.serviceId && updatedFields.serviceName) {
      updatedFields.serviceId = await getServiceIdByName(
        updatedFields.serviceName
      );
      if (!updatedFields.serviceId) {
        return NextResponse.json({
          answer: `Service named '${updatedFields.serviceName}' not found. Please provide a valid service name.`,
        });
      }
    }
    if (updatedFields.email) {
      updatedFields.userId = await getUserIdByEmail(updatedFields.email);
      if (!updatedFields.userId) {
        console.log('no user')
        return NextResponse.json({
          answer: `${updatedFields.email} not found. Please provide a valid email to book a appointment.`,
        });
      }
    }

    const updatedMissingFields = getMissingBookingFields(updatedFields);
    const example = getExampleForMissingFields(updatedMissingFields);
    await updateConversationState(userId, {
      collectedFields: updatedFields,
      missingFields: updatedMissingFields,
    });
    if (updatedMissingFields.length === 0) {
      if (
        user.role !== "ADMIN" &&
        user.role !== "SUPERADMIN" &&
        updatedFields.userId !== userId
      ) {
        return NextResponse.json({
          answer:
            "You do not have permission to book an appointment for another user.",
          status: 403,
        });
      }

      const result = await appointmentGraph.invoke({
        userId,
        ...updatedFields,
      });

      if (result.error) {
        return NextResponse.json({
          answer: `Booking failed: ${result.error}`,
          status: 400,
        });
      }
      await clearConversationState(userId);
      return NextResponse.json({
        answer: "Your appointment has been booked successfully!",
        data: result,
      });
    } else {
      return NextResponse.json({
        answer:
          `Please provide: ${updatedMissingFields.join(", ")}\n` +
          (example ? `_e.g._: ${example}` : ""),
      });
    }
  }

  // 4. New booking intent
  if (isAppointmentAction(userMessage)) {
    console.log("1st book");
    /* const parsedUserId = parseUserIdFromMessage(userMessage); */
    /* const bookingUserId = parsedUserId || userId; */
    const extracted = extractFieldsFromMessage(userMessage);
    const initialFields: Record<string, any> = { ...extracted, userId };
    if (!initialFields.serviceId && initialFields.serviceName) {
      initialFields.serviceId = await getServiceIdByName(
        initialFields.serviceName
      );
      if (!initialFields.serviceId) {
        return NextResponse.json({
          answer: `Service named '${initialFields.serviceName}' not found. Please provide a valid service name.`,
        });
      }
    }

    if (initialFields.email) {
      initialFields.userId = await getUserIdByEmail(initialFields.email);
      if (!initialFields.userId) {
        return NextResponse.json({
          answer: `${initialFields.email} not found. Please provide a valid email to book a appointment.`,
        });
      }
    }

    const initialMissingFields = getMissingBookingFields(initialFields);
    const example = getExampleForMissingFields(initialMissingFields);
    await updateConversationState(userId, {
      flow: "booking",
      collectedFields: initialFields,
      missingFields: initialMissingFields,
    });
    if (initialMissingFields.length === 0) {
      if (
        user.role !== "ADMIN" &&
        user.role !== "SUPERADMIN" &&
        initialFields.userId !== userId
      ) {
        return NextResponse.json({
          answer:
            "You do not have permission to book an appointment for another user.",
          status: 403,
        });
      }
      const result = await appointmentGraph.invoke(initialFields);
       if (result.error) {
        return NextResponse.json({
          answer: `Booking failed: ${result.error}`,
          status: 400,
        });
      }
      await clearConversationState(userId);
      return NextResponse.json({
        answer: "Appointment booked successfully!",
        data: result,
      });
    } else {
      return NextResponse.json({
        answer:
          `Please provide: ${initialMissingFields.join(", ")}\n` +
          (example ? `_e.g._: ${example}` : ""),
      });
    }
  }

  // If no known flow, return null so the route can continue with fallback logic (e.g., RAG/LLM)
  return null;
}

export {
  getConversationState,
  clearConversationState,
  handleAgentConversationFlow,
  updateConversationState,
};
