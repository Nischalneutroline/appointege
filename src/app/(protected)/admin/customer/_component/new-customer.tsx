'use client'

import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import InputField from '@/components/custom-form-fields/input-field'
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import PhoneField from '@/components/custom-form-fields/phone-field'
import ToggleSwitch from '@/components/custom-form-fields/toggle-switch'
import { useParams, useRouter } from 'next/navigation'

import { Role } from '@/app/(protected)/admin/customer/_types/customer'

import { PostCustomerData } from '../_api-call/customer-api-call'
import { Address, userSchema } from '../_schema/schema'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import DatePickerField from '@/components/custom-form-fields/date-field'
import SelectField from '@/components/custom-form-fields/select-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import TimePickerField from '@/components/custom-form-fields/time-field'
import LoadingSpinner from '@/components/loading-spinner'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup } from '@radix-ui/react-dropdown-menu'
import { RadioGroupItem } from '@radix-ui/react-radio-group'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import PhoneInputField from '@/components/custom-form-fields/phone-field'
import { closeCustomerForm } from '@/store/slices/customerSlice'

// Form data type
type FormData = z.infer<typeof userSchema>

const NewCustomerForm = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string | undefined
  const isEditMode = !!id
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditMode)

  const { isFormOpen, customerFormMode, currentCustomer, success } =
    useSelector((state: RootState) => state.customer)

  // Initialize form with appropriate schema
  const form = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      isActive: true,
      address: {
        street: '',
        city: '',
        country: '',
        zipCode: '',
      },
    },
  })

  // Fetch customer data for edit mode
  //   useEffect(() => {
  //     if (isEditMode && id) {
  //       const fetchCustomer = async () => {
  //         try {
  //           setIsLoading(true)
  //           const customer = await getCustomerById(id)
  //           if (customer) {
  //             const formData: FormData = {
  //               fullName: customer.name,
  //               email: customer.email,
  //               phone: customer.phone || '',
  //               password: '',
  //               isActive: customer.isActive ?? true,
  //             }
  //             console.log('Setting form data:', formData)
  //             form.reset(formData)
  //           } else {
  //             router.push('/customer')
  //           }
  //         } catch (error) {
  //           console.error('Error fetching customer:', error)
  //           router.push('/customer')
  //         } finally {
  //           setIsLoading(false)
  //         }
  //       }
  //       fetchCustomer()
  //     } else {
  //       setIsLoading(false)
  //     }
  //   }, [id, isEditMode, getCustomerById, form, router])

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    // setIsSubmitting(true)
    console.log(formData, 'FormData')
    // try {
    //   const customerData: PostCustomerData = {
    //     name: formData.fullName,
    //     email: formData.email,
    //     phone: formData.phone,
    //     role: Role.USER,
    //     password: formData.password || undefined,
    //     isActive: formData.isActive,
    //   }

    //   console.log('Submitting customer data:', customerData)

    //   let result
    //   if (isEditMode && id) {
    //     // result = await updateCustomer(id, customerData)
    //   } else {
    //     // result = await createCustomer(customerData)
    //   }

    //   if (result.success) {
    //     router.push('/customer')
    //   }
    //   // Toast is handled by the store
    // } catch (error) {
    //   console.error(
    //     `Error ${isEditMode ? 'updating' : 'creating'} customer:`,
    //     error,
    //   )
    //   // Toast is handled by the store
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  const handleBack = () => {
    dispatch(closeCustomerForm())
    console.log('clicked in the exit button')
    onChange(false)
  }

  return (
    <Dialog onOpenChange={handleBack} open={open}>
      <DialogContent className="md:max-w-2xl overflow-y-scroll">
        <DialogHeader className="gap-0">
          <DialogTitle className="flex justify-center text-blue-700 text-xl">
            {customerFormMode === 'edit'
              ? 'Edit Customer'
              : 'Enter Customer Details'}
          </DialogTitle>
          <DialogDescription className="flex justify-center text-sm text-muted-foreground">
            {customerFormMode === 'edit'
              ? 'Update existing customer details'
              : 'Fill the details below to create an customer on behalf of the customer'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            aria-busy={isSubmitting}
          >
            {/* <div className="grid grid-cols-2 items-center gap-4"> */}
            <InputField name="name" label="Name" placeholder="John" />
            {/* <InputField name="lastName" label="Last Name" placeholder="Doe" /> */}
            {/* </div> */}

            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
            />
            <PhoneInputField
              name="phone"
              label="Phone Number"
              placeholder="Enter your number"
            />
            <div className="grid grid-cols-2 items-center gap-4">
              <InputField
                name="state"
                label="State"
                placeholder="Enter State"
              />
              <InputField name="city" label="City" placeholder="Enter City" />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <InputField
                name="country"
                label="Country"
                placeholder="Enter Country"
              />
              <InputField
                name="zipCode"
                label="Zip Code"
                placeholder="Enter Zip Code"
              />
            </div>

            {/* <div className="grid grid-cols-2 items-center gap-4">
              <DatePickerField
                name="date"
                label="Appointment Date"
                placeholder="Pick a date"
              />
              <TimePickerField
                name="time"
                label="Appointment Time"
                availableTimeSlots={availableTimeSlots}
              />
            </div>
            <TextAreaField
              name="message"
              label="Additional Notes"
              placeholder="Any special requests?"
            /> */}
            {/* <FormField
              control={form.control}
              name="appointmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-4"
                      disabled={isSubmitting}
                    >
                      {appointmentTypeOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <label
                            htmlFor={option.value}
                            className="text-sm font-medium"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className="flex flex-col gap-3 md:flex-row justify-center items-center mt-6">
              <Button
                type="submit"
                variant="default"
                className="w-30 hover:opacity-80 active:outline active:outline-blue-700 transition-colors duration-200"
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
      </DialogContent>
    </Dialog>
  )
}

export default NewCustomerForm
