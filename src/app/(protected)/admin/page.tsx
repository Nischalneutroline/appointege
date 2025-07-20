'use client'

import { fetchAppointments } from '@/store/slices/appointmentSlice'
import { fetchBusinessDetail } from '@/store/slices/businessSlice'
import { fetchCustomers } from '@/store/slices/customerSlice'
import { fetchServices } from '@/store/slices/serviceslice'
import { AppDispatch } from '@/store/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching appointments.. fro dashboard')
      dispatch(fetchAppointments(false))
      dispatch(fetchServices(false))
      dispatch(fetchCustomers(false))
    }

    fetchData()
  }, [dispatch]) // Only depend on dispatch to run once on mount

  return <div>Dashboard</div>
}

export default AdminDashboard
