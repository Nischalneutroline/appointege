import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const ViewAll = ({ text, route }: { text: string; route: string }) => {
  return (
    <Link
      href={route}
      className="cusor-pointer flex gap-1 cursor-pointer text-sm font-medium items-center text-[#2563EB]"
    >
      <span className="text-sm font-semibold">{text}</span>
      <span>
        <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}

export default ViewAll
