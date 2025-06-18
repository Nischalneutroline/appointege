'use client'

import React, { useEffect, useState } from 'react'
import { filterOptions } from './_data/data'
import SearchBar from '@/components/shared/layout/search-bar'
import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
import DataTable from '@/components/table/data-table'
import { columns } from './_data/column'
import { Appointment } from '@/data/appointment'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import { useViewMode } from '@/hooks/useViewMode'
import AppointmentCard from './_component/appointment-card'
import Image from 'next/image'
import EcommerSvg from '../../../../public/ecommerce.svg'
import AppointmentGrid from './_component/appointment-grid'

const Page = () => {
  const { viewMode, setViewMode } = useViewMode()
  const [seletedData, setSelectedData] = useState<Appointment[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('Today')
  useEffect(() => {
    setSelectedData(seletedData)
  }, [seletedData])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2">
        <div className="w-fit flex items-center gap-2 overflow-auto py-1 px-0.5 bg-white h-11 rounded-[10px] border-[1px] border-[#E5E7EB]">
          {filterOptions.map((option, index) => {
            return (
              <FilterTabs
                key={index}
                option={option}
                activeFilter={activeFilter}
                setSelectedData={setSelectedData}
                setActiveFilter={setActiveFilter}
              />
            )
          })}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 xl:gap-3 justify-between  max-h-10">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search appointment"
            width="w-[370px]"
            onSearch={(value) => console.log(value)}
          />

          <div className="flex  gap-3 justify-end">
            <div className="flex text-[#6B7280] items-center gap-1 justify-center border-[1px] bg-[#FFFFFF] border-[#E5E7EB] rounded-[8px] w-24.5 cursor-pointer hover:scale-110 transition duration-400">
              <Funnel strokeWidth={2.5} size={14} className="text-[#4F7CFF]" />
              <div className=" text-sm font-normal">Filter</div>
              <ChevronDown strokeWidth={2.5} size={14} />
            </div>
            <div className="flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-400 hover:scale-110 ">
              <RefreshCcw strokeWidth={2.5} size={18} />
            </div>
          </div>
        </div>
      </div>
      {/* <DataTable columns={columns} data={seletedData} rowKey="id" /> */}

      {/* Main Data Section */}
      <div className="overflow-y-auto">
        {seletedData.length > 0 ? (
          <>
            {viewMode === 'list' ? (
              <div className="max-w-full">
                <DataTable columns={columns} data={seletedData} rowKey="id" />
              </div>
            ) : viewMode === 'card' ? (
              <div className="flex flex-col gap-2 h-[calc(100vh-350px)] overflow-y-auto ">
                {seletedData.map((item) => (
                  <AppointmentCard item={item} key={item.id} />
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 h-[calc(100vh-350px)] overflow-y-auto ">
                {seletedData.map((item) => (
                  <AppointmentGrid item={item} key={item.id} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="py-18 h-full flex items-center justify-center text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <Image
                src={EcommerSvg}
                alt="ecommerce"
                width={140}
                height={140}
              />
              <div className="text-2xl text-[#4F7CFF] font-semibold">
                No Appointments Found
              </div>
              <div className="text-[#9F9C9C] text-sm font-medium">
                Create a new appointment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
