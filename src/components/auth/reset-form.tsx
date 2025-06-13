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
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import CardWrapper from './card-wrapper'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { resetPassword } from '@/actions/reset'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleCheckBig,
  Mail,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import FormLabel from '../ui/form-label'
import { cn } from '@/lib/utils'

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

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

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
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-6 3xl:space-y-8">
        <div
          className={`relative z-10 transition-all duration-700 ${
            showContent
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Success Icon with Animation */}
          <div className="relative mb-8">
            <div className="w-20 h-20 3xl:w-24 3xl:h-24 4xl:w-28 4xl:h-28 5xl:w-32 5xl:h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative">
              <CircleCheckBig className="w-10 h-10 3xl:w-12 3xl:h-12 4xl:w-14 4xl:h-14 5xl:w-16 5xl:h-16 text-green-600 animate-bounce" />

              {/* Floating sparkles */}
              <Sparkles className="w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7 text-green-500 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="w-3 h-3 3xl:w-4 3xl:h-4 4xl:w-5 4xl:h-5 5xl:w-6 5xl:h-6 text-sky-500 absolute -bottom-1 -left-2 animate-pulse delay-300" />
              <Sparkles className="w-3 h-3 3xl:w-4 3xl:h-4 4xl:w-5 4xl:h-5 5xl:w-6 5xl:h-6 text-green-400 absolute top-2 -left-3 animate-pulse delay-700" />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 w-20 h-20 3xl:w-24 3xl:h-24 4xl:w-28 4xl:h-28 5xl:w-32 5xl:h-32 mx-auto rounded-2xl border-2 border-green-300 animate-ping opacity-20" />
            <div className="absolute inset-0 w-20 h-20 3xl:w-24 3xl:h-24 4xl:w-28 4xl:h-28 5xl:w-32 5xl:h-32 mx-auto rounded-2xl border border-green-200 animate-ping opacity-30 delay-300" />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl font-bold text-slate-800 text-center">
              ✅ Password Changed Successfully!
            </h1>

            <div className="space-y-1">
              <p className="text-slate-700 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium leading-relaxed text-center">
                Your account is now secure with your new password.
              </p>
              <p className="text-slate-600 text-xs  3xl:text-sm 4xl:text-base 5xl:text-lg font-semibold leading-relaxed text-center">
                You can now log in using your updated credentials.
              </p>
            </div>
            <p className="text-sky-600 text-xs 3xl:text-sm 4xl:text-base 5xl:text-lg font-semibold text-center">
              Ready to get back to work?
            </p>
          </div>
        </div>
        <div className="text-center flex flex-col gap-1">
          {/* <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-green-600" />
          </div> */}
          <h2 className="text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl font-bold text-slate-800">
            Check Your Email
          </h2>
          <p className="flex flex-col text-slate-600 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl">
            We've sent password reset instructions to
            <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-center text-slate-600 text-xs 3xl:text-sm 4xl:text-base 5xl:text-lg">
            Didn't receive the email?
            <br /> Check your spam folder or try again.
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
            className="cursor-pointer w-full h-11 3xl:h-12 4xl:h-16 5xl:h-18 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Try Again
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm mt-2 text-sky-600 hover:text-sky-700 font-semibold transition-colors 3xl:text-base 4xl:text-lg 5xl:text-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl 3xl:rounded-3xl 4xl:rounded-4xl 5xl:rounded-5xl border border-slate-200 p-6 3xl:p-7 4xl:p-8 5xl:p-10 space-y-6 3xl:space-y-7 4xl:space-y-8 5xl:space-y-10 shadow-2xl">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-slate-800 font-extrabold -tracking-[0.020rem]">
          Reset Password
        </h2>
        <p className="text-slate-600 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium -tracking-[0.010rem]">
          Enter the email associated with your account, and we'll send you a
          password reset link.
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 3xl:space-y-6"
            noValidate
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px] ">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="Enter Your Email Address"
                        className="pl-9 h-11 3xl:pl-10 4xl:pl-12 5xl:pl-14 3xl:h-12 4xl:h-14  5xl:h-16  border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] 3xl:text-[14px] 4xl:text-[16px] 5xl:text-[18px] min-h-[18px]" />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending || !form.formState.isValid}
              type="submit"
              className="cursor-pointer w-full h-11 3xl:h-12 4xl:h-16 5xl:h-18 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm 3xl:text-lg 4xl:text-xl 5xl:text-2xl leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <RefreshCw
                className={cn(
                  'w-4 h-4 3xl:w-6 3xl:h-6 4xl:w-8 4xl:h-8 5xl:w-10 5xl:h-10 mr-2 transition-transform duration-300',
                  isPending ? 'animate-spin' : 'group-hover:rotate-180 ',
                )}
              />
              Send Reset Link
            </Button>
          </form>
        </Form>

        {/* Back to Login Link */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl text-sky-600 hover:text-sky-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  )
}
