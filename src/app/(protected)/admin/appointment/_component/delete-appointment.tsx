import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import Image from 'next/image'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import {
  closeAppointmentForm,
  deleteAppointment,
} from '@/store/slices/appointmentSlice'

interface DeleteAppointmentProps {
  open: boolean
  onChange: (open: boolean) => void
  isLoading: boolean
}

const DeleteAppointment = ({
  open,
  onChange,
  isLoading,
}: DeleteAppointmentProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentAppointment } = useSelector(
    (state: RootState) => state.appointment,
  )

  const handleDelete = async () => {
    if (!currentAppointment) {
      console.warn('No current appointment to delete')
      return
    }

    try {
      // Dispatch the deleteAppointment async thunk
      const resultAction = await dispatch(
        deleteAppointment(currentAppointment.id),
      )
      if (deleteAppointment.fulfilled.match(resultAction)) {
        // Deletion was successful, close the dialog
        dispatch(closeAppointmentForm())
        onChange(false)
      } else {
        // Handle rejection if needed
        console.error('Deletion failed:', resultAction.payload)
      }
    } catch (error) {
      console.error('Error during deletion:', error)
    }
  }

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
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            className="w-30 flex justify-center items-center px-4 py-1.5 border border-[#E5E7EB] text-[#9CA3AF] rounded-md text-sm font-semibold cursor-pointer"
            onClick={() => onChange(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAppointment
