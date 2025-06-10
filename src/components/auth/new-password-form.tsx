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
import { NewPasswordSchema, NewPasswordSchemaType } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'
import { changePassword } from '@/actions/new-password'
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react'
import Link from 'next/link'
import FormLabel from '../ui/form-label'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

// function getPasswordStrength(password: string) {
//   const checks = {
//     length: password.length >= 8,
//     lowercase: /[a-z]/.test(password),
//     uppercase: /[A-Z]/.test(password),
//     number: /[0-9]/.test(password),
//     special: /[^A-Za-z0-9]/.test(password),
//   };

//   const strength = Object.values(checks).filter(Boolean).length;

//   let label = "Very Weak";
//   let color = "bg-red-500";

//   if (strength >= 4) {
//     label = "Strong";
//     color = "bg-green-500";
//   } else if (strength === 3) {
//     label = "Moderate";
//     color = "bg-yellow-500";
//   } else if (strength === 2) {
//     label = "Weak";
//     color = "bg-orange-500";
//   }

//   return {
//     strength,
//     label,
//     color,
//     checks,
//   };
// }

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

export default function NewPasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [showPasswordStrength, setShowPasswordStrength] = useState(true)

  const passwordStrength = getPasswordStrength(passwordValue)
  const searchParams = useSearchParams()

  const token = searchParams.get('token')

  // Create form
  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
      password1: '',
    },
  })

  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // handle submit
  const onSubmit = (values: NewPasswordSchemaType) => {
    setError('')
    setSuccess('')
    if (!token) {
      setError('Token is missing!')
      return
    }
    startTransition(async () => {
      const result = await changePassword(values, token)
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
        setSuccess(success)
      }
      // console.error("Error while login form:", err)
      // setError("Something went wrong, please try again, or reload! 😉")
    })
  }

  if (error) {
    return (
      <div className=" bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl">
        <div className="text-center flex flex-col gap-1">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <HiOutlineExclamationTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Something went wrong
          </h2>

          <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem]">
            Your password could not be updated. This may be due to a temporary
            issue or an expired link.
          </p>
        </div>

        {/* Error details */}
        <div className="flex flex-col gap-4 ">
          <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-4 text-left space-y-3">
            <h3 className="font-medium text-red-800  text-center text-sm">
              Try the following:
            </h3>
            <ul className="text-red-700 text-sm gap-1 flex flex-col items-start ">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>Reset your password again</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>Request a new reset link</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>Contact our support if this continues</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <Button
              onClick={() => {
                router.push('/reset-password')
              }}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              Request New Reset Link
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="cursor-pointer flex justify-center text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="-mt-2 text-center">
          <p className="text-slate-500 text-xs">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl ">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <CheckCheck className="w-8 h-8 text-green-600" />
        </div>
        <div className="text-center flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-800">
            Password Changed Successfully!
          </h2>

          <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem]">
            Your account is now secure with your new password.
          </p>
          <p className="text-slate-600 text-xs font-medium  -tracking-[0.011rem]">
            You can now log in using your updated credentials.
          </p>
          <p className="text-sky-600 text-xs font-medium -tracking-[0.011rem]">
            Ready to get back to work?
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-r from-green-50/50 to-sky-50/50 rounded-xl p-4 border border-green-200/30 space-y-1 ">
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span className="font-medium text-slate-700 text-sm">
                Your Appointege account is ready!
              </span>
            </div>
            <p className="text-slate-600 text-xs text-center">
              Secure and ready for managing appointments.
            </p>
          </div>

          <Link
            href="/login"
            className="flex justify-center text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
        {/* Celebration message */}
        <div className="mt-4 text-center">
          <p className="text-slate-500 text-xs">Welcome back to Appointege!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xl">
      <div className="text-center flex flex-col gap-1">
        <h2 className="text-2xl text-slate-800  -tracking-[0.020rem] font-extrabold">
          Set New Password
        </h2>
        <p className="text-slate-600 text-sm font-medium -tracking-[0.010rem]">
          Create a strong password for your Appointege account
        </p>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-[3px] pt-[5px] ">
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
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
            {/* {passwordValue && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">
                    Password strength:
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength < 2
                        ? "text-red-600"
                        : passwordStrength.strength < 4
                        ? "text-yellow-600"
                        : "text-green-600"
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
                            passed ? "text-green-600" : "text-slate-500"
                          }
                        >
                          {key === "length" && "At least 8 characters"}
                          {key === "lowercase" && "One lowercase letter"}
                          {key === "uppercase" && "One uppercase letter"}
                          {key === "number" && "One number"}
                          {key === "special" && "One special character"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )} */}
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
                <FormItem className="space-y-[3px] pt-[5px] ">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        disabled={isPending}
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
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
            <FormError message={error} />
            <FormSuccess message={success} />
            {/* <Button disabled={isPending} type="submit">
            Rest Password


            
          </Button> */}

            <div className="bg-sky-50/50 border border-sky-200/50 rounded-xl p-4">
              <p className="text-sky-800 text-sm font-medium mb-2">
                Password Requirements:
              </p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      passwordValue.length >= 8
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sky-700">Must be 8+ characters</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      /[A-Z]/.test(passwordValue)
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sky-700">
                    At least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      /[0-9]/.test(passwordValue)
                        ? 'bg-green-500'
                        : 'bg-slate-300'
                    }`}
                  />
                  <span className="text-sky-700">
                    At least one number or symbol
                  </span>
                </div>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              {isPending ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="flex justify-center text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>
      </div>
    </div>

    //  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-8">
    //     <div className="text-center mb-6 sm:mb-8">
    //       <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
    //         Set New Password
    //       </h2>
    //       <p className="text-slate-600 text-sm sm:text-base">
    //         Create a strong password for your Appointege account
    //       </p>
    //     </div>

    //     <form
    //       onSubmit={handleSubmit(onSubmit)}
    //       className="space-y-4 sm:space-y-6 mb-6"
    //       noValidate
    //     >
    //       <div className="space-y-2">
    //         <Label
    //           htmlFor="password"
    // className="text-slate-700 font-medium text-sm"
    //         >
    //           New Password
    //         </Label>
    //         <div className="relative">
    //           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
    //           <Input
    //             id="password"
    //             type={showPassword ? "text" : "password"}
    //             {...register("password")}
    //             className="pl-9 sm:pl-10 pr-10 sm:pr-12 h-10 sm:h-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm sm:text-base"
    //             placeholder="Enter new password"
    //             required
    //           />
    //           <button
    //             type="button"
    //             onClick={() => setShowPassword(!showPassword)}
    //             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
    //           >
    //             {showPassword ? (
    //               <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
    //             ) : (
    //               <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
    //             )}
    //           </button>
    //         </div>

    //         {passwordValue && (
    //           <div className="space-y-2">
    //             <div className="flex items-center justify-between">
    //               <span className="text-xs text-slate-600">
    //                 Password strength:
    //               </span>
    //               <span
    //                 className={`text-xs font-medium ${
    //                   passwordStrength.strength < 2
    //                     ? "text-red-600"
    //                     : passwordStrength.strength < 4
    //                       ? "text-yellow-600"
    //                       : "text-green-600"
    //                 }`}
    //               >
    //                 {passwordStrength.label}
    //               </span>
    //             </div>
    //             <div className="w-full bg-slate-200 rounded-full h-2">
    //               <div
    //                 className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
    //                 style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
    //               />
    //             </div>
    //             <div className="space-y-1">
    //               {Object.entries(passwordStrength.checks).map(
    //                 ([key, passed]) => (
    //                   <div
    //                     key={key}
    //                     className="flex items-center space-x-2 text-xs"
    //                   >
    //                     {passed ? (
    //                       <Check className="w-3 h-3 text-green-500" />
    //                     ) : (
    //                       <X className="w-3 h-3 text-slate-400" />
    //                     )}
    //                     <span
    //                       className={passed ? "text-green-600" : "text-slate-500"}
    //                     >
    //                       {key === "length" && "At least 8 characters"}
    //                       {key === "lowercase" && "One lowercase letter"}
    //                       {key === "uppercase" && "One uppercase letter"}
    //                       {key === "number" && "One number"}
    //                       {key === "special" && "One special character"}
    //                     </span>
    //                   </div>
    //                 )
    //               )}
    //             </div>
    //           </div>
    //         )}
    //       </div>

    //       <div className="space-y-2">
    //         <Label
    //           htmlFor="confirmPassword"
    //           className="text-slate-700 font-medium text-sm"
    //         >
    //           Confirm New Password
    //         </Label>
    //         <div className="relative">
    //           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
    //           <Input
    //             id="confirmPassword"
    //             type={showConfirmPassword ? "text" : "password"}
    //             {...register("confirmPassword")}
    //             className="pl-9 sm:pl-10 pr-10 sm:pr-12 h-10 sm:h-12 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm sm:text-base"
    //             placeholder="Confirm new password"
    //             required
    //           />
    //           <button
    //             type="button"
    //             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    //             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
    //           >
    //             {showConfirmPassword ? (
    //               <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
    //             ) : (
    //               <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
    //             )}
    //           </button>
    //         </div>
    //         {confirmPasswordValue && passwordValue !== confirmPasswordValue && (
    //           <p className="text-red-500 text-xs">Passwords do not match</p>
    //         )}
    //       </div>

    //       <Button
    //         type="submit"
    //         disabled={
    //           isLoading || !watch("password") || !watch("confirmPassword")
    //         }
    //         className="w-full h-10 sm:h-12 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 text-sm sm:text-base"
    //       >
    //         {isLoading ? "Updating Password..." : "Update Password"}
    //       </Button>
    //     </form>

    // <Link
    //   href="/sign-in"
    //   className="w-full flex items-center justify-center text-sm text-sky-600 hover:text-sky-700 font-medium py-2 transition-all duration-200 hover:underline transform hover:scale-[1.02]"
    // >
    //   <ArrowLeft className="w-4 h-4 mr-2" />
    //   Back to Login
    // </Link>
    //   </div>
  )
}
