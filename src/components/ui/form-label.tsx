import React from 'react'

const FormLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <label
      htmlFor="email"
      className="text-slate-700 font-semibold text-xs sm:text-sm"
    >
      {children}
    </label>
  )
}

export default FormLabel
