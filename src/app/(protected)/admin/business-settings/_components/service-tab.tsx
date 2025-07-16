'use client'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setActiveStep, completeStep } from '@/store/slices/businessSlice'
import { ServiceAvailabilityForm } from './service-availability-form'

export default function ServiceTab() {
  const dispatch = useDispatch<AppDispatch>()

  const handleBack = useCallback(() => {
    dispatch(setActiveStep('business-settings'))
  }, [dispatch])

  const handleSubmitSuccess = useCallback(() => {
    dispatch(completeStep('services'))
    dispatch(setActiveStep('business-details'))
  }, [dispatch])

  return (
    <ServiceAvailabilityForm
      onBack={handleBack}
      onSubmitSuccess={handleSubmitSuccess}
    />
  )
}
