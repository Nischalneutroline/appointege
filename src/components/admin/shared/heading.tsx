import { LucideIcon } from 'lucide-react'
import React from 'react'

interface HeadingProps {
  title: string
  description: string
  icon?: LucideIcon
}

const Heading = ({ title, description, icon: Icon }: HeadingProps) => {
  return (
    <div className=" text-[#2563EB]  ">
      <div className="flex items-center gap-2 ">
        <span className=" flex gap-2 items-center text-2xl lg:text-3xl text-start font-semibold ">
          {Icon && <Icon className="size-6 text-[#6AA9FF]" />}
          {title}
        </span>
      </div>
      <p className=" text-sm lg:text-base  font-normal text-start text-[#5C6B84]">
        {description}
      </p>
    </div>
  )
}

export default Heading
