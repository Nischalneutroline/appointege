// File: TicketFormModal.tsx

'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import SelectField from '@/components/custom-form-fields/select-field'
import RadioGroupField from '@/components/custom-form-fields/radio-group-field'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/loading-spinner'
import { RootState, AppDispatch } from '@/store/store'
import {
  createTicket,
  fetchTickets,
  updateTicket,
} from '@/store/slices/supportSlice'
import {
  ArrowUpNarrowWide,
  Boxes,
  CircleCheckBig,
  Mail,
  TrendingUp,
  UserRound,
} from 'lucide-react'
import ViewItem from '../../../appointment/_component/view/view-item'
import { cn } from '@/lib/utils'
import { capitalizeFirstLetter } from '@/lib/capitalize-text'
import { NewImageUpload } from '@/components/custom-form-fields/new-image-upload'
import z from 'zod'
import { Priority, TicketCategory, TicketStatus } from '../../_types/types'
import { Role } from '@prisma/client'

const categoryOptions = [
  { label: 'Technical', value: 'TECHNICAL' },
  { label: 'Billing', value: 'BILLING' },
  { label: 'Account', value: 'ACCOUNT' },
  { label: 'General', value: 'GENERAL' },
  { label: 'Support', value: 'SUPPORT' },
  { label: 'Security', value: 'SECURITY' },
  { label: 'Maintenance', value: 'MAINTENANCE' },
  { label: 'Feedback', value: 'FEEDBACK' },
]

const statusOptions = [
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' },
]

const priorityOptions = [
  { label: 'Urgent', value: 'URGENT' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
]

const ticketSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required'),
  ticketDescription: z.string().min(10, 'Ticket description is required'),
  category: z.nativeEnum(TicketCategory),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TicketStatus).optional(),
})

export type TicketFormValues = z.infer<typeof ticketSchema>

