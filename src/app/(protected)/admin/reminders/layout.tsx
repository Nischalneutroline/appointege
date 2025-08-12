'use client'
import PageTabs from '@/components/admin/shared/page-tabs'
import { ReminderTab, setActiveTab } from '@/store/slices/reminderSlice'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { activeTab, activeTabs } = useSelector(
    (state: RootState) => state.reminder,
  )
  const dispatch = useDispatch()
  return (
    <div className="flex gap-4 overflow-hidden flex-row bg-[#F8F9FA] h-full flex-1">
      {/* Use h-full and flex-1 */}
      <div className="flex-1 w-full border rounded-md shadow h-full bg-white max-w-full flex flex-col overflow-y-auto">
        {/* Enable scrolling */}
        <PageTabs<ReminderTab>
          activeTab={activeTab}
          onTabChange={(tab) => dispatch(setActiveTab(tab))}
          customTabs={activeTabs}
          className="p-6 py-3 border-b"
        />
        {children}
      </div>
    </div>
  )
}

export default Layout
