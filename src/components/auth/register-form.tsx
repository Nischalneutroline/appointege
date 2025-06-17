'use client'

import React, { useState, useTransition } from 'react'
import CardWrapper from './card-wrapper'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { LoginSchema, LoginSchemaType, SignupSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { register, sendVerifyEmail } from '@/actions/register'
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

import Link from 'next/link'
import { Social } from './social'

import FormLabel from '../ui/form-label'
import { useRouter } from 'next/navigation'
import { Toaster } from '../ui/sonner'
import { toast } from 'sonner'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { cn } from '@/lib/utils'
// import { login } from "@/actions/login"
// import { register } from "@/actions/register"

type SignupFormValues = z.infer<typeof SignupSchema>

type PasswordStrength = {
  strength: number
  label: string
  color: string
  checks: {
    length: boolean
    lowercase: boolean
    uppercase: boolean
    number: boolean
    special: boolean
  }
  level: 'weak' | 'moderate' | 'strong'
}

function getPasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const strength = Object.values(checks).filter(Boolean).length

  let label = 'Very Weak'
  let color = 'bg-red-500'
  let level = 'weak'
  if (strength >= 4) {
    label = 'Strong'
    color = 'bg-green-500'
    level = 'strong'
  } else if (strength === 3) {
    label = 'Moderate'
    color = 'bg-yellow-500'
    level = 'moderate'
  } else if (strength === 2) {
    label = 'Weak'
    color = 'bg-orange-500'
    level = 'weak'
  }

  return {
    strength,
    label,
    color,
    level,
    checks,
  }
}

