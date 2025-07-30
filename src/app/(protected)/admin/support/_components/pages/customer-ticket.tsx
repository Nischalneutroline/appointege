'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import DataTable, { TableColumn } from '@/components/table/data-table'
import {
  Ticket,
  Priority,
  TicketStatus,
  TicketCategory,
  Role,
} from '../../_types/types'
import { ChevronDown, Plus, RefreshCcw } from 'lucide-react'
import { RefreshCw } from 'lucide-react'
import TicketFormModal from '../forms/customer-ticket-from'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/store/store'

import {
  closeTicketForm,
  fetchTickets,
  openTicketForm,
  setActiveFilter,
  setActiveFilters,
  setSearchQuery,
  TicketFilterValue,
  TicketFormData,
  TicketItem,
} from '@/store/slices/ticketSlice'
import FilterTabs from '@/components/shared/layout/filter-tabs'
import { createFilterOptions } from '../../_data/data'
import { columns } from '../../_data/column'
import SearchBar from '@/components/shared/layout/search-bar'
import FilterDropdown from '@/components/shared/layout/filter-dropdown'
import Image from 'next/image'
import { capitalizeFirstLetter } from '@/lib/capitalize-text'

const DEFAULT_TICKET_FILTERS_VALUES: TicketFilterValue[] = [
  'ALL',
  'OPEN',
  'RESOLVED',
  'IN_PROGRESS',
  'CLOSED',
]

const CustomerTicket = () => {
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const hasFetched = useRef(false)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!hasFetched.current) {
      dispatch(fetchTickets())
      dispatch(
        setActiveFilters(DEFAULT_TICKET_FILTERS_VALUES as TicketFilterValue[]),
      )
      hasFetched.current = true
    }
  }, [dispatch])

  const {
    userTickets: tickets,
    activeFilters,
    activeFilter,
    isLoading,
    isTicketFormOpen,
  } = useSelector((state: RootState) => state.ticket)
  console.log(tickets, 'tickets')
  const allTickets = tickets?.length > 0 ? tickets : []

  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      const matchesStatus = activeFilters.includes(
        ticket.status.toUpperCase() as TicketFilterValue, // ✅ normalize
      )

      const matchesPriority = priorityFilter
        ? ticket.priority?.toUpperCase() === priorityFilter.toUpperCase()
        : true

      const matchesSearch = searchQuery
        ? ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      return matchesStatus && matchesPriority && matchesSearch
    })
  }, [activeFilters, priorityFilter, searchQuery, allTickets])

  const enrichedFilterOptions = useMemo(
    () => createFilterOptions(allTickets),
    [allTickets],
  )
  console.log(filteredTickets, 'Filtered Tickets')
  const handleRefresh = useCallback(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    setIsRefreshing(true)
    debounceTimeout.current = setTimeout(() => {
      dispatch(fetchTickets()) // Simulate refresh
      setIsRefreshing(false)
    }, 800)
  }, [dispatch])

  const handleOpenCreateForm = () => {
    dispatch(openTicketForm({ ticket: null, mode: 'create' }))
  }

  const handleOpenEditForm = (ticket: TicketFormData) => {
    dispatch(openTicketForm({ ticket, mode: 'edit' }))
  }
  const handleCloseForm = () => {
    dispatch(closeTicketForm())
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div
            className={cn(
              'w-full md:w-fit flex items-center gap-1 overflow-x-auto px-0.5 bg-[#FAFCFE] h-11 rounded-[10px] border border-[#E5E7EB]',
              'scrollbar-thin scrollbar-track-gray-300 scrollbar-thumb-gray-500',
            )}
          >
            {enrichedFilterOptions.map((option, index: number) => (
              <FilterTabs
                key={index}
                {...option}
                sliceName="ticket"
                onDispatch={(filter: string) =>
                  dispatch(setActiveFilter(filter as TicketFilterValue))
                }
              />
            ))}
          </div>

          <div className="flex gap-8 items-center">
            <div className="flex gap-2 min-w-1/4 lg:gap-3 justify-between">
              <SearchBar
                className="bg-white rounded-[8px]"
                placeholder="Search FAQs"
                width="w-full max-w-[530px]"
                onSearch={(value) => setSearchQuery(value)}
              />
              <div className="flex gap-3 justify-end">
                <FilterDropdown<TicketFilterValue>
                  filterOptions={enrichedFilterOptions}
                  activeFilters={activeFilters}
                  defaultFilters={
                    DEFAULT_TICKET_FILTERS_VALUES as TicketFilterValue[]
                  }
                  sliceName="ticket"
                  onDispatch={{ setActiveFilter, setActiveFilters }}
                />
              </div>
            </div>

            <div className="flex gap-2 items-center h-full">
              <button
                className="flex items-center h-10 p-3 rounded-md bg-[#2563EB] text-white active:scale-95 "
                onClick={handleOpenCreateForm}
              >
                <Plus className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">Create Ticket</span>
              </button>
              <div
                className={cn(
                  'flex items-center justify-center text-[#7285BD] cursor-pointer hover:rotate-90 transition duration-700 hover:scale-110',
                  isRefreshing && 'animate-spin',
                )}
                onClick={handleRefresh}
                aria-label={isRefreshing ? 'Refreshing FAQs' : 'Refresh FAQs'}
                aria-busy={isRefreshing}
              >
                <RefreshCcw strokeWidth={2.5} size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="h-[calc(100vh-200px)] w-full">
          {' '}
          {filteredTickets.length > 0 ? (
            <div className=" ">
              <DataTable
                columns={columns(dispatch)}
                data={filteredTickets}
                rowKey="id"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/ecommerce.svg"
                  alt="No appointments"
                  width={140}
                  height={140}
                />
                <div className="text-2xl text-[#4F7CFF] font-semibold">
                  No Ticket Found
                </div>
                <div className="text-[#9F9C9C] text-sm font-medium">
                  {searchQuery ? (
                    <>
                      No tickets match your search query "{searchQuery}" for{' '}
                      {activeFilter === 'ALL'
                        ? 'all tickets'
                        : `${capitalizeFirstLetter(activeFilter)} Customer tickets`}
                      .
                    </>
                  ) : (
                    <>
                      No tickets found for{' '}
                      {activeFilter === 'ALL'
                        ? 'all tickets'
                        : activeFilter === 'IN_PROGRESS'
                          ? 'In Progress'
                          : `${capitalizeFirstLetter(activeFilter)} ticket.`}
                    </>
                  )}
                  <button
                    className="p-1 ml-1 text-blue-600 hover:underline disabled:opacity-50"
                    onClick={handleRefresh}
                    disabled={isRefreshing || isLoading}
                    aria-label="Retry fetching appointments"
                  >
                    Try refreshing
                  </button>{' '}
                  or creating a new appointment.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <TicketFormModal
        open={isTicketFormOpen}
        onChange={handleCloseForm}
        ticketType="Customer"
      />
    </>
  )
}

export default CustomerTicket
