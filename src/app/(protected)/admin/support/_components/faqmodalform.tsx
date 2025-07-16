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
import { closeFaqForm, storeFaq, updateFaq } from '@/store/slices/faqSlice'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const categoryOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'All', value: 'all' },
]

import { z } from 'zod'

export const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  category: z.enum(['public', 'private', 'all'], {
    required_error: 'Category is required',
  }),
})

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
    (state: RootState) => state.faq,
  )

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
      toast.success(
        faqFormMode === 'edit'
          ? 'FAQ updated successfully!'
          : 'FAQ created successfully!',
      )
    }
  }, [success, isSubmitting, faqFormMode])

  const handleBack = () => {
    dispatch(closeFaqForm())
    onChange(false)
  }

  const onSubmit = async (data: FAQFormData) => {
    try {
      setIsSubmitting(true)
      if (faqFormMode === 'edit' && currentFaq?.id) {
        await dispatch(updateFaq({ id: currentFaq.id, ...data })).unwrap()
      } else {
        await dispatch(storeFaq(data)).unwrap()
      }
    } catch (err) {
      toast.error('Something went wrong.')
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
                {isSubmitting ? (
                  <LoadingSpinner
                    text={faqFormMode === 'edit' ? 'Updating...' : 'Saving...'}
                  />
                ) : faqFormMode === 'edit' ? (
                  'Update'
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default FaqFormModal
