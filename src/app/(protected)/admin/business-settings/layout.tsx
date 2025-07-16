'use client'

// import { cn } from '@/utils/utils'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useEffect, useState } from 'react'
// import StepTracker from './_components/step-tracker'
import { toggleDesktopNav, toggleMobileNav } from '@/store/slices/navSlice'
import StepTracker from './_components/step-tracker'
import { cn } from '@/lib/utils'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const { desktopNavCollapse } = useSelector((state: RootState) => state.nav)
  const [currentStep, setCurrentStep] = useState('services')
  const [completedSteps, setCompletedSteps] = useState(
    new Set(['business-setting']),
  )

  const { steps } = useSelector((state: RootState) => state.business)
  useEffect(() => {
    dispatch(toggleDesktopNav())
    dispatch(toggleMobileNav())
  }, [])

  return (
    <div className="flex gap-4 overflow-visible flex-row ">
      {/* <div
        className={cn(
          ' flex-col bg-white rounded-[8px] gap-8 h-screen p-4 w-[260px] hidden md:flex',
        )}
        style={{ boxShadow: '0px 0px 20px rgba(187, 187, 187, 0.25)' }}
      >
        <div className="flex flex-col w-fit">
          <div className="text-lg text-[#111827] font-semibold leading-[30px]">
            Welcome to Setup Wizard
          </div>
          <div className="text-[#5F636D] text-sm font-normal">
            Get started in 4 steps
          </div>
        </div>
        <div className="flex flex-row gap-8 w-fit">
          <StepTracker />
        </div>
      </div> */}
      <div className="flex-1 w-full max-w-full">{children}</div>
    </div>
  )
}

export default Layout