export default function RegisterForm() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [accCreated, setAccCreated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword1, setShowPassword1] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [formValues, setFormValues] = useState<SignupFormValues>()
  const [submitting, setSubmitting] = useState(false)
  const [showPasswordStrength, setShowPasswordStrength] = useState(true)
  const router = useRouter()
  const passwordStrength = getPasswordStrength(passwordValue)

  const [isPending, startTransition] = useTransition()

  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      password1: '',
    },
  })

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    setSuccess('')
    setError('')
    setFormValues(values)
    startTransition(async () => {
      const { success, error } = await register(values)
      if (success) {
        setSuccess(success)
        // form.reset()
        setAccCreated(true)
      }
      if (error) setError(error)
      // register(values)
      //   .then(({ success, error }) => {
      //     if (success) setSuccess(success)
      //     if (error) setError(error)
      //   })
      //   .catch((error) => setError("Couldn't get action!"))
    })
  }

  const handleTermsChange = (checked: boolean) => {
    setAgreeToTerms(checked === true)
  }

  if (accCreated) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl">
        {/* Success Alert Bar - Centered within card */}
        {!submitting && success && (
          <div
            className={cn(
              ' border bg-green-100 border-green-100 rounded-xl p-4 animate-fade-in shadow-sm z-[10]',
            )}
          >
            <div className=" bg-green-100 flex items-center justify-center space-x-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-3 h-3 text-white" fill="#4CAF50" />
              </div>
              <span className="text-green-700 font-medium text-sm">
                {success}
              </span>
            </div>
          </div>
        )}
        {!submitting && error && (
          <div
            className={cn(
              ' border bg-red-100 border-red-100 rounded-xl p-4 animate-fade-in shadow-sm z-[10]',
            )}
          >
            <div className=" bg-red-50 flex items-center justify-center space-x-3">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-3 h-3 text-white" fill="#F44336" />
              </div>
              <span className="text-red-700 font-medium text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Email Icon */}
        {/* <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Mail className="w-8 h-8 text-[#00a4f4]" />
        </div> */}

        {!submitting && success && (
          <div className="relative mb-8 z-[5]">
            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative">
              <Mail className="w-10 h-10 text-[#00a4f4] animate-bounce" />

              {/* Floating sparkles */}
              <Sparkles className="w-4 h-4 text-blue-800 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="w-3 h-3 text-red-400 absolute -bottom-1 -left-2 animate-pulse delay-300" />
              <Sparkles className="w-3 h-3 text-blue-500 absolute top-2 -left-3 animate-pulse delay-700" />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 w-18 h-18 mx-auto rounded-2xl border-2 border-blue-400 animate-ping opacity-20" />
            <div className="absolute inset-0 w-18 h-18 mx-auto rounded-2xl border border-blue-600 animate-ping opacity-30 delay-300" />
          </div>
        )}
        {!submitting && error && (
          <div className="relative mb-8 z-[5]">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg relative">
              <HiOutlineExclamationTriangle className="w-10 h-10 text-[#cc3f18] animate-bounce" />

              {/* Floating sparkles */}
              <Sparkles className="w-4 h-4 text-red-800 absolute -top-2 -right-2 animate-pulse" />
              <Sparkles className="w-3 h-3 text-red-400 absolute -bottom-1 -left-2 animate-pulse delay-300" />
              <Sparkles className="w-3 h-3 text-red-500 absolute top-2 -left-3 animate-pulse delay-700" />
            </div>

            {/* Ripple effect */}
            <div className="absolute inset-0 w-18 h-18 mx-auto rounded-2xl border-2 border-red-400 animate-ping opacity-20" />
            <div className="absolute inset-0 w-18 h-18 mx-auto rounded-2xl border border-red-600 animate-ping opacity-30 delay-300" />
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl text-slate-800 font-extrabold -tracking-[0.011rem] flex items-center justify-center space-x-3">
            <div className="text-3xl h-fit">📧 </div>
            <div>Check Your Inbox!</div>
          </h1>

          <div className="space-y-1">
            <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem] ">
              We've sent a confirmation link to your email.
            </p>
            <p className="text-slate-600 text-xs font-medium  -tracking-[0.011rem] ">
              Please click the link to activate your Appointege account.
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 gap-2">
          <h3 className="font-semibold text-slate-800 text-center text-sm">
            Didn't receive the email?
          </h3>
          <ul className="text-slate-600 text-xs space-y-1 font-medium">
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
              <span>Check your spam or junk folder in email.</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2 flex-shrink-0" />
              <span>You can resend the confirmation email.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-6">
          <Button
            onClick={async () => {
              if (formValues) {
                setSubmitting(true)
                setError('')
                setSuccess('')
                try {
                  const { success, error } = await sendVerifyEmail(
                    formValues?.email,
                  )
                  if (success) {
                    setSubmitting(false)
                    setSuccess('Confirmation email resent successfully!')
                  }
                  if (error) setError(error)
                } catch (err) {
                  setError('Failed to resend email. Please try again.')
                }
                setSubmitting(false)
              }
            }}
            disabled={submitting}
            className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-rotate-180" />
            )}
            {submitting ? 'Sending...' : 'Resend Email'}
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-slate-500 text-xs">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8 3xl:p-10 4xl:p-12 5xl:p-14 space-y-6 ">
      <div className="text-center mb-6 3xl:mb-8 4xl:mb-10 5xl:mb-12 space-y-2 ">
        <h2 className="text-2xl 3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-slate-800 font-bold  -tracking-[0.011rem] ">
          Create Account
        </h2>
        <p className="text-slate-600 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium  -tracking-[0.011rem] ">
          Join Appointege and start managing appointments
        </p>
      </div>

      <div className="flex flex-col gap-4 3xl:gap-6 4xl:gap-8 5xl:gap-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4 lg:space-y-5 3xl:space-y-6 4xl:space-y-8 5xl:space-y-10"
            noValidate
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter Your Full Name"
                        disabled={isPending}
                        className="pl-9 3xl:pl-10 4xl:pl-12 5xl:pl-14 h-11 3xl:h-12 4xl:h-14  5xl:h-16 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] min-h-[18px]" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />

                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="Enter Your Email"
                        className="pl-9 3xl:pl-10 4xl:pl-12 5xl:pl-14 h-11 3xl:h-12 4xl:h-14  5xl:h-16 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px]  min-h-[18px]" />
                </FormItem>
              )}
            />
            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="tel"
                        placeholder="Enter Your Phone Number"
                        className="pl-9 3xl:pl-10 4xl:pl-12 5xl:pl-14 h-11 3xl:h-12 4xl:h-14  5xl:h-16 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] min-h-[18px]" />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create Password"
                        disabled={isPending}
                        onChange={(e) => {
                          field.onChange(e)
                          setPasswordValue(e.target.value)
                          setShowPasswordStrength(true)
                        }}
                        className="pl-9 3xl:pl-10 4xl:pl-12 5xl:pl-14 h-11 3xl:h-12 4xl:h-14  5xl:h-16 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] min-h-[18px]" />
                </FormItem>
              )}
            />
            {/* Password Strength UI */}
            {showPasswordStrength && passwordValue && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Password strength:
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength < 2
                        ? 'text-red-600'
                        : passwordStrength.strength < 4
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                    }}
                  />
                </div>
                <div className="space-y-1">
                  {Object.entries(passwordStrength.checks).map(
                    ([key, passed]) => (
                      <div
                        key={key}
                        className="flex items-center space-x-2 text-xs"
                      >
                        {passed ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-slate-400" />
                        )}
                        <span
                          className={
                            passed ? 'text-green-600' : 'text-slate-500'
                          }
                        >
                          {key === 'length' && 'At least 8 characters'}
                          {key === 'lowercase' && 'One lowercase letter'}
                          {key === 'uppercase' && 'One uppercase letter'}
                          {key === 'number' && 'One number'}
                          {key === 'special' && 'One special character'}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="password1"
              render={({ field }) => (
                <FormItem className="space-y-[2px]  ">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 5xl:w-7 5xl:h-7" />

                      <Input
                        {...field}
                        type={showPassword1 ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        disabled={isPending}
                        className="pl-9 3xl:pl-10 4xl:pl-12 5xl:pl-14 h-11 3xl:h-12 4xl:h-14  5xl:h-16 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-medium placeholder:-tracking-[0.011rem]"
                        onFocus={() => {
                          if (passwordStrength.level === 'strong') {
                            setShowPasswordStrength(false)
                          } else {
                            setShowPasswordStrength(true)
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword1(!showPassword1)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword1 ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-[12px] min-h-[18px]" />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="flex w-full items-start py-1 space-x-3">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={handleTermsChange}
                className="mt-[4px] 3xl:mt-[0px] h-4 w-4 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-7 5xl:w-7 flex-shrink-0 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
              />
              <Label
                htmlFor="terms"
                className="ml-2 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl text-slate-600"
              >
                <span className="whitespace-nowrap">
                  I agree to the{' '}
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Privacy <br className="3xl:hidden block" /> Policy
                  </a>
                </span>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isPending || !agreeToTerms}
              className="cursor-pointer w-full h-11 3xl:h-12 4xl:h-16 5xl:h-18 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isPending
                ? 'Creating Account...'
                : 'Create Account & Start Managing'}
            </Button>
          </form>
        </Form>

        <Social type="up" />
      </div>

      <div className="mt-6 text-center text-sm font-normal 3xl:text-base 4xl:text-lg 5xl:text-xl">
        <p className="text-back text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-normal">
          Already have an account?{' '}
          <Link
            href={'/login'}
            className="text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
