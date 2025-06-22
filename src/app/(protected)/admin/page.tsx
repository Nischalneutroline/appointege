'use client'

import { fetchAppointments } from '@/store/slices/appointmentSlice'
import { fetchServices } from '@/store/slices/serviceslice'
import { AppDispatch } from '@/store/store'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    console.log('Fetching appointments.. fro dashboard')
    dispatch(fetchAppointments())
    dispatch(fetchServices())
  }, [dispatch]) // Only depend on dispatch to run once on mount

  return <div>hello</div>
}

export default AdminDashboard
