import React from 'react'

const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="py-4 flex justify-between">
      <span className="w-1/2 text-xl font-medium">{label}</span>
      <span className="w-1/2 text-xl text-muted-foreground ">{value}</span>
    </div>
  )
}

export default InfoItem
