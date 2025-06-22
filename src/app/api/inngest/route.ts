import { serve } from "inngest/next"
import { appointmentReminder } from "@/tasks/inngest/function"
import { inngestClient } from "@/tasks/inngest/client"
import { sendAnnouncement } from "@/tasks/inngest/offerFunction"

export const { GET, POST, PUT } = serve({
  client: inngestClient,
  functions: [appointmentReminder,/* sendAnnouncement */],
})
