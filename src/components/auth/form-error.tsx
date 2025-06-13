import React from 'react'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

interface FormErrorProps {
  message?: string
}
export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="bg-destructive/15 px-3 3xl:px-4 4xl:px-5 5xl:px-6 py-2 3xl:py-3 5xl:py-4 rounded-md flex items-center gap-x-2 text-sm  4xl:text-base 5xl:text-lg text-destructive justify-center">
      <HiOutlineExclamationTriangle className="h-5 w-5 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 5xl:h-8 5xl:w-8" />
      <p className="text-xs 3xl:text-sm 4xl:text-base 5xl:text-lg">{message}</p>
    </div>
  )
}
