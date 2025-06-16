import React from 'react'
import { CircleAlert } from 'lucide-react'

interface FormHeaderProps {
  title: string
  description: string
}

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold text-blue-500">{title}</h2>
      <div className="flex gap-1 items-center">
        <span>
          <CircleAlert className="size-4 opacity-50 text-white fill-blue-500" />
        </span>
        <p className="text-xs md:text-sm">{description}</p>
      </div>
    </div>
  )
}

export default FormHeader