const TicketFormModal = ({
  open,
  onChange,
  ticketType,
}: {
  open: boolean
  onChange: (open: boolean) => void
  ticketType: 'Customer' | 'Admin'
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentTicket, ticketFormMode, isTicketFormOpen, success } =
    useSelector((state: RootState) => state.support.ticket)
  const user = useSelector((state: RootState) => state.auth.user)

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      customerName: '',
      email: '',
      subject: '',
      ticketDescription: '',
      category: undefined,
      priority: undefined,
      status: undefined,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filledData, setFilledData] = useState<any | null>()

  useEffect(() => {
    if (ticketFormMode === 'edit' && currentTicket) {
      form.reset({
        customerName: '',
        email: '',
        subject: currentTicket.subject,
        ticketDescription: currentTicket.ticketDescription,
        category: currentTicket.category as TicketCategory,
        priority: currentTicket.priority as Priority,
        status: currentTicket.status as TicketStatus,
      })
      setIsSubmitted(false)
    } else if (!isTicketFormOpen) {
      form.reset()
      setIsSubmitted(false)
    }
  }, [ticketFormMode, currentTicket, isTicketFormOpen, form])

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }, [success, isSubmitting])

  const handleBack = () => onChange(false)

  const onSubmit = async (data: TicketFormValues) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        formData.append(key, String(value))
    })

    try {
      setIsSubmitting(true)
      let result

      if (ticketFormMode === 'edit' && currentTicket?.id) {
        const updatedData = {
          ...data,
          id: currentTicket?.id,
          lastUpdatedById: user?.id,
          lastUpdatedAt: new Date().toISOString(),
          status: data.status || TicketStatus.OPEN,
          userId: user?.id || '',
          userType: ticketType === 'Customer' ? Role.USER : Role.ADMIN,
        }
        await dispatch(updateTicket(updatedData)).unwrap()
        await dispatch(fetchTickets())
        result = updatedData
        setFilledData(result)
      } else {
        const createData = {
          ...data,
          customerName: data.customerName,
          email: data.email,
          assignedTo: '',
          initiatedById: user?.id || '',
          // Need to make changes on it during injest for images
          proofFiles: '',
          resolutionDescription: '',
          status: TicketStatus.OPEN,
          userId: user?.id || '',
          userType: ticketType === 'Customer' ? Role.USER : Role.ADMIN,
        } as const

        await dispatch(createTicket(createData)).unwrap()
        await dispatch(fetchTickets())
        result = createData
        setFilledData(result)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog onOpenChange={handleBack} open={open}>
      <DialogContent
        className={cn(
          'bg-white w-full',
          isSubmitted ? 'max-w-[500px]' : 'max-w-[600px]',
        )}
      >
        {isSubmitted ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-1">
              <CircleCheckBig
                strokeWidth={2.5}
                className="text-[#4caf50] w-6 h-6 sm:w-8 sm:h-8"
              />
              <h2 className="text-blue-900 text-base md:text-xl font-semibold">
                Ticket Created!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Ticket successfully{' '}
                {ticketFormMode === 'edit' ? 'updated' : 'created'} on behalf of
                the customer
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:gap-8 p-3 sm:p-4 bg-[#eff5ff] rounded-lg">
              <ViewItem
                title="Name"
                value={filledData?.customerName || ''}
                icon={<UserRound className="w-4 h-4" />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Email"
                value={filledData?.email || ''}
                icon={<Mail className="w-4 h-4" />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Category"
                value={capitalizeFirstLetter(filledData?.category) || ''}
                icon={<Boxes className="w-4 h-4" />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Status"
                value={capitalizeFirstLetter(filledData?.status) || ''}
                icon={<TrendingUp className="w-4 h-4" />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
              <ViewItem
                title="Priority"
                value={capitalizeFirstLetter(filledData?.priority) || ''}
                icon={<ArrowUpNarrowWide className="w-4 h-4" />}
                bgColor="#dae8fe"
                textColor="#3d73ed"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button onClick={handleBack} className="w-24 sm:w-30">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-blue-700 text-base sm:text-xl">
                {ticketFormMode === 'edit'
                  ? 'Edit A Ticket'
                  : 'Create New Ticket'}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {ticketFormMode === 'edit'
                  ? 'Fill in the details below to edit ticket details'
                  : 'Fill in the details below to create a new ticket for customer issue'}
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 mt-4"
              >
                <InputField
                  name="customerName"
                  label="Customer Name"
                  placeholder="Enter Customer Name"
                  className="border border-blue-200 rounded"
                />
                <InputField
                  name="email"
                  label="Email"
                  placeholder="Enter Email"
                  className="border border-blue-200 rounded"
                />
                <InputField
                  name="subject"
                  label="Issue"
                  placeholder="Enter Issue"
                  className="border border-blue-200 rounded"
                />
                <TextAreaField
                  name="ticketDescription"
                  label="Description"
                  placeholder="Enter Description"
                  className="border border-blue-200 rounded min-h-[100px]"
                />
                <SelectField
                  name="category"
                  label="Category"
                  options={categoryOptions}
                  placeholder="Select category"
                  className="border border-blue-200 rounded"
                />
                {ticketFormMode === 'edit' && (
                  <SelectField
                    name="status"
                    label="Status"
                    options={statusOptions}
                    placeholder="Enter Status"
                    className="border border-blue-200 rounded"
                  />
                )}
                <RadioGroupField
                  name="priority"
                  label="Priority"
                  options={priorityOptions}
                  orientation="horizontal"
                  optionClassName="flex items-center space-x-2 flex-1 min-w-[100px]"
                />
                <NewImageUpload name="proofFiles" label="Attachment (if any)" />
                <div className="flex justify-center mt-4">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-24"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? ticketFormMode === 'edit'
                        ? 'Updating...'
                        : 'Saving...'
                      : ticketFormMode === 'edit'
                        ? 'Update'
                        : 'Save'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TicketFormModal
