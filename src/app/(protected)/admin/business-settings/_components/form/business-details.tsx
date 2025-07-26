import InputField from '@/components/custom-form-fields/input-field'
import { NewImageUpload } from '@/components/custom-form-fields/new-image-upload'

import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  BusinessDetailFormValues,
  BusinessStatus,
  updateBusinessDetailForm,
} from '@/store/slices/businessSlice'
import { AppDispatch, RootState } from '@/store/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { ArrowBigLeft, ArrowLeft, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { z } from 'zod'
import { businessDetailFormSchema, industryOptions } from '../../_schema/schema'
import { useSelector } from 'react-redux'
const serviceOptions = [
  { label: 'Physical', value: 'PHYSICAL' },
  { label: 'Virtual', value: 'VIRTUAL' },
  { label: 'All', value: 'ALL' },
]
type BusinessDetailFrontFormValues = z.infer<typeof businessDetailFormSchema>
// const transformApiData = (apiData: any) => {
//   if (!apiData) return null

//   const address = Array.isArray(apiData.address)
//     ? apiData.address[0]
//     : apiData.address || {}

//   return {
//     businessName: apiData.name || '',
//     industry: apiData.industry || '',
//     email: apiData.email || '',
//     phone: apiData.phone || '',
//     businessType: apiData.businessType || '',
//     website: apiData.website || '',
//     city: address.city || '',
//     street: address.street || '',
//     state: address.state || '',
//     zipCode: address.zipCode || '',
//     country: address.country || '',
//     googleMap: address.googleMap || '',
//     registrationNumber:
//       apiData.businessRegistrationNumber || apiData.registrationNumber || '',
//     taxId: apiData.taxId || '',
//     logo: apiData.logo || null,
//   }
// }

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
  const [isInitialized, setIsInitialized] = useState(false)
  const businessForm = useSelector(
    (state: RootState) => state.business.businessDetailForm,
  )
  const defaultValues = {
    businessName: data?.name || 'Appointege',
    industry: data?.industry || 'IT Services',
    email: data?.email || 'appointege@gmail.com',
    phone: data?.phone || '+1-9867373778',
    businessType: data?.businessType || 'PHYSICAL',
    website: data?.website || 'https://www.appointege.com',
    street: data?.address?.[0]?.street || '123 Main St',
    city: data?.address?.[0]?.city || 'New York',
    state: data?.address?.[0]?.state || 'NY',
    zipCode: data?.address?.[0]?.zipCode || '10001',
    country: data?.address?.[0]?.country || 'USA',
    googleMap: data?.address?.[0]?.googleMap || 'https://www.google.com/maps',
    registrationNumber:
      data?.businessRegistrationNumber ||
      data?.registrationNumber ||
      '1234567890',
    taxId: data?.taxId || 'TX-1234567890',
    logo: data?.logo || null,
  }
  // const [isInitialized, setIsInitialized] = useState(false)
  // const initialData =
  //   businessForm && Object.keys(businessForm).length > 0
  //     ? businessForm
  //     : transformApiData(data) || {}

  const form = useForm<BusinessDetailFrontFormValues>({
    resolver: zodResolver(businessDetailFormSchema),
    defaultValues: defaultValues,
  })
  // console.log(data?.name, 'data')
  // // Handle form reset when data changes
  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       businessName: data?.name,
  //       industry: data.industry || '',
  //       email: data.email || '',
  //       phone: data.phone || '',
  //       businessType: data.businessType || '',
  //       website: data.website || '',
  //       city: data.address?.city || '',
  //       street: data.address?.street || '',
  //       state: data.address?.state || '',
  //       zipCode: data.address?.zipCode || '',
  //       country: data.address?.country || '',
  //       googleMap: data.address?.googleMap || '',
  //       registrationNumber:
  //         data.businessRegistrationNumber || data.registrationNumber || '',
  //       taxId: data.taxId || '',
  //       logo: data.logo || null,
  //     })
  //   }
  // }, [data, form])

  // useEffect(() => {
  //   if (!isInitialized) {
  //     if (businessForm && Object.keys(businessForm).length > 0) {
  //       // Hydrate from Redux first if available
  //       const transformedData: BusinessDetailFormValues = {
  //         name: businessForm.name,
  //         industry: businessForm.industry,
  //         email: businessForm.email,
  //         phone: businessForm.phone,
  //         website: businessForm.website,
  //         status: businessForm.status,
  //         businessRegistrationNumber: businessForm.businessRegistrationNumber,
  //         taxId: businessForm.taxId,
  //         logo: businessForm.logo,
  //         address: [
  //           {
  //             street: businessForm?.address?.[0]?.street || '',
  //             city: businessForm?.address?.[0]?.city || '',
  //             state: businessForm?.address?.[0]?.state || '',
  //             zipCode: businessForm?.address?.[0]?.zipCode || '',
  //             country: businessForm?.address?.[0]?.country || '',
  //             googleMap: businessForm?.address?.[0]?.googleMap || '',
  //           },
  //         ],
  //       }

  //       form.reset(transformedData)
  //       setIsInitialized(true)
  //     } else if (data) {
  //       const apiFormData = transformApiData(data)
  //       if (apiFormData) {
  //         form.reset(apiFormData)
  //         setIsInitialized(true)
  //       }
  //     }
  //   }
  // }, [data, businessForm, isInitialized, form])

  // Use useWatch to get live updates of the form values
  // const watchedFormData = useWatch({ control: form.control })

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     dispatch(updateBusinessDetailForm(watchedFormData))
  //   }, 300) // debounce 300ms

  //   return () => clearTimeout(timeout)
  // }, [watchedFormData])

  // Now liveFormData always holds the latest form values
  // You can use liveFormData anywhere inside your component!
  // useEffect(() => {
  //   if (
  //     businessForm &&
  //     Object.keys(businessForm).length > 0 &&
  //     !isInitialized // ✅ prevents re-resetting
  //   ) {
  //     const transformedData: BusinessDetailFormValues = {
  //       name: businessForm.name,
  //       industry: businessForm.industry,
  //       email: businessForm.email,
  //       phone: businessForm.phone,
  //       website: businessForm.website,
  //       status: businessForm.status,
  //       businessRegistrationNumber: businessForm.businessRegistrationNumber,
  //       taxId: businessForm.taxId,
  //       logo: businessForm.logo,
  //       address: [
  //         {
  //           street: businessForm?.address?.[0]?.street || '',
  //           city: businessForm?.address?.[0]?.city || '',
  //           state: businessForm?.address?.[0]?.state || '',
  //           zipCode: businessForm?.address?.[0]?.zipCode || '',
  //           country: businessForm?.address?.[0]?.country || '',
  //           googleMap: businessForm?.address?.[0]?.googleMap || '',
  //         },
  //       ],
  //     }

  //     form.reset(transformedData)
  //     setIsInitialized(true) // ✅ set only once
  //   }
  // }, [businessForm, isInitialized, form])

  // Submit Handler
  const onSubmit = (formData: BusinessDetailFrontFormValues) => {
    // Save form data to localStorage

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
