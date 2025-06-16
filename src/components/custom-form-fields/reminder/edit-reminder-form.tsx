"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import InputField from "@/components/custom-form-fields/input-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import ReminderSelectField from "./select-field"
import CheckboxGroupField from "./checbox-group-field"
import ScheduleField from "./modified-schedule-field"
import RadioGroupField from "./radio-group-field"
import {
  AudioWaveform,
  BetweenHorizonalStart,
  PenLine,
  Send,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import {
  fetchReminderData,
  serviceOption,
  transformReminderPayloadWithOffset,
  transformReminderToFormValues,
} from "@/features/reminder/action/action"
import { createReminder, getReminderById } from "@/features/reminder/api/api"

const reminderTypes = [
  "Upcoming",
  "Follow-up",
  "Cancellation",
  "Missed",
  "Custom",
]

const whenOptions: any = {
  Upcoming: [
    "48 hours before appointment",
    "24 hours before appointment",
    "1 hours before appointment",
    "Schedule reminder",
  ],
  "Follow-up": [
    "Same day after appointment",
    "1 days after appointment",
    "2 days after appointment",
    "Schedule follow-up",
  ],
  Missed: [
    "15 minutes after missed",
    "1 hour after missed",
    "24 hours after missed",
    "48 hours after missed",
    "Schedule follow-up",
  ],
  Cancellation: [
    "15 minutes after cancellation",
    "1 hour after cancellation",
    "24 hours after cancellation",
    "48 hours after cancellation",
    "Schedule follow-up",
  ],
  Custom: ["Schedule reminder"],
}

const sendViaOptions = ["Email", "SMS", "Push Notification"]
const autoDeleteOptions = ["7 days", "30 days", "Never"]
const defaultMessages: any = {
  "Follow-up":
    "Thank you for visiting us on {selected_appointment_date} for {selected_service_name}. We value your feedback! Please take a moment to share your experience.",
  Upcoming:
    "You have an appointment scheduled on {selected_appointment_date} at {selected_appointment_time} for {selected_service_name}. Please be on time. If you need to reschedule, visit your dashboard.",
  Missed:
    "It looks like you missed your appointment on {selected_appointment_date}. Please contact us if you'd like to reschedule.",
  Cancellation:
    "Your appointment on {selected_appointment_date} was cancelled. Let us know if you'd like to rebook.",
  Custom: "Custom reminder for your appointment. Please check your schedule.",
  Default: "Reminder for your appointment. Please check your schedule.",
}

export default function EditReminderForm({ id }: { id: string }) {
  const [reminderData, setReminderData] = useState()

  const form = useForm({
    defaultValues: {
      reminderCategory: "Custom",
      type: "",
      appointment: "",
      subject: "",
      service: "",
      description: "",
      when: ["2 days after appointment"],
      scheduleDate: "",
      scheduleTime: "",
      sendVia: [...sendViaOptions],
      autoDelete: "7 days",
      message: defaultMessages["Follow-up"],
    },
  })
  useEffect(() => {
    if (reminderData) {
      const {
        autoDelete,
        description,
        message,
        reminderCategory,
        scheduleDate,
        scheduleTime,
        sendVia,
        service,
        subject,
        type,
        when,
      } = transformReminderToFormValues(reminderData)

      console.log(type, "type", when, "when")
      form.reset({
        reminderCategory: reminderCategory || "Custom",
        subject: subject || "",
        description: description || "",
        when: when || ["2 days after appointment"],
        service: service[0] || "cm9y4y2js0014urct26wzqsc4",
        scheduleDate: scheduleDate || "",
        scheduleTime: scheduleTime || "",
        sendVia: sendVia || [...sendViaOptions],
        autoDelete: autoDelete || "7 days",
        message: message || defaultMessages["Follow-up"],
      })
    }
  }, [reminderData, form])

  const serviceUpdatedOptions = serviceOption

  function mapServicesToSelectOptions(services: any) {
    return services.map((service: any) => ({
      value: service.id,
      label: service.title,
    }))
  }

  const serviceOptions = mapServicesToSelectOptions(serviceUpdatedOptions)

  const { watch, setValue, handleSubmit, reset } = form
  const selectedType = watch("type")

  useEffect(() => {
    const fetchReminderData = async (id: string) => {
      const data = await getReminderById(id)
      setReminderData(data)
    }
    fetchReminderData(id)
  }, [selectedType, setValue])

  const onSubmit = async (data: any) => {
    console.log("Reminder submitted:", data)
    const transformedData = transformReminderPayloadWithOffset(data)
    console.log("Transformed data:", transformedData)

    await createReminder(transformedData)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <Tabs
              defaultValue="Custom"
              onValueChange={(value) => setValue("reminderCategory", value)}
            >
              <TabsList>
                <TabsTrigger value="Default">Default</TabsTrigger>
                <TabsTrigger value="Custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Reminder Type */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <BetweenHorizonalStart className="size-4 text-gray-500" />
                <Label>Reminder Type</Label>
              </div>
              <Tabs defaultValue={selectedType} className="mt-2">
                <TabsList className="grid grid-cols-5">
                  {reminderTypes.map((type) => (
                    <TabsTrigger
                      key={type}
                      value={type}
                      className="text-xs"
                      onClick={() => setValue("type", type)}
                    >
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedType === "Follow-up"
                  ? "📌 Follow up with users after their appointment, requesting feedback or next steps."
                  : selectedType === "Missed"
                    ? "📌 Reminder sent for missed appointments."
                    : selectedType === "Cancellation"
                      ? "📌 Notify users about cancelled appointments."
                      : selectedType === "Custom"
                        ? "📌 Create a custom reminder with flexible scheduling."
                        : "📌 Notify users about their upcoming appointments."}
              </p>
            </div>

            {/* Subject Field */}
            <InputField
              name="subject"
              label="Subject"
              placeholder="Enter subject"
              icon={PenLine}
            />

            {/* Description Field */}
            <TextAreaField
              name="description"
              label="Description"
              placeholder="Enter description"
            />

            {/* Appointment Selection */}
            <ReminderSelectField
              name="service"
              label="Choose Service"
              options={serviceOptions}
              placeholder="Select service to set reminder"
              icon={SlidersHorizontal}
            />

            {/* When to Send */}
            <div className="space-y-2 ">
              <div className="flex gap-1">
                <Send strokeWidth={1.5} className="size-4 text-gray-500" />
                <Label>When to send?</Label>
              </div>

              <CheckboxGroupField
                name="when"
                label=""
                options={whenOptions[selectedType]?.filter(
                  (label: any) => !label?.toLowerCase().includes("schedule")
                )}
              />

              <ScheduleField
                name="when"
                label={
                  whenOptions[selectedType]?.find((label: any) =>
                    label.toLowerCase().includes("schedule")
                  ) || "Schedule reminder"
                }
                dayFieldName="scheduleDay"
                hourFieldName="scheduleHour"
                minuteFieldName="scheduleMinute"
              />
            </div>

            {/* non input fields */}
            <div className="flex flex-col gap-8">
              {/* Send Via */}
              <CheckboxGroupField
                name="sendVia"
                label="Send via"
                options={sendViaOptions}
                icon={AudioWaveform}
                className="space-y-2"
              />

              {/* Auto Delete */}
              <RadioGroupField
                name="autoDelete"
                label="Auto-delete expired reminder after?"
                options={autoDeleteOptions}
                icon={Trash2}
                className="space-y-2"
              />
            </div>
            {/* Message */}
            <TextAreaField
              name="message"
              label="Message"
              placeholder="Enter message"
            />

            <Button type="submit" className="w-full">
              Save
            </Button>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}
