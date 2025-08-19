// app/(protected)/admin/(dashboard)/_components/NavigateTo.tsx
'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { GoQuestion } from 'react-icons/go'
import Link from 'next/link'

export function NavigateTo({
  link,
  text,
  icon: Icon,
}: {
  link: string
  text: string
  icon: LucideIcon | typeof GoQuestion
}) {
  return (
    <Link
      href={link}
      className="flex items-center gap-x-2 cursor-pointer text-blue-500 w-full text-left"
      onClick={() => console.log(`Navigating to ${link}`)}
    >
      <Icon className="w-4 h-4 text-blue-500" />
      {text}
    </Link>
  )
}
