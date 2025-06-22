import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import Image from 'next/image'
import React from 'react'

interface DeleteAppointmentProps {
  open: boolean
  onChange: (open: boolean) => void
}

const DeleteAppointment = ({ open, onChange }: DeleteAppointmentProps) => {
  return (
    <Dialog onOpenChange={onChange} open={open}>
      <DialogContent className="flex flex-col gap-4">
        <DialogTitle>
          <div className="flex justify-center">
            <Image
              src="/assets/Delete Empty state.svg"
              alt="delete icon"
              width={150}
              height={150}
            />
          </div>
        </DialogTitle>
        <DialogDescription className="text-center text-sm font-medium text-[#6B7280]">
          Are you sure you want to delete an appointment?
        </DialogDescription>
        <div className="flex w-full gap-4 justify-center">
          <button
            type="button"
            className="w-30 flex justify-center items-center px-4 py-1.5 bg-[#EF4444] text-white rounded-md text-sm font-semibold cursor-pointer"
            onClick={() => onChange(false)}
          >
            Delete
          </button>
          <button
            className="w-30 flex justify-center items-center px-4 py-1.5 border border-[#E5E7EB] text-[#9CA3AF] rounded-md text-sm font-semibold cursor-pointer"
            onClick={() => onChange(false)}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAppointment
