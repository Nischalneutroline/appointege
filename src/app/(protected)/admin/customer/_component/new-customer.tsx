'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import PhoneInputField from '@/components/custom-form-fields/phone-field'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingSpinner from '@/components/loading-spinner'
import {
  CircleCheckBig,
  Mail,
  Phone,
  UserRound,
  Eye,
  EyeOff,
} from 'lucide-react'
import { format } from 'date-fns'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { User, Role, Address, PostCustomerData } from '../_types/customer'
import { normalDateToIso } from '@/utils/utils'
import {
  storeCreateCustomer,
  updateCustomer,
  closeCustomerForm,
} from '@/store/slices/customerSlice'
import { toast } from 'sonner'

interface CustomerFormData {
  name: string
  email: string
  password?: string
  phone?: string
}

const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+\d{1,4}\s\d{7,}$/, 'Valid phone number is required!')
    .optional(),
})

const CustomerForm = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { isFormOpen, customerFormMode, currentCustomer, success } =
    useSelector((state: RootState) => state.customer)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filledData, setFilledData] = useState<CustomerFormData | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  })

  useEffect(() => {
    console.log('Customer form reset triggered:', {
      isFormOpen,
      customerFormMode,
      currentCustomer,
    }) // Debug log
    if (isFormOpen && customerFormMode === 'edit' && currentCustomer) {
      form.reset({
        name: currentCustomer.name,
        email: currentCustomer.email,
        password: '', // Password not pre-filled for security
        phone: currentCustomer.phone || '', // Use raw phone value
      })
    } else if (!isFormOpen) {
      form.reset()
    }
  }, [isFormOpen, customerFormMode, currentCustomer, form])

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }
  }, [success, isSubmitting])

  const onSubmit = async (formData: CustomerFormData) => {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors)
      toast.error('Please correct the form errors and try again.')
      return
    }

    if (!user?.id) {
      console.error('User is not authenticated')
      toast.error('You must be logged in to create or update a customer')
      return
    }

    try {
      setIsSubmitting(true)
      const customerData: PostCustomerData = {
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password,
        phone: formData.phone,
        role:
          customerFormMode === 'edit' && currentCustomer?.role
            ? currentCustomer.role
            : Role.USER,
      }

      console.log('Submitting customer:', customerData)

      if (customerFormMode === 'edit' && currentCustomer?.id) {
        await dispatch(
          updateCustomer({
            id: currentCustomer.id,
            data: customerData,
          }),
        ).unwrap()
      } else {
        await dispatch(storeCreateCustomer(customerData)).unwrap()
      }
      setFilledData(formData)
    } catch (error: any) {
      console.error(
        `Error ${customerFormMode === 'edit' ? 'updating' : 'creating'} customer:`,
        error,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    dispatch(closeCustomerForm())
    onChange(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <>
      <style jsx>{`
        .dialog-content {
          box-sizing: border-box;
          width: 90vmin;
          max-width: min(500px, 90vw);
          min-width: 280px;
          max-height: 85vh;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0.5rem;
          font-size: 1rem;
          line-height: 1.5;
          padding: 1rem;
        }
        @media (min-width: 640px) {
          .dialog-content {
            max-width: min(600px, 90vw);
            padding: 1.5rem;
            font-size: 1.125rem;
          }
        }
        @media (max-width: 400px) {
          .dialog-content {
            width: 95vmin;
            max-width: 95vw;
            min-width: 260px;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          .dialog-content h2 {
            font-size: 1rem;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
        @media (max-height: 600px) {
          .dialog-content {
            max-height: 90vh;
            padding: 0.75rem;
          }
        }
        @media screen and (max-width: 1024px) and (min-resolution: 192dpi) {
          .dialog-content {
            width: 92vmin;
            max-width: min(550px, 92vw);
          }
        }
        @media (prefers-contrast: high) {
          .dialog-content {
            border: 2px solid #000 !important;
            background: #fff !important;
          }
        }
      `}</style>
      <Dialog onOpenChange={handleBack} open={open}>
        <DialogContent
          className="dialog-content bg-white shadow-lg"
          style={{ boxSizing: 'border-box' }}
          aria-describedby="dialog-description"
        >
          {!isSubmitted && (
            <DialogHeader className="">
              <DialogTitle className="text-center text-blue-700 text-base sm:text-lg md:text-xl font-semibold">
                {isSubmitted
                  ? 'Customer Confirmation'
                  : customerFormMode === 'edit'
                    ? 'Edit Customer'
                    : 'Create New Customer'}
              </DialogTitle>
              <DialogDescription
                id="dialog-description"
                className="text-center text-xs sm:text-sm text-muted-foreground"
              >
                {isSubmitted
                  ? 'Review the details of the confirmed customer action'
                  : customerFormMode === 'edit'
                    ? 'Update existing customer details'
                    : 'Fill the details below to create a new customer'}
              </DialogDescription>
            </DialogHeader>
          )}
          {isSubmitted ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <CircleCheckBig
                  strokeWidth={2.5}
                  className="text-[#4caf50] w-6 h-6 sm:w-8 sm:h-8"
                />
                <h2 className="text-blue-700 text-base sm:text-lg font-semibold">
                  Customer Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  Customer successfully{' '}
                  {customerFormMode === 'edit' ? 'updated' : 'created'}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-[#eff5ff] rounded-lg">
                <ViewItem
                  title="Name"
                  value={filledData?.name || ''}
                  icon={<UserRound className="w-4 h-4" strokeWidth={2.5} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Email"
                  value={filledData?.email || ''}
                  icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Phone"
                  value={filledData?.phone || ''}
                  icon={<Phone className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => {
                    setIsSubmitted(false)
                    handleBack()
                  }}
                  className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3 sm:gap-4"
                aria-busy={isSubmitting}
              >
                <InputField
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <div className="relative">
                  <InputField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 bottom-3 text-gray-400 cursor-pointer hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <PhoneInputField
                  name="phone"
                  label="Phone"
                  placeholder="Enter your number"
                  className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
                />
                <div className="flex flex-col gap-3 sm:flex-row justify-center items-center mt-4 sm:mt-6">
                  <Button
                    type="submit"
                    variant="default"
                    className="w-24 sm:w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200 text-xs sm:text-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner
                        text={
                          customerFormMode === 'edit'
                            ? 'Updating...'
                            : 'Creating...'
                        }
                      />
                    ) : customerFormMode === 'edit' ? (
                      'Update'
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Placeholder for ViewItem (assuming it’s a component from the original code)
const ViewItem = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: {
  title: string
  value: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
}) => (
  <div
    className="flex items-center gap-2 p-2 rounded-md"
    style={{ backgroundColor: bgColor }}
  >
    <div style={{ color: textColor }}>{icon}</div>
    <div>
      <div className="text-xs text-gray-600">{title}</div>
      <div className="text-sm font-medium" style={{ color: textColor }}>
        {value}
      </div>
    </div>
  </div>
)

export default CustomerForm
