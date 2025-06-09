'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ResetSchema, ResetSchemaType } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import CardWrapper from './card-wrapper'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { resetPassword } from '@/actions/reset'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react'
import Link from 'next/link'
import FormLabel from '../ui/form-label'

export default function ResetForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [email, setEmail] = useState<string | undefined>()
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: ResetSchemaType) => {
    setError('')
    setSuccess('')
    startTransition(async () => {
      const result = await resetPassword(values)

      // Fallback in case `result` is undefined or invalid
      if (!result) {
        setError('Unexpected error, please try again!')
        return
      }

      const { error, success } = result // Safely destructure
      console.log(error, success)

      if (error) {
        setError(error)
      }
      if (success) {
        setEmailSent(true)
        setEmail(values.email)
        setSuccess(success)
      }
      // console.error("Error while login form:", err)
      // setError("Something went wrong, please try again, or reload! 😉")
    })
  }

  if (emailSent) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Check Your Email
          </h2>
          <p className="text-slate-600 text-sm">
            We've sent password reset instructions to{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-slate-600 text-sm">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <Button
            type="button"
            onClick={() => {
              setEmailSent(false)
              setError(undefined)
              setSuccess(undefined)
              setEmail(undefined)
              form.reset()
            }}
            className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
          >
            Try Again
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm mt-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl text-slate-800  -tracking-[0.020rem] font-extrabold">
          Reset Password
        </h2>
        <p className="text-slate-600 text-sm font-medium -tracking-[0.010rem]">
          Enter the email associated with your account, and we'll send you a
          password reset link.
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px] relative">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] absolute -bottom-4 min-h-[18px]" />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type="submit"
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm mt-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  )
}
