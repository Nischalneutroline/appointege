'use client'

import Heading from '@/components/admin/shared/heading'
import { fetchAppointments } from '@/store/slices/appointmentSlice'
import { fetchBusinessByOwnerId } from '@/store/slices/businessSlice'
import { fetchCustomers } from '@/store/slices/customerSlice'
import { fetchServices } from '@/store/slices/serviceslice'

import { AppDispatch, RootState } from '@/store/store'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TimeFilterTabs from './_components/TimeFilterTab'
import DashboardCards from './_components/Cards'
import DashboardGrid from './_components/DashboardGrid'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  const { error } = useSelector((state: RootState) => state.business)

  useEffect(() => {
    const businessId = user?.ownedBusinesses?.[0]?.id
    if (!businessId) return // Guard clause if no business ID is available

    const fetchData = async () => {
      console.log('Fetching data for dashboard...')
      try {
        await Promise.all([
          dispatch(fetchAppointments(false)),
          dispatch(fetchServices(false)),
          dispatch(fetchCustomers(false)),
          dispatch(fetchBusinessByOwnerId(user.id)),
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }

    fetchData()
  }, [dispatch, user?.ownedBusinesses, user?.id])

  // Log the business detail when it's loaded

  //TODO: Fetch from the db and calculate the counts
  //Memoize enrichedFilterOptions to prevent unnecessary recalculations
  // const enrichedFilterOptions = useMemo(() => {
  //   return filterOptions
  //     .filter((option) =>
  //       DEFAULT_DASHBOARD_FILTERS_VALUES.includes(option.value),
  //     )
  //     .map((option) => {
  //       const IconComponent = iconMap[option.icon] || CalendarDays
  //       return {
  //         ...option,
  //         count: counts[option.value],
  //         icon: (
  //           <IconComponent size={24} className={`text-[${option.textColor}]`} />
  //         ),
  //       }
  //     })
  // }, [filterOptions, counts])

  return (
    <div>
      <div className="flex flex-col justify-between gap-4">
        <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
          <Heading
            title="Dashboard"
            description="Here is the information about all your appointments"
          />
          {/* <div className="flex flex-row gap-2 md:gap-0 justify-between items-center lg:gap-3 h-10"> */}
          {/* <div className="flex items-center bg-[#E5E7EB] w-fit h-9 py-1 rounded-[8px]"> */}
          <TimeFilterTabs />
          {/* </div> */}
          {/* </div> */}
        </div>

        <DashboardCards />
        <DashboardGrid />
      </div>
    </div>
  )
}

export default AdminDashboard
