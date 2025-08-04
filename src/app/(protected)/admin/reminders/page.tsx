'use client'
import React from 'react'

import Heading from '@/components/admin/shared/heading'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ReminderTab } from '@/store/slices/reminderSlice'
import { Bell, BellRing } from 'lucide-react'
import ReminderForm from '@/components/custom-form-fields/reminder/reminder-form'

const ReminderPage = ({ children }: { children: React.ReactNode }) => {
  const { activeTab } = useSelector((state: RootState) => state.reminder)
  return (
    <main className="flex flex-col gap-4 h-full flex-1 overflow-y-auto">
      {/* Use overflow-y-auto for scrolling */}
      <div className="p-6 flex gap-4 flex-col">
        <Heading
          title={`${activeTab === ReminderTab.REMINDER ? 'Reminder' : 'Announcement'}`}
          description="Manage your support and customer service."
          icon={BellRing}
        />
        <div className="flex-1 overflow-y-auto">
          {/* Ensure inner div can scroll */}
          {activeTab === ReminderTab.REMINDER ? (
            <ReminderForm />
          ) : (
            'Announcement'
          )}
        </div>
      </div>
    </main>
  )
}

export default ReminderPage
