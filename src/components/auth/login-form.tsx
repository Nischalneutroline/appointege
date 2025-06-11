'use client'

import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
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
// import { login } from "@/actions/login"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LoginSchema } from '@/schemas'
import { login } from '@/actions/login'
import { CheckCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGGEDIN_USER_REDIRECT } from '@/routes'
import { Social } from './social'
import { Checkbox } from '../ui/checkbox'
import FormLabel from '../ui/form-label'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with credential provider!'
      : ''

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: any) => {
    setSuccess('')
    setError('')
    startTransition(async () => {
      const { success, error } = await login(values)
      if (success) {
        setSuccess(success)
        setIsLoggedIn(true)
      }
      if (error) setError(error)
      // if (twoFactor) setShowTwoFactor(true)
      //   login(values)
      //     .then(({ success, error }) => {
      //       if (success) setSuccess(success)
      //       if (error) setError(error)
      //     })
      //     .catch((error) => setError("Couldn't get action!"))
    })
  }

  const handleSocialLogin = (provider: 'google' | 'github') => {
    signIn(provider, {
      redirectTo: DEFAULT_LOGGEDIN_USER_REDIRECT,
    })
  }

  const handleRememberMeChange = (checked: boolean) => {
    console.log('Remember me checked:', checked)
    setRememberMe(checked)
  }

  if (isLoggedIn) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Login Successful!
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Redirecting you to your dashboard...
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => router.push('/')}
            className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className=" bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-2xl text-slate-800 font-extrabold -tracking-[0.011rem] ">
          Welcome Back
        </h2>
        <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem] ">
          Sign in to your Appointege account
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-4"
            noValidate
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="Enter Your Email"
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
                        // className=""
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
                <FormItem className="space-y-[2px] pt-[5px] ">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter Your Password"
                        disabled={isPending}
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
                      />
                      {/* Toggle Password */}
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    handleRememberMeChange(checked as boolean)
                  }
                  className="h-4 w-4 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-black cursor-pointer font-medium  "
                >
                  Remember me
                </label>
              </div>
              <Link
                className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors -tracking-[0.011rem]"
                href={'/reset-password'}
              >
                Forgot password?
              </Link>
            </div>

            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <Social type="in" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-black text-sm font-normal">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
