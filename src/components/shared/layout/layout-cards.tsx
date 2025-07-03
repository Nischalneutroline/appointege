// import { Card } from '@/components/ui/card'
// import React from 'react'

// interface LayoutCardsProps {
//   option: {
//     value: string
//     label: string
//     textColor: string
//     count: number
//     icon: React.ReactNode
//     background: string
//     border: string
//   }
// }
// const LayoutCards = ({ option }: LayoutCardsProps) => {
//   return (
//     <Card
//       key={option.value}
//       className={`flex-1 gap-1 p-3 rounded-[12px] hover:scale-105 transition duration-400 cursor-pointer shadow-base z-10  overflow-visible`}
//       style={{
//         backgroundColor: option.background,
//         border: `1px solid ${option.border}`,
//       }}
//     >
//       <div
//         className={`font-normal text-sm  text-primary leading-[150%] `}
//         style={{ color: option.textColor }}
//       >
//         {option.label}
//       </div>
//       <div className="flex justify-between items-end">
//         <div
//           className="font-medium text-lg text-black h-full flex items-center"
//           style={{ color: option.textColor }}
//         >
//           {option.count}
//         </div>
//         <div className="flex items-center justify-center w-[35px] h-[35px] bg-white rounded-[8px]">
//           {option.icon}
//         </div>
//       </div>
//     </Card>
//   )
// }

// export default LayoutCards

import { Card } from '@/components/ui/card'
import React from 'react'
import { cn } from '@/lib/utils'

interface LayoutCardsProps<T> {
  option: {
    value: string
    label: string
    textColor?: string // Optional to match data.ts
    count: number
    icon: React.ReactNode
    background: string
    border?: string // Optional to match data.ts
  }
}

const LayoutCards = <T,>({ option }: LayoutCardsProps<T>) => {
  return (
    <Card
      className={cn(
        'flex-1 p-3 rounded-[12px] hover:scale-105 transition duration-400 cursor-pointer shadow-base z-10 overflow-visible',
      )}
      style={{
        backgroundColor: option.background,
        border: option.border
          ? `1px solid ${option.border}`
          : '1px solid #E5E7EB', // Fallback
      }}
    >
      <div
        className="font-normal text-sm leading-[150%]"
        style={{ color: option.textColor || '#000000' }} // Fallback
      >
        {option.label}
      </div>
      <div className="flex justify-between items-end">
        <div
          className="font-medium text-lg h-full flex items-center"
          style={{ color: option.textColor || '#000000' }} // Fallback
        >
          {option.count}
        </div>
        <div className="flex items-center justify-center w-[35px] h-[35px] bg-white rounded-[8px]">
          {/* {React.cloneElement(option.icon as React.ReactElement, {
            size: 24, // Customize icon size here
            className: cn(
              'text-gray-600',
              option.textColor && `text-[${option.textColor}]`,
            ), // Use textColor if provided
          })} */}
          <span className="">{option.icon}</span>
        </div>
      </div>
    </Card>
  )
}

export default LayoutCards
