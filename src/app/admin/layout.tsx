'use client'

import Header from '@/components/shared/layout/header'
import SidebarDesktop from '@/components/shared/layout/sidebar-desktop'
import SidebarMobile from '@/components/shared/layout/sidebar-mobile'
import { SidebarProvider } from '@/context/sidebar-context'
// import SidebarMobile from "@/components/admin/sidebar-mobile";
// // import { useBusinessStore } from "@/state/store"
// import { useEffect } from "react";
// import { useAppointmentStore } from "./appointment/_store/appointment-store";

// import { useCustomerStore } from "./customer/_store/customer-store";
// import { useBusinessStore } from "./business-settings/_store/business-store";
// import { Toaster } from "@/components/ui/sonner";
// import { useNotificationStore } from "./reminders/_store/reminder-store";
// import { useServiceStore } from "./service/_store/service-store";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  // Auto load services after admin loads
  //   const { fetchServices } = useServiceStore();
  //   const { fetchAppointments } = useAppointmentStore();
  //   const { fetchBusinessById } = useBusinessStore();
  //   const { fetchCustomers } = useCustomerStore();
  //   const { fetchReminders, fetchAnnouncements } = useNotificationStore();
  //   // Fetch services on app load
  //   useEffect(() => {
  //     console.log(
  //       "App fully loaded, fetching appoinments, services, business..."
  //     );
  //     // Fetch once after app loads
  //     const id = "cmb81m1af000lms8gyxbm11e7"; // Updated to match provided business data
  //     fetchBusinessById(id);
  //     fetchAppointments();
  //     fetchServices();
  //     // fetchBusinesses("cmaf5ax9p000nmstgxvsknuv2")
  //     fetchCustomers();
  //     fetchReminders();
  //     fetchAnnouncements();
  //   }, [fetchServices, fetchAppointments, fetchCustomers, fetchBusinessById]);

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-stone-100 overflow-hidden border-r-2">
        {/* Top Background Gradient */}
        {/* <div className="absolute inset-0 h-[30vh] rounded-b-lg z-0 pointer-events-none bg-gradient" /> */}

        {/* Layout */}
        <div className="relative z-10 flex  h-screen">
          {/* Sidebar */}
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SidebarDesktop />
          </div>

          {/* Mobile Navbar */}
          <div className="fixed inset-0 pointer-events-none z-50">
            <SidebarMobile />
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col w-full h-full">
            {/* Header */}
            <Header />
            {/* Main Content */}
            {/* <Toaster position="bottom-right" /> */}
            <div className="flex-1  shadow p-3 sm:p-4 md:p-6 bg-[#fbfbfb] overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
