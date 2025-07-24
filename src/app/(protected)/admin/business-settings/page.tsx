'use client'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import BusinessSetting from './_components/business-setting'
import { setActiveStep } from '@/store/slices/businessSlice'

const BusinessSettingsPage = () => {
  const { activeStep } = useSelector((state: RootState) => state.business)
  const dispatch = useDispatch()

  // Set initial active step on component mount
  useEffect(() => {
    // If no active step is set, default to business-settings
    if (!activeStep) {
      dispatch(setActiveStep('business-settings'))
    }
  }, [activeStep, dispatch])

  return (
    <div className="w-full">
      <div className="w-full border border-slate-200 bg-white p-4 rounded-[8px]">
        <BusinessSetting />
      </div>
    </div>
  )
}

export default BusinessSettingsPage
