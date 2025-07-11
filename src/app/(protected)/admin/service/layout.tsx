'use client'

import Heading from '@/components/admin/shared/heading'
import React, { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { CalendarCheck, CalendarX2, Plus } from 'lucide-react'
import ViewTabs from '@/components/shared/layout/view-tabs'
import LayoutCards from '@/components/shared/layout/layout-cards'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'

import {
  CalendarDays,
  Clock,
  CircleCheckBig,
  Delete,
  PhoneMissed,
  Users,
} from 'lucide-react'
import { DEFAULT_SERVICE_FILTERS_VALUES } from './_types/service'
import {
  closeServiceForm,
  deleteService,
  openServiceCreateForm,
} from '@/store/slices/serviceslice'
import NewServiceForm from './_components/new-service'
import DeleteModal from '../appointment/_component/delete-appointment'
import ViewService from './_components/view-service'

// Map icon names to LucideIcon components
const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  CalendarCheck,
  CalendarX2,
  CalendarDays,
}

const ServiceLayout = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>()
    const {
      isFormOpen,
      isLoading,
      serviceFormMode,
      currentService,
      filterOptions,
      counts,
      activeFilters,
    } = useSelector((state: RootState) => state.service)

    const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
    const [buttonName, setButtonName] = useState('New Service')

    // Memoize enrichedFilterOptions to prevent unnecessary recalculations
    const enrichedFilterOptions = useMemo(() => {
      return filterOptions
        .filter((option) =>
          DEFAULT_SERVICE_FILTERS_VALUES.includes(option.value),
        )
        .map((option) => {
          const IconComponent = iconMap[option.icon] || CalendarDays
          return {
            ...option,
            count: counts[option.value],
            icon: (
              <IconComponent
                size={24}
                className={`text-[${option.textColor}]`}
              />
            ),
          }
        })
    }, [filterOptions, counts])

    // Adjust button name based on screen size
    useEffect(() => {
      const handleResize = () => {
        setButtonName(window.innerWidth < 500 ? 'New' : 'New Service')
      }
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
      <main className="flex flex-col gap-4 h-full">
        <div className="flex flex-col justify-between gap-4">
          <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
            <Heading
              title="Service"
              description="Manage and schedule your service effortlessly."
            />
            <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10">
              <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1 rounded-[8px]">
                <ViewTabs viewMode={viewMode} setViewMode={setViewMode} />
              </div>
              <div>
                <Button
                  className="active:scale-95"
                  onClick={() => dispatch(openServiceCreateForm())}
                >
                  <span>
                    <Plus />
                  </span>
                  <span>{buttonName}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex gap-4 min-w-[340px]">
            {enrichedFilterOptions.map((option) => (
              <LayoutCards key={option.value} option={option} />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>

        {isFormOpen &&
          (serviceFormMode === 'create' || serviceFormMode === 'edit') && (
            <NewServiceForm
              open={isFormOpen}
              onChange={() => dispatch(closeServiceForm())}
            />
          )}
        {isFormOpen && serviceFormMode === 'view' && currentService && (
          <ViewService
            open={isFormOpen}
            onChange={() => dispatch(closeServiceForm())}
          />
        )}
        {isFormOpen && serviceFormMode === 'delete' && currentService && (
          <DeleteModal
            open={isFormOpen}
            onChange={() => dispatch(closeServiceForm())}
            isLoading={isLoading}
            sliceName="service"
            currentItem={currentService}
            deleteAction={deleteService}
            closeAction={closeServiceForm}
          />
        )}
      </main>
    )
  },
)

ServiceLayout.displayName = 'ServiceLayout'

export default ServiceLayout
