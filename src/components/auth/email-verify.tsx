'use client'

import verifyUser from '@/actions/verifyUser'
import CardWrapper from '@/components/auth/card-wrapper'
import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { AlertTriangle, ArrowLeft, Loader2, MailCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifyEmail() {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()

  const verify = async () => {
    if (!token) {
      setError('Invalid verification link')
      return
    }

    const startTime = Date.now()
    const MIN_DISPLAY_TIME = 3000 // 3 seconds minimum display time

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const { success, error } = await verifyUser(token)

      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime)

      setTimeout(() => {
        if (success) {
          setSuccess(success || 'Your email has been verified successfully!')
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        } else {
          setError(
            error ||
              'Failed to verify email. The link may be invalid or expired.',
          )
        }
        setLoading(false)
      }, remainingTime)
    } catch (error) {
      setError(
        'An error occurred while verifying your email. Please try again later.',
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      setError(
        'No verification token found. Please use the link from your email.',
      )
      return
    }
    verify()
  }, [token])

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
      <div className="text-center flex flex-col items-center gap-4 ">
        {isLoading ? (
          <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
          </div>
        ) : success ? (
          <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
            <MailCheck className="w-6 h-6 text-green-500" />
          </div>
        ) : error ? (
          <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
            <MailCheck className="w-6 h-6 text-slate-400" />
          </div>
        )}

        <div className="text-center space-y-1">
          <h2 className="text-2xl text-slate-800 font-extrabold -tracking-[0.011rem]">
            {isLoading
              ? 'Verifying Your Email'
              : success
              ? 'Email Verified!'
              : error
              ? 'Verification Failed'
              : 'Verify Your Email'}
          </h2>

          <p className="text-slate-600 text-sm font-medium -tracking-[0.010rem] px-4">
            {isLoading
              ? 'Please wait while we verify your email address. This may take a moment.'
              : success
              ? 'Your email has been successfully verified. Redirecting you to login...'
              : error
              ? 'Error occured while verifying your email. Please try again later.'
              : 'Please wait while we verify your email...'}
          </p>
        </div>
      </div>
      <FormError message={error} />
      <FormSuccess message={success} />
      <div className="flex flex-col gap-4">
        {error && !isLoading && (
          <div className="flex flex-col gap-2 items-center w-full">
            <div className="text-center space-y-4">
              <p className="text-slate-600 text-xs">
                Need help? Please contact support if the <br /> problem
                persists.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
