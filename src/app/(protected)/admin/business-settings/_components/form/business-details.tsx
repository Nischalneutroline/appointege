'use client'

import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import InputField from '@/components/custom-form-fields/input-field'
import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'
import { NewImageUpload } from '@/components/custom-form-fields/new-image-upload'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { z } from 'zod'
import {
  BusinessTab,
  setActiveTab,
  setBusinessDetail,
} from '@/store/slices/businessSlice'

export const industryOptions = [
  { label: 'IT Services', value: 'IT Services' },
  { label: 'Healthcare', value: 'Healthcare' },
  { label: 'Retail', value: 'Retail' },
  { label: 'Education', value: 'Education' },
]

export const businessDetailFormSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .optional(),
  industry: z.string().min(1, 'Industry is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .optional(),
  businessType: z.enum(['PHYSICAL', 'VIRTUAL', 'ALL']).optional(),
  website: z.string().url('Invalid URL').optional(),
  street: z.string().min(1, 'Street is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().optional(),
  zipCode: z.string().min(1, 'ZIP code is required').optional(),
  country: z.string().min(1, 'Country is required').optional(),
  googleMap: z.string().url('Invalid Google Map URL').optional().nullable(),
  registrationNumber: z
    .string()
    .min(1, 'Registration number is required')
    .optional(),
  taxId: z.string().optional(),
  logo: z.any().optional().nullable(),
})

export type BusinessDetailFrontFormValues = z.infer<
  typeof businessDetailFormSchema
>

export const transformApiData = (
  apiData: any,
): BusinessDetailFrontFormValues => {
  if (!apiData) {
    return {
      businessName: '',
      industry: '',
      email: '',
      phone: '',
      businessType: 'PHYSICAL',
      website: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      googleMap: null,
      registrationNumber: '',
      taxId: '',
      logo: null,
    }
  }

  const address = Array.isArray(apiData.address)
    ? apiData.address[0] || {}
    : apiData.address || {}

  return {
    businessName: apiData.name || '',
    industry: apiData.industry || '',
    email: apiData.email || '',
    phone: apiData.phone || '',
    businessType: apiData.businessType || 'PHYSICAL',
    website: apiData.website || null,
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
    country: address.country || '',
    googleMap: address.googleMap || null,
    registrationNumber: apiData.businessRegistrationNumber || '',
    taxId: apiData.taxId || '',
    logo: apiData.logo || null,
  }
}

