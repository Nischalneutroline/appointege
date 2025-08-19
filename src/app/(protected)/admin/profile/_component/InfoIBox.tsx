import { ChevronRight, LucideIcon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons/lib'
import InfoItem from './InfoItem'
import { FcRight } from 'react-icons/fc'

const InfoBox = ({
  header,
  icon: Icon,
  children,
}: {
  header: string
  icon: LucideIcon | IconType
  children: React.ReactNode
}) => {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-[#2672EF]">{<Icon />}</span>
        <h2 className="flex-1 text-[#2672EF] text-2xl font-semibold">
          {header}
        </h2>
        <span className="cursor-pointer text-muted-foreground">
          {<ChevronRight />}
        </span>
      </div>
      <div className="bg-white shadow rounded-md">
        <div className="px-6 divide-y divide-[#E5E7EB]">{children}</div>
      </div>
    </div>
  )
}

export default InfoBox
