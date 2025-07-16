'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setActiveStep } from '@/store/slices/businessSlice'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
// Import your form components
import BusinessDetail from './_components/business-details'
import BusinessAvailability from './_components/business-availability'
import ServiceDetails from './_components/service-tab'
import BusinessSetting from './_components/business-setting'
import ServiceSetting from './_components/service-setting'

type Step = {
  id: number
  title: string
  description: string
  component: React.ReactNode
  key: string
}

const BusinessSettingsPage = () => {
  const { activeStep } = useSelector((state: RootState) => state.business)
  const dispatch = useDispatch()

  // Set the active step in Redux
  // useEffect(() => {
  //   const current = steps.find((step) => step.id === activeStep)
  //   if (current) {
  //     dispatch(setActiveStep(current.key))
  //   }
  // }, [activeStep, dispatch])

  // const currentStepData = steps.find((step) => step.id === currentStep)

  // if (!currentStepData) {
  //   return <div>Invalid step</div>
  // }

  // const handleNext = () => {
  //   if (currentStep < steps.length) {
  //     setCurrentStep(currentStep + 1)
  //   }
  // }

  // const handleBack = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep(currentStep - 1)
  //   }
  // }

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
