import InputField from '@/components/custom-form-fields/input-field'
import PhoneField from '@/components/custom-form-fields/phone-field'
import SelectField from '@/components/custom-form-fields/select-field'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'

const selectOptions = [
  { label: 'Same as Business Hours', value: 'SAME_AS_BUSINESS_HOURS' },
  { label: 'Set Your Support Hour', value: 'SET_YOUR_SUPPORT_HOUR' },
]

const CustomerInformation = () => {
  const form = useForm()
  const onSubmit = (data: any) => {
    console.log(data, 'data in customer information')
  }

  return (
    <>
      <div className="flex flex-col w-fit">
        <div className="text-lg md:text-xl font-semibold text-[#111827]">
          Contact Information
        </div>
        <div className="text-[#6B7280] text-xs md:text-base font-normal">
          Provide business support details so customers can reach out easily
        </div>
      </div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
            <InputField
              name="supportTeamName"
              label="Support Team Name"
              placeholder="Enter Support Team Name"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px]"
            />
            <InputField
              name="supportEmail"
              label="Support Email"
              placeholder="Enter Support Email"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] "
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
            <PhoneField
              name="supportNumber"
              label="Support Number"
              placeholder="Enter Support Number"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] "
            />
            <SelectField
              name="supportHour"
              label="Support Hour"
              placeholder="Enter Support Hour"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] leading-[20px]"
              options={selectOptions}
            />
          </div>{' '}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 xl:gap-16">
            <InputField
              name="physicalAddress"
              label="Physical Address"
              placeholder="Enter Physical Address"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] "
            />
            <InputField
              name="googleMap"
              label="Google Map Link"
              placeholder="Enter Google Map Link"
              className="!h-9 sm:!h-10 border border-blue-200 rounded-[4px] "
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="w-[150px] py-2.5 px-3 text-sm font-semibold text-center bg-[#2563EB] text-white rounded-[8px]"
            >
              Submit
            </button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default CustomerInformation
