import React from 'react'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

interface FormErrorProps {
  message?: string
}
export function FormError({ message }: FormErrorProps) {
  if (!message) return null

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive justify-center">
      <HiOutlineExclamationTriangle className="h-5 w-5" />
      <p>{message}</p>
    </div>
  )
}
