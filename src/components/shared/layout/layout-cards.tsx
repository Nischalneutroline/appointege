'use client'

import { Card } from '@/components/ui/card'
import React from 'react'

interface LayoutCardsProps {
  option: {
    value: string
    label: string
    textColor: string
    count: number
    icon: React.ReactNode // Changed to React.ReactNode to match enrichedFilterOptions
    background: string
    border: string
  }
}

const LayoutCards = ({ option }: LayoutCardsProps) => {
  return (
    <Card
      key={option.value}
      className={`flex-1 !h-[88px] gap-1 p-3 rounded-[12px] hover:scale-105 transition duration-400 cursor-pointer shadow-base z-10 overflow-visible`}
      style={{
        backgroundColor: option.background,
        border: `1px solid ${option.border}`,
      }}
    >
      <div
        className={`font-normal text-sm text-primary leading-[150%]`}
        style={{ color: option.textColor }}
      >
        {option.label}
      </div>
      <div className="flex justify-between items-end">
        <div
          className="font-medium text-lg text-black h-full flex items-center"
          style={{ color: option.textColor }}
        >
          {option.count}
        </div>
        <div className="flex items-center justify-center w-[35px] h-[35px] bg-white rounded-[8px]">
          {option.icon}
        </div>
      </div>
    </Card>
  )
}

export default LayoutCards
