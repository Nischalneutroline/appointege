import { getInitials } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import React from 'react'

interface CustomerProfileProps {
  name: string

  setCollapsed: () => void
}

const CompanyProfile = (props: CustomerProfileProps) => {
  const { name, setCollapsed } = props
  const logo = getInitials(name)

  console.log(logo, 'logo')

  return (
    <div className="flex items-center justify-between py-4 pt-6 px-6">
      <div className="flex items-center  w-full text-black gap-2">
        <div className="h-8 w-8 rounded-[10px] bg-gradient-to-r from-[#00A6F4] to-[#155DFC] text-white flex items-center justify-center font-medium text-sm">
          {logo}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold leading-[150%] text-[#2563EB] w-full">
            {name}
          </div>
        </div>
      </div>
      <div className="flex w-8 h-7 rounded-[4px]items-center justify-center text-xs text-muted-foreground">
        <ChevronLeft
          className="w-6 h-6 text-[#6B7280] cursor-pointer hover:text-blue-700"
          onClick={setCollapsed}
        />
      </div>
    </div>
  )
}

export default CompanyProfile
