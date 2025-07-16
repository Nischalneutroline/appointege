import InputField from '@/components/custom-form-fields/input-field'
import { NewImageUpload } from '@/components/custom-form-fields/new-image-upload'

import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { updateBusinessDetailForm } from '@/store/slices/businessSlice'
import { AppDispatch } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { ArrowBigLeft, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'

export const industryOptions = [
  { label: 'Salon & Spa', value: 'Beauty' },
  { label: 'Medical & Health', value: 'Medical & Health' },
  { label: 'Automotive Services', value: 'Automotive Services' },
  { label: 'Home Repair & Maintenance', value: 'Home Repair & Maintenance' },
  { label: 'Fitness & Wellness', value: 'Fitness & Wellness' },
  { label: 'Education & Training', value: 'Education & Training' },
  { label: 'Legal & Consulting', value: 'Legal & Consulting' },
  { label: 'IT Services', value: 'IT Services' },
]

const visibilityOptions = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Suspended', value: 'SUSPENDED' },
]

const businessDetailSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Business name contains invalid characters'),

  industry: z
    .string({
      required_error: 'Please select an industry',
    })
    .min(1, 'Industry is required'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters'),

  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\s-]+$/, 'Please enter a valid phone number'),

  website: z.string().refine((value) => {
    if (!value) return true // Allow empty
    try {
      new URL(value.startsWith('http') ? value : `https://${value}`)
      return true
    } catch {
      return false
    }
  }, 'Please enter a valid URL (e https://example.com)'),
  businessType: z.string().min(1, 'Business type is required'),
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  state: z.string().min(1, 'State is required').optional(),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  googleMap: z.string().min(1, 'Google Map is required').url(),
  registrationNumber: z
    .string()
    .min(1, 'Business registration number is required'),
  taxId: z.any().optional(),
  logo: z.any().refine((file) => file !== null, 'Business logo is required'),
})

