'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { CircleCheckBig, Mail, Phone, UserRound } from 'lucide-react'
import ViewItem from '../../appointment/_component/view/view-item'

interface CustomerDetailProps {
  open: boolean
  onChange: (open: boolean) => void
  filledData: {
    name: string
    email: string
    phone?: string
  } | null
}

const CustomerDetail = ({
  open,
  onChange,
  filledData,
}: CustomerDetailProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (filledData) {
      setIsLoaded(true)
    }
  }, [filledData])

  return (
    <>
      <style jsx>{`
        .dialog-content {
          box-sizing: border-box;
          width: 90vmin;
          max-width: min(500px, 90vw);
          min-width: 280px;
          max-height: 85vh;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1);
          overflow-y: auto;
          overflow-x: hidden;
          border-radius: 0.5rem;
          font-size: 1rem;
          line-height: 1.5;
          padding: 1rem;
        }
        @media (min-width: 640px) {
          .dialog-content {
            max-width: min(600px, 90vw);
            padding: 1.5rem;
            font-size: 1.125rem;
          }
        }
        @media (max-width: 400px) {
          .dialog-content {
            width: 95vmin;
            max-width: 95vw;
            min-width: 260px;
            padding: 0.75rem;
            font-size: 0.875rem;
          }
          .dialog-content h2 {
            font-size: 1rem;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        @media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi) {
          .dialog-content {
            transform: translate(-50%, -50%) scale(1) !important;
          }
        }
        @media (max-height: 600px) {
          .dialog-content {
            max-height: 90vh;
            padding: 0.75rem;
          }
        }
        @media screen and (max-width: 1024px) and (min-resolution: 192dpi) {
          .dialog-content {
            width: 92vmin;
            max-width: min(550px, 92vw);
          }
        }
        @media (prefers-contrast: high) {
          .dialog-content {
            border: 2px solid #000 !important;
            background: #fff !important;
          }
        }
      `}</style>
      <Dialog onOpenChange={onChange} open={open}>
        <DialogContent
          className="dialog-content bg-white shadow-lg"
          style={{ boxSizing: 'border-box' }}
          aria-describedby="dialog-description"
        >
          <DialogHeader className="">
            <DialogTitle className="text-center text-blue-700 text-base sm:text-lg md:text-xl font-semibold">
              Customer Details
            </DialogTitle>
            <DialogDescription
              id="dialog-description"
              className="text-center text-xs sm:text-sm text-muted-foreground"
            >
              View the details of the customer
            </DialogDescription>
          </DialogHeader>

          {isLoaded && filledData ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <CircleCheckBig
                  strokeWidth={2.5}
                  className="text-[#4caf50] w-6 h-6 sm:w-8 sm:h-8"
                />
                <h2 className="text-blue-700 text-base sm:text-lg font-semibold">
                  Customer Details Loaded
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-[#eff5ff] rounded-lg">
                <ViewItem
                  title="Name"
                  value={filledData.name || ''}
                  icon={<UserRound className="w-4 h-4" strokeWidth={2.5} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Email"
                  value={filledData.email || ''}
                  icon={<Mail className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
                <ViewItem
                  title="Phone"
                  value={filledData.phone || ''}
                  icon={<Phone className="w-4 h-4" strokeWidth={2} />}
                  bgColor="#dae8fe"
                  textColor="#3d73ed"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center py-10 sm:py-20 text-muted-foreground text-sm">
              Loading customer details...
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CustomerDetail
