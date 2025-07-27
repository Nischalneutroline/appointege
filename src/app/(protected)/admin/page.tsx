'use client'

import { fetchAppointments } from '@/store/slices/appointmentSlice'
import { fetchBusinessByOwnerId } from '@/store/slices/businessSlice'
import { fetchCustomers } from '@/store/slices/customerSlice'
import { fetchServices } from '@/store/slices/serviceslice'

import { AppDispatch, RootState } from '@/store/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

  return <div>Dashboard</div>
}

export default AdminDashboard