const serviceOptions = [
  { label: 'Physical', value: 'PHYSICAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
  { label: 'All', value: 'ALL' },
]
type BusinessDetailFormValues = z.infer<typeof businessDetailSchema>

//
// ---------------------------------Component starts here-----------------------------------------------------
const BusinessDetail = ({
  setTab,
  data,
  onBack,
  onSubmitSuccess,
}: {
  setTab: (tab: string) => void
  data?: any
  onBack?: () => void
  onSubmitSuccess?: () => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const defaultValues = {
    businessName: data?.name || '',
    industry: data?.industry || '',
    email: data?.email || '',
    phone: data?.phone || '',
    businessType: data?.businessType || '',
    website: data?.website || '',
    street: data?.address?.[0]?.street || '',
    city: data?.address?.[0]?.city || '',
    state: data?.address?.[0]?.state || '',
    zipCode: data?.address?.[0]?.zipCode || '',
    country: data?.address?.[0]?.country || '',
    googleMap: data?.address?.[0]?.googleMap || '',
    registrationNumber:
      data?.businessRegistrationNumber || data?.registrationNumber || '',
    taxId: data?.taxId || '',
    logo: data?.logo || null,
  }
  // const [isInitialized, setIsInitialized] = useState(false)
  const form = useForm<BusinessDetailFormValues>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues,
  })
  console.log(data?.name, 'data')
  // Handle form reset when data changes
  useEffect(() => {
    if (data) {
      const address = Array.isArray(data.address)
        ? data.address[0]
        : data.address || {}
      form.reset({
        businessName: data?.name,
        industry: data.industry || '',
        email: data.email || '',
        phone: data.phone || '',
        businessType: data.businessType || '',
        website: data.website || '',
        city: address.city || '',
        street: address.street || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || '',
        googleMap: address.googleMap || '',
        registrationNumber:
          data.businessRegistrationNumber || data.registrationNumber || '',
        taxId: data.taxId || '',
        logo: data.logo || null,
      })
    }
  }, [data, form])

  const STORAGE_KEY = 'business-detail-form'

  // Load data into form
  useEffect(() => {
    // Check if we should use localStorage data
    const loadFormData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          console.log('Loading form data from localStorage:', parsed)
          return parsed
        }
      } catch (e) {
        console.error('Failed to load from localStorage:', e)
      }
      return null
    }

    // Transform API data to form format
    const transformApiData = (apiData: any) => {
      if (!apiData) return null

      const address = Array.isArray(apiData.address)
        ? apiData.address[0]
        : apiData.address || {}

      return {
        businessName: apiData.name || '',
        industry: apiData.industry || '',
        email: apiData.email || '',
        phone: apiData.phone || '',
        businessType: apiData.businessType || '',
        website: apiData.website || '',
        city: address.city || '',
        street: address.street || '',
        state: address.state || '',
        zipCode: address.zipCode || '',
        country: address.country || '',
        googleMap: address.googleMap || '',
        registrationNumber:
          apiData.businessRegistrationNumber ||
          apiData.registrationNumber ||
          '',
        taxId: apiData.taxId || '',
        logo: apiData.logo || null,
      }
    }

    // Try to load from localStorage first
    const storedData = loadFormData()
    if (storedData) {
      form.reset(storedData)
    }

    // Then update with API data if available
    if (data) {
      const apiFormData = transformApiData(data)
      if (apiFormData) {
        console.log('Loading form data from API:', apiFormData)
        form.reset(apiFormData)
      }
    }
  }, [data, form])

  // Submit Handler
  const onSubmit = (formData: BusinessDetailFormValues) => {
    // Save form data to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    } catch (e) {
      console.error('Failed to save form data to localStorage:', e)
    }

    const updatedData = {
      name: formData.businessName,
      businessRegistrationNumber: formData.registrationNumber,
      industry: formData.industry,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      businessType: formData.businessType,
      address: [
        {
          street: formData.street,
          city: formData.city,
          state: formData.state || '',
          zipCode: formData.zipCode,
          country: formData.country,
          googleMap: formData.googleMap,
        },
      ],
      taxId: formData.taxId,
      // Only include the logo if it's a string (URL), not a File/Blob
      logo: typeof formData.logo === 'string' ? formData.logo : null,
      status: data.status || 'ACTIVE',
    }
    console.log(updatedData, 'updatedData')
    dispatch(updateBusinessDetailForm(updatedData))
    localStorage.setItem('business-detail-form', JSON.stringify(updatedData))
    toast.success('Business detail updated successfully')
    // setTab('business-availability')
    onSubmitSuccess?.()
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-8 ">
          <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
            <div className="flex gap-2.5">
              <Image
                src="/assets/picon_business.svg"
                alt="Business Icon"
                width={20}
                height={15}
              />
              <div className="font-semibold text-lg text-[#111827]">
                {' '}
                Business Information
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <InputField
                    name="businessName"
                    className="label:font-semibold"
                    label="Business Name"
                    placeholder="Enter Business Name"
                  />
                  <SelectField
                    name="industry"
                    label="Industry/Category"
                    placeholder="Select Industry/Category"
                    options={industryOptions}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <InputField
                    name="email"
                    label="Email"
                    placeholder="Enter Business Email"
                  />
                  <PhoneField
                    name="phone"
                    label="Phone"
                    placeholder="Enter Business Phone"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <Controller
                    name="website"
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <InputField
                        {...field}
                        label="Website"
                        placeholder="https://example.com"
                        onChange={(e) => {
                          // Optional: Add 'https://' if user doesn't type a protocol
                          let value = e.target.value
                          if (
                            value &&
                            !value.match(/^https?:\/\//) &&
                            value !== ''
                          ) {
                            value = `https://${value}`
                          }
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                  <div className="flex flex-col gap-2 ">
                    <label
                      className={cn('text-sm font-medium text-[#111827]')}
                      htmlFor="serviceType"
                    >
                      Business Type
                    </label>
                    <Controller
                      name="businessType"
                      control={form.control}
                      rules={{ required: 'Please select a service type' }}
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-6"
                        >
                          {serviceOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option.value}
                                id={`service-type-${option.value}`}
                              />
                              <label
                                htmlFor={`service-type-${option.value}`}
                                className="text-sm font-medium text-gray-700"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
            <div className="flex gap-2.5">
              <Image
                src="/assets/famicons_business.svg"
                alt="Business Icon"
                width={20}
                height={20}
              />
              <div className="font-semibold text-lg text-[#111827]">
                {' '}
                Business Address
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <InputField
                    name="street"
                    label="Street"
                    placeholder="Enter Street"
                  />
                  <InputField
                    name="city"
                    label="City"
                    placeholder="Enter City"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <InputField
                    name="state"
                    label="State"
                    placeholder="Enter State"
                  />
                  <Controller
                    name="zipCode"
                    control={form.control}
                    render={({ field, fieldState: { error } }) => (
                      <InputField
                        {...field}
                        label="ZIP/Postal Code"
                        placeholder="Enter ZIP/Postal code"
                        type="tel" // Shows numeric keypad on mobile
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                        maxLength={10} // Optional: Set max length if needed
                      />
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                  <InputField
                    name="country"
                    label="Country"
                    placeholder="Enter Country"
                  />
                  <InputField
                    name="googleMap"
                    label="Google Map"
                    placeholder="Enter Google Map Link"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-between gap-4 lg:gap-10 xl:gap-14">
            <div className="flex w-full p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
              <div className="flex gap-2.5">
                <Image
                  src="/assets/iconoir_eye-solid.svg"
                  alt="Business Icon"
                  width={20}
                  height={20}
                />
                <div className="font-semibold text-lg text-[#111827]">
                  {' '}
                  Logo
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <NewImageUpload name="logo" maxSizeMB={5} />

                  {/* <SelectField
                    name="visibility"
                    label="Visibility"
                    placeholder="Select Visibility"
                    options={visibilityOptions}
                  /> */}
                </div>
              </div>
            </div>
            <div className="flex w-full  p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px] h-fit">
              <div className="flex gap-2.5">
                <Image
                  src="/assets/grommet-icons_compliance.svg"
                  alt="Business Icon"
                  width={20}
                  height={20}
                />
                <div className="font-semibold text-lg text-[#111827]">
                  {' '}
                  Legal and Compliance
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-3">
                  <Controller
                    name="registrationNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <InputField
                        {...field}
                        label="Registration ID"
                        placeholder="Enter registration number"
                        type="tel" // Shows numeric keypad on mobile
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                      />
                    )}
                  />
                  <InputField
                    name="taxId"
                    label="Tax ID/ EIN / PAN"
                    placeholder="Enter your Tax ID / EIN / PAN"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-[#BBBBBB]    ">
          <button
            className="flex gap-1 items-center cursor-pointer"
            disabled
            // onClick={() => setTab('business-details')}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />

            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={() => setTab('business-availability')}
            >
              <div className="text-[##6AA9FF] text-sm font-normal">Skip</div>
              <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
            <Button type="submit" className="cursor-pointer">
              Save and Continue
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default BusinessDetail
