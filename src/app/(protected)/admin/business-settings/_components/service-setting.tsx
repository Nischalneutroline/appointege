'use client'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import BusinessAvailability from './business-availability'
import BusinessDetail from './business-details'
import Image from 'next/image'
import ServiceDetails from './service-tab'
const STORAGE_KEY1 = 'business-detail-form'
const STORAGE_KEY2 = 'business-availability-form'

const ServiceSetting = () => {
  //   const [data1, setData1] = useState<string | null>(null)
  //   const [data2, setData2] = useState<string | null>(null)
  //   const [currentMode, setCurrentMode] = useState('business-details')
  //   useEffect(() => {
  //     if (typeof window !== 'undefined') {
  //       const stored1 = localStorage.getItem(STORAGE_KEY1)
  //       const stored2 = localStorage.getItem(STORAGE_KEY2)
  //       setData1(stored1)
  //       setData2(stored2)
  //     }
  //   }, [])

  return (
    <div className="flex flex-col gap-4 w-full h-[100vh]">
      <div className="flex flex-col gap-1">
        <div className="flex gap-2.5 items-center">
          <Image
            src="/assets/building-2.svg"
            alt="Business Icon"
            width={24}
            height={24}
          />
          <div className="text-[#111827] font-semibold text-lg">
            Service Settings
          </div>
        </div>
        <div className="font-normal text-sm text-[#111827]">
          Setup your service details and services availability
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full h-full">
        <div className="flex flex-col gap-4 h-full">
          <ServiceDetails />
        </div>
      </div>
    </div>
  )
}
export default ServiceSetting
