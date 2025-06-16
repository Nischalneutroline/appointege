"use client"

import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import InputField from "@/components/custom-form-fields/input-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import RadioGroupField from "@/components/custom-form-fields/reminder/radio-group-field"
import CheckboxGroupField from "@/components/custom-form-fields/reminder/checbox-group-field"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Delete,
  Megaphone,
  MessageSquareDot,
  Pen,
  PenLine,
  ShieldUser,
} from "lucide-react"

import AnnouncementCheckboxGroupField from "@/components/custom-form-fields/reminder/announcement-checkbox-group-feild"
import { transformFormToPayload } from "@/features/announcement-offer/action/action"
import {
  createAnnouncement,
  updateAnnouncement,
} from "@/features/announcement-offer/api/api"
import AnnouncementRadioScheduleField from "@/features/reminder/components/announcment/radio-schecule-field"
import { transformAnnouncementData } from "@/features/reminder/action/action"
import { useEffect } from "react"

const targetAudienceOptions = ["All", "Appointments Users", "Cancelled Users"]
const showOnOptions = ["Top Banner", "Push Notification", "Email", "All"]
const autoDeleteOptions = ["1 days", "3 days", "7 days", "30 days", "Never"]
const scheduleOptions = ["Immediately", "Schedule"]

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    description: z.string().min(1, "Description is required"),
    targetAudience: z.string().min(1, "Target audience selection is required"),
    schedule: z.string().min(1, "Schedule option is required"),
    scheduleDate: z.date().optional(),
    scheduleTime: z.string().optional(),
    showOn: z
      .array(z.string())
      .min(1, "At least one show on option must be selected"),
    autoDelete: z.string().min(1, "Auto-delete option is required"),
  })
  .superRefine((data, ctx) => {
    if (data.schedule === "Schedule") {
      if (!data.scheduleDate) {
        ctx.addIssue({
          path: ["scheduleDate"],
          message: "Schedule date is required",
          code: z.ZodIssueCode.custom,
        })
      }
      if (!data.scheduleTime) {
        ctx.addIssue({
          path: ["scheduleTime"],
          message: "Schedule time is required",
          code: z.ZodIssueCode.custom,
        })
      }
    }
  })

export default function EditAnnouncementForm({ id }: { id: string }) {
  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
      description: "",
      targetAudience: "All",
      schedule: "Immediately",
      scheduleDate: new Date(),
      scheduleTime: "",
      showOn: [],
      autoDelete: "7 days",
    },
    resolver: zodResolver(schema),
  })

  const { handleSubmit, reset } = form

  // Fetch the announcement and reset form
  useEffect(() => {
    async function fetchData() {
      const transformedData = await transformAnnouncementData(id)

      reset({
        title: transformedData.title,
        message: transformedData.message,
        description: transformedData.description,
        targetAudience: transformedData.targetAudience,
        schedule: transformedData.schedule,
        scheduleDate: transformedData.scheduleDate,
        scheduleTime: transformedData.scheduleTime,
        showOn: transformedData.showOn,
        autoDelete: transformedData.autoDelete,
      })
    }

    fetchData()
  }, [id, reset])

  const onSubmit = (data: any) => {
    console.log(data, "onSubmit data before transformation")
    console.log("Announcement submitted:", transformFormToPayload(data))
    updateAnnouncement(id, transformFormToPayload(data))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-6">
          {/* Title */}
          <InputField
            name="title"
            label="Title"
            placeholder="Enter Service Name"
            icon={PenLine}
          />
          {/* Description Field */}
          <TextAreaField
            name="description"
            label="Description"
            placeholder="Enter description"
          />

          {/* Message */}
          <TextAreaField
            name="message"
            label="Message"
            placeholder="Details about your service for users to view..."
          />

          {/* Target Audience */}
          <RadioGroupField
            name="targetAudience"
            label="Target Audience"
            options={targetAudienceOptions}
            icon={ShieldUser}
          />

          <div className="flex flex-col gap-8">
            {/* Schedule Announcements */}
            <AnnouncementRadioScheduleField
              name="schedule"
              label="Schedule Announcements"
              dateFieldName="scheduleDate"
              timeFieldName="scheduleTime"
              options={scheduleOptions}
              icon={Megaphone}
            />

            {/* Show On */}
            <AnnouncementCheckboxGroupField
              name="showOn"
              label="Show on"
              options={showOnOptions}
              icon={MessageSquareDot}
            />

            {/* Auto Delete */}
            <RadioGroupField
              name="autoDelete"
              label="Auto-delete expired reminder after?"
              options={autoDeleteOptions}
              icon={Delete}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
