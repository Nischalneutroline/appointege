'use client'

import { cn } from '@/lib/utils'
import {
  ContactRound,
  Headphones,
  Headset,
  List,
  ShieldUser,
} from 'lucide-react'
import React, { useState } from 'react'

import CustomerInformation from './_components/pages/customer-info'
import FaqSection from './_components/pages/faqs'

import CustomerTicket from './_components/pages/customer-ticket'
import AdminTicket from './_components/pages/admin-ticket'

const TabInfo = [
  {
    name: 'contact-info',
    label: 'Contact Info',
    icon: (
      <ContactRound
        className="text-[#1C55B2]"
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    ),
    // component:<ContactInfo
  },
  {
    name: 'faqs',
    label: 'FAQs',
    icon: (
      <List
        className="text-[#1C55B2]"
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    ),
    // component:<ContactInfo
  },
  {
    name: 'customer-support',
    label: 'Customer Support',
    icon: (
      <List
        className="text-[#1C55B2]"
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    ),
    // component:<ContactInfo
  },
  {
    name: 'admin-support',
    label: 'Admin Support',
    icon: (
      <ShieldUser
        className="text-[#1C55B2]"
        style={{
          height: '24px',
          width: '24px',
        }}
      />
    ),
    // component:<ContactInfo
  },
]

const TabButton = ({
  name,
  label,
  icon,
  selectedTab,
  setSelectedTab,
}: {
  name: string
  label: string
  icon: React.ReactNode
  selectedTab: string
  setSelectedTab: (tab: string) => void
}) => {
  const isSelected = selectedTab === name

  return (
    <button
      onClick={() => setSelectedTab(name)}
      className={cn(
        'flex justify-start items-center px-4 py-2.5 gap-3 rounded-[8px] border-[1px] w-full transition-colors duration-200',
        isSelected
          ? 'bg-[#2563EB] border-[#2563EB]'
          : 'bg-white border-[#E5E7EB]',
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 justify-center items-center rounded-[4px]',
          isSelected ? 'bg-white' : 'bg-[#E6F0FF]',
        )}
      >
        {icon}
      </div>
      <div
        className={cn(
          'flex items-center font-medium text-lg w-[170px]',
          isSelected ? 'text-white' : 'text-black',
        )}
      >
        {label}
      </div>
    </button>
  )
}

const Page = () => {
  const [selectedTab, setSelectedTab] = useState('contact-info')
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex  gap-12 w-full">
        {TabInfo.map((tab) => (
          <TabButton
            key={tab.name}
            name={tab.name}
            label={tab.label}
            icon={tab.icon}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </div>

      {/* Debug Output */}
      <div className={cn()}>
        <div className="flex flex-col gap-8  w-full">
          {selectedTab === 'contact-info' && <CustomerInformation />}
          {selectedTab === 'faqs' && <FaqSection />}
          {selectedTab === 'customer-support' && <CustomerTicket />}
          {selectedTab === 'admin-support' && <AdminTicket />}
        </div>
      </div>
    </div>
  )
}

export default Page
