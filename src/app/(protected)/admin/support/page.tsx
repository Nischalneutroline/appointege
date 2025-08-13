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
import TicketFormModal from './_components/forms/customer-ticket-from'
import {
  closeFaqForm,
  closeTicketForm,
  setNestedTab,
} from '@/store/slices/supportSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import FaqFormModal from './_components/forms/faqmodal-form'

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

  const dispatch = useDispatch<AppDispatch>()

  return (
    <button
      onClick={() => {
        setSelectedTab(name)
        dispatch(setNestedTab(name as 'faq' | 'ticket'))
      }}
      className={cn(
        'flex justify-start items-center px-2 md:px-4 py-2 md:py-2.5 gap-3 rounded-[8px] border-[1px] w-full md:w-[260px] transition-colors duration-200',
        isSelected
          ? 'bg-[#2563EB] border-[#2563EB]'
          : 'bg-white border-[#E5E7EB]',
      )}
    >
      <div
        className={cn(
          ' flex h-5 w-5 md:h-9 md:w-9 p-1 md:p-2.5 justify-center items-center rounded-[4px]',
          isSelected ? 'bg-white' : 'bg-[#E6F0FF]',
        )}
      >
        {icon}
      </div>
      <div
        className={cn(
          'flex items-center font-medium text-sm md:text-lg md:w-[170px]',
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
  const dispatch = useDispatch<AppDispatch>()
  const handleCloseTicketForm = () => {
    dispatch(closeTicketForm())
  }
  const handleCloseFaqForm = () => {
    dispatch(closeFaqForm())
  }
  const { isTicketFormOpen } = useSelector(
    (state: RootState) => state.support.ticket,
  )
  const { isFaqFormOpen } = useSelector((state: RootState) => state.support.faq)
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-2 w-full">
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
      {/* Control using store state */}
      <div className={cn('')}>
        <div className="flex flex-col gap-8  w-full ">
          {selectedTab === 'contact-info' && <CustomerInformation />}
          {selectedTab === 'faqs' && <FaqSection />}
          {selectedTab === 'customer-support' && <CustomerTicket />}
          {selectedTab === 'admin-support' && <AdminTicket />}
        </div>
      </div>
      <TicketFormModal
        open={isTicketFormOpen}
        onChange={handleCloseTicketForm}
        ticketType={selectedTab === 'customer-support' ? 'Customer' : 'Admin'}
      />
      <FaqFormModal open={isFaqFormOpen} onChange={handleCloseFaqForm} />
    </div>
  )
}

export default Page
