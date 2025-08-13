import Heading from '@/components/admin/shared/heading'
import ViewTabs from '@/components/shared/layout/view-tabs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex flex-col justify-between gap-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Support"
            description="Manage your support and customer service."
          />
        </div>
      </div>

      <div className="flex-1  ">{children}</div>
    </main>
  )
}

export default layout
