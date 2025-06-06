"use client"

import verifyUser from "@/actions/verifyUser"
import CardWrapper from "@/components/auth/card-wrapper"
import { FormError } from "@/components/auth/form-error"
import { FormSuccess } from "@/components/auth/form-success"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmail() {
  // error and success state
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  console.log(token, "got token here")
  const router = useRouter()

  const verify = async () => {
    if (!token) {
      setError("Invalid verification link")
      return
    }

    // Start timer to track minimum display time
    const startTime = Date.now()
    const MIN_DISPLAY_TIME = 3000 // 3 seconds minimum display time

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const { success, error } = await verifyUser(token)

      // Calculate remaining time to ensure minimum display time
      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime)

      setTimeout(() => {
        if (success) {
          setSuccess(success)
          // Redirect to login after showing success message for 2 seconds
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } else if (error) {
          setError(error)
        }
        setLoading(false)
      }, remainingTime)
    } catch (error) {
      setError(
        "An error occurred while verifying your email. Please try again."
      )
      setLoading(false)
    }
  }

  // Verify the token when the component mounts or when the token changes
  useEffect(() => {
    if (!token) return
    verify()
  }, [token])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl text-slate-800 leading-8 font-extrabold">
          {isLoading ? "Verifying Email..." : "Email Verification"}
        </h2>
        <p className="text-slate-600 text-sm font-medium">
          {isLoading
            ? "Please wait while we verify your email address"
            : "We're verifying your email address"}
        </p>
      </div>
      <div className="flex flex-col gap-4 ">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-600">Confirming your email...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <FormError message={error} />
            <FormSuccess message={success} />

            {!error && !success && (
              <Button
                onClick={verify}
                disabled={isLoading}
                className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Verify Email
              </Button>
            )}

            <div className="text-center mt-4">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-sky-600 hover:text-sky-700 font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
