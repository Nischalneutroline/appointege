// app/(protected)/admin/(dashboard)/_components/NavigateTo.tsx
'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { GoQuestion } from 'react-icons/go'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function NavigateTo({
  link,
  text,
  icon: Icon,
  type,
}: {
  link: string
  text: string
  icon: LucideIcon | typeof GoQuestion
  type?: string
}) {
  return (
    <Link
      href={link}
      className={cn(
        'flex items-center gap-x-2 cursor-pointer  w-full text-left text-sm text-muted-foreground',
        type === 'profile' && 'text-blue-500',
      )}
      onClick={() => console.log(`Navigating to ${link}`)}
    >
      <Icon
        className={cn(
          'w-4 h-4 text-muted-foreground',
          type === 'profile' && 'text-blue-500 ',
        )}
      />
      {text}
    </Link>
  )
}