const serviceOptions = [
  { label: 'Physical', value: 'PHYSICAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
  { label: 'All', value: 'ALL' },
]

const BusinessDetail = ({ data }: { data?: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedBusiness } = useSelector((state: RootState) => state.business)
  const [isInitialized, setIsInitialized] = useState(false)

  const form = useForm<BusinessDetailFrontFormValues>({
    resolver: zodResolver(businessDetailFormSchema),
    defaultValues: selectedBusiness
      ? transformApiData({
          ...selectedBusiness,
          address: selectedBusiness.address?.length
            ? selectedBusiness.address
            : [{}],
        })
      : transformApiData(data),
  })

  useEffect(() => {
    if (!isInitialized && (selectedBusiness || data)) {
      const initialData = selectedBusiness
        ? transformApiData({
            ...selectedBusiness,
            address: selectedBusiness.address?.length
              ? selectedBusiness.address
              : [{}],
          })
        : transformApiData(data)
      form.reset(initialData)
      setIsInitialized(true)
    }
  }, [data, selectedBusiness, form, isInitialized])

  const onSubmit = async (formData: BusinessDetailFrontFormValues) => {
    const updatedData = {
      name: formData.businessName || '',
      industry: formData.industry || '',
      email: formData.email || '',
      phone: formData.phone || '',
      website: formData.website || '',
      businessRegistrationNumber: formData.registrationNumber || '',
      address: formData.street
        ? [
            {
              street: formData.street,
              city: formData.city || '',
              country: formData.country || '',
              zipCode: formData.zipCode || '',
              googleMap: formData.googleMap || '',
              state: formData.state || '',
              id: selectedBusiness?.address?.[0]?.id || '',
              businessId: selectedBusiness?.id || '',
              supportId: null,
            },
          ]
        : [],
      timeZone: selectedBusiness?.timeZone || 'UTC',
      businessAvailability: selectedBusiness?.businessAvailability || [],
      // holidays: selectedBusiness?.holidays || [],
      serviceAvailability: selectedBusiness?.serviceAvailability || [],
      status: selectedBusiness?.status || 'PENDING',
      businessOwner: selectedBusiness?.businessOwner || null,
      createdAt: selectedBusiness?.createdAt || new Date(),
      updatedAt: new Date(),
      id: selectedBusiness?.id || '',
    }

    dispatch(setBusinessDetail(updatedData))

    try {
      if (selectedBusiness?.id) {
        // await dispatch(
        //   updateBusiness({ id: selectedBusiness.id, data: updatedData }),
        // ).unwrap()
        toast.success('Business details updated successfully')
      } else {
        // const createdBusiness = await dispatch(
        //   createBusiness(updatedData),
        // ).unwrap()
        toast.success('Business details created successfully')
      }
      dispatch(setActiveTab(BusinessTab.BusinessAvailability))
    } catch (error) {
      toast.error('Failed to save business details')
    }
  }

  const handleSkip = () => {
    const formData = form.getValues()
    const updatedData = {
      name: formData.businessName || '',
      industry: formData.industry || '',
      email: formData.email || '',
      phone: formData.phone || '',
      website: formData.website || '',
      businessRegistrationNumber: formData.registrationNumber || '',
      address: formData.street
        ? [
            {
              street: formData.street,
              city: formData.city || '',
              country: formData.country || '',
              zipCode: formData.zipCode || '',
              googleMap: formData.googleMap || '',
              state: formData.state || '',
              id: selectedBusiness?.address?.[0]?.id || '',
              businessId: selectedBusiness?.id || '',
              supportId: null,
            },
          ]
        : [],
      timeZone: selectedBusiness?.timeZone || 'UTC',
      businessAvailability: selectedBusiness?.businessAvailability || [],
      // holidays: selectedBusiness?.holidays || [],
      serviceAvailability: selectedBusiness?.serviceAvailability || [],
      status: selectedBusiness?.status || 'PENDING',
      businessOwner: selectedBusiness?.businessOwner || null,
      createdAt: selectedBusiness?.createdAt || new Date(),
      updatedAt: new Date(),
      id: selectedBusiness?.id || '',
    }
    dispatch(setBusinessDetail(updatedData))
    dispatch(setActiveTab(BusinessTab.BusinessAvailability))
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-8">
          <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
            <div className="flex gap-2.5">
              <Image
                src="/assets/picon_business.svg"
                alt="Business Icon"
                width={20}
                height={15}
              />
              <div className="font-semibold text-lg text-[#111827]">
                Business Information
              </div>
            </div>
            <div className="flex flex-col gap-4">
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
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Website"
                      placeholder="https://example.com"
                      onChange={(e) => {
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
                <div className="flex flex-col gap-2">
                  <label
                    className={cn('text-sm font-medium text-[#111827]')}
                    htmlFor="businessType"
                  >
                    Business Type
                  </label>
                  <Controller
                    name="businessType"
                    control={form.control}
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
          <div className="flex p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
            <div className="flex gap-2.5">
              <Image
                src="/assets/famicons_business.svg"
                alt="Business Icon"
                width={20}
                height={20}
              />
              <div className="font-semibold text-lg text-[#111827]">
                Business Address
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
                <InputField
                  name="street"
                  label="Street"
                  placeholder="Enter Street"
                />
                <InputField name="city" label="City" placeholder="Enter City" />
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
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="ZIP/Postal Code"
                      placeholder="Enter ZIP/Postal code"
                      type="tel"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
                      maxLength={10}
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
          <div className="flex flex-col md:flex-row w-full justify-between gap-4 lg:gap-10 xl:gap-14">
            <div className="flex w-full p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px]">
              <div className="flex gap-2.5">
                <Image
                  src="/assets/iconoir_eye-solid.svg"
                  alt="Business Icon"
                  width={20}
                  height={20}
                />
                <div className="font-semibold text-lg text-[#111827]">Logo</div>
              </div>
              <div className="flex flex-col gap-8">
                <NewImageUpload name="logo" maxSizeMB={5} />
              </div>
            </div>
            <div className="flex w-full p-3 flex-col gap-4 border border-[#E9E9E9] rounded-[4px] h-fit">
              <div className="flex gap-2.5">
                <Image
                  src="/assets/grommet-icons_compliance.svg"
                  alt="Business Icon"
                  width={20}
                  height={20}
                />
                <div className="font-semibold text-lg text-[#111827]">
                  Legal and Compliance
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <Controller
                  name="registrationNumber"
                  control={form.control}
                  render={({ field }) => (
                    <InputField
                      {...field}
                      label="Registration ID"
                      placeholder="Enter registration number"
                      type="tel"
                      onChange={(e) =>
                        field.onChange(e.target.value.replace(/\D/g, ''))
                      }
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
        <div className="flex justify-between text-[#BBBBBB]">
          <button className="flex gap-1 items-center cursor-pointer" disabled>
            <ArrowLeft className="w-4 h-4" strokeWidth={3} />
            <div className="text-[#BBBBBB] text-sm font-normal">Back</div>
          </button>
          <div className="flex gap-4">
            <button
              className="flex gap-1 items-center cursor-pointer text-[#6AA9FF]"
              onClick={handleSkip}
            >
              <div className="text-[#6AA9FF] text-sm font-normal">Skip</div>
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
