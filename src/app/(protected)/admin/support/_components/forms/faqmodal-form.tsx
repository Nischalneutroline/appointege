'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import InputField from '@/components/custom-form-fields/input-field'
import TextAreaField from '@/components/custom-form-fields/textarea-field'
import SelectField from '@/components/custom-form-fields/select-field'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/loading-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const categoryOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'All', value: 'all' },
]

import { z } from 'zod'
import {
  closeFaqForm,
  createFaq,
  fetchFaq,
  updateFaq,
  // createFaq,
  // storeFaq,
  // updateFaq,
} from '@/store/slices/supportSlice'
import { faqSchema } from '../../_schemas/faqSchema'


export type FAQFormData = z.infer<typeof faqSchema>

const FaqFormModal = ({
  open,
  onChange,
}: {
  open: boolean
  onChange: (open: boolean) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { currentFaq, faqFormMode, isFaqFormOpen, success } = useSelector(
    (state: RootState) => state.support.faq,
  )
  const user = useSelector((state: RootState) => state.auth.user)

  const form = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
      category: 'public',
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (faqFormMode === 'edit' && currentFaq) {
      form.reset({
        question: currentFaq.question,
        answer: currentFaq.answer,
        category: currentFaq.category || 'public',
      })
    } else if (!isFaqFormOpen) {
      form.reset()
    }
  }, [faqFormMode, currentFaq, isFaqFormOpen, form])

  useEffect(() => {
    if (success && isSubmitting) {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }, [success, isSubmitting, faqFormMode])

  const handleBack = () => {
    dispatch(closeFaqForm())
    onChange(false)
  }

  const onSubmit = async (data: any) => {
    // console.log('Form Data:', {
    //   ...data,
    //   // Show the raw form data along with additional context
    //   formMode: faqFormMode,
    //   currentFaqId: currentFaq?.id,
    //   timestamp: new Date().toISOString()
    // });
    const updatedData = {
      ...data,
      createdById: user?.id,
      // lastUpdatedById: user?.id,
    }
    console.log(updatedData, 'data')
    // For now, we're just logging the data
    // Uncomment and modify the following when ready to submit:
    form.reset()
    try {
      setIsSubmitting(true)
      if (faqFormMode === 'edit' && currentFaq?.id) {
        const updatedBeforeUpdate = {
          id: currentFaq.id,
          ...data,
          lastUpdatedById: user?.id,
          lastUpdatedAt: new Date().toISOString(),
        }
        await dispatch(updateFaq(updatedBeforeUpdate)).unwrap()
        await dispatch(fetchFaq())

        onChange(false) // Close the modal after successful update
      } else {
        await dispatch(createFaq(updatedData)).unwrap()
        await dispatch(fetchFaq())

        onChange(false) // Close the modal after successful create
      }
    } catch (err) {
      console.error('Error submitting form:', err)
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog onOpenChange={handleBack} open={open}>
      <DialogContent className="bg-white max-w-[500px] w-full">
        <DialogHeader>
          <DialogTitle className="text-blue-700 text-base sm:text-xl">
            {faqFormMode === 'edit' ? 'Edit FAQ' : 'Create FAQ'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {faqFormMode === 'edit'
              ? 'Update the FAQ content.'
              : 'Fill in the details to create a new FAQ.'}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <InputField
              name="question"
              label="Question"
              placeholder="Enter the question"
              className="border border-blue-200 rounded"
            />
            <TextAreaField
              name="answer"
              label="Answer"
              placeholder="Enter the answer"
              className="border border-blue-200 rounded min-h-[100px]"
            />
            <SelectField
              name="category"
              label="Category"
              options={categoryOptions}
              placeholder="Select category"
              className="border border-blue-200 rounded"
            />

            <div className="flex justify-center mt-4">
              <Button
                type="submit"
                variant="default"
                className="w-24"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? faqFormMode === 'edit'
                    ? 'Updating...'
                    : 'Saving...'
                  : faqFormMode === 'edit'
                    ? 'Update'
                    : 'Save'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default FaqFormModal
