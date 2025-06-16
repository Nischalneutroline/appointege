'use client'

import React, { useEffect, useState } from 'react'
import { filterOptions } from './_data/data'
import SearchBar from '@/components/shared/layout/search-bar'
import { ChevronDown, Funnel, RefreshCcw } from 'lucide-react'
import DataTable from '@/components/table/data-table'
import { columns } from './_data/column'
import { Appointment } from '@/data/appointment'
import { cn } from '@/lib/utils'
import FilterTabs from '@/components/shared/layout/filter-tabs'
const Page = () => {
  const [seletedData, setSelectedData] = useState<Appointment[]>([])
  const [activeFilter, setActiveFilter] = useState<string>('Today')
  useEffect(() => {
    setSelectedData(seletedData)
  }, [seletedData])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 py-1 px-0.5 bg-white h-11 rounded-[10px] border-[1px] border-[#E5E7EB]">
          {filterOptions.map((option) => {
            return (
              <FilterTabs
                key={option.value}
                option={option}
                activeFilter={activeFilter}
                setSelectedData={setSelectedData}
                setActiveFilter={setActiveFilter}
              />
            )
          })}
        </div>
        <div className="flex gap-3 max-h-10">
          <SearchBar
            className="bg-white rounded-[8px]"
            placeholder="Search appointment"
            width="w-[370px]"
            onSearch={(value) => console.log(value)}
          />

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
      {/* <DataTable columns={columns} data={seletedData} rowKey="id" /> */}

      <div className=" border-[1px] border-[#DCE9F9] rounded-[8px] ">
        {seletedData.length > 0 ? (
          <DataTable columns={columns} data={seletedData} rowKey="id" />
        ) : (
          <div className="p-4 text-center text-gray-500">
            No appointments found. Try selecting a different filter.
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
