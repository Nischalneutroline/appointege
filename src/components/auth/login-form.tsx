"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
// import { login } from "@/actions/login"
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGGEDIN_USER_REDIRECT } from "@/routes";
import { Social } from "./social";
import { Checkbox } from "../ui/checkbox";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with credential provider!"
      : "";

  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: any) => {
    setSuccess("");
    setError("");
    startTransition(async () => {
      const { success, error } = await login(values);
      if (success) setSuccess(success);
      if (error) setError(error);
      // if (twoFactor) setShowTwoFactor(true)
      //   login(values)
      //     .then(({ success, error }) => {
      //       if (success) setSuccess(success)
      //       if (error) setError(error)
      //     })
      //     .catch((error) => setError("Couldn't get action!"))
    });
  };
  // const onSubmit = (values: z.infer<typeof LoginSchema>) => {
  //   setSuccess("")
  //   setError("")
  //   startTransition(async () => {
  //     const { success, error, twoFactor } = await login(values, callbackUrl)
  //     if (success) setSuccess(success)
  //     if (error) setError(error)
  //     if (twoFactor) setShowTwoFactor(true)
  //     //   login(values)
  //     //     .then(({ success, error }) => {
  //     //       if (success) setSuccess(success)
  //     //       if (error) setError(error)
  //     //     })
  //     //     .catch((error) => setError("Couldn't get action!"))
  //   })
  // }

  const handleSocialLogin = (provider: "google" | "github") => {
    signIn(provider, {
      redirectTo: DEFAULT_LOGGEDIN_USER_REDIRECT,
    });
  };

  const handleRememberMeChange = (checked: boolean) => {
    console.log("Remember me checked:", checked);
    setRememberMe(checked);
  };

  return (
    <div className=" bg-white rounded-2xl border border-slate-200 p-6 space-y-6 ">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="Enter your email"
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
                        // className=""
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-[2px]  pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
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
                  <FormMessage />
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
                href={"/reset-password"}
              >
                Forgot password?
              </Link>
            </div>

            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <Social type="in" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-black text-sm font-normal">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// "use client"

// import React, { startTransition, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Eye, EyeOff, Mail, Lock } from "lucide-react"
// import { Controller, useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { LogInSchema, LoginType } from "../_schemas/sign-in-schema"
// import { FcGoogle } from "react-icons/fc"
// import { useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { login } from "@/actions/login"

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const searchParams = useSearchParams()
//   const urlError =
//     searchParams.get("error") === "OAuthAccountNotLinked"
//       ? "Email already in use with credential provider!"
//       : ""

//   const callbackUrl = searchParams.get("callbackUrl")

//   // react hook form
//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginType>({
//     resolver: zodResolver(LogInSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       rememberMe: false,
//     },
//   })

//   const onSubmit = async (data: LoginType) => {
//     console.log("Login attempted:", data)

//     setIsLoading(true)
//     // Simulate API call
//     startTransition(async () => {
//       const { success, error } = await login(values)
//       if (success) setSucces(success)
//       if (error) setError(error)
//     })
//   }

//   const handleSocialLogin = (provider: string) => {
//     console.log(`${provider} login clicked`)
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-slate-800 mb-1">Welcome Back</h2>
//         <p className="text-slate-600 text-sm">
//           Sign in to your Appointege account
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
//         <div className="space-y-2">
//           <Label htmlFor="email" className="text-slate-700 font-medium text-sm">
//             Email Address
//           </Label>
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//             <Input
//               id="email"
//               type="email"
//               {...register("email")}
//               className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm"
//               placeholder="Enter your email"
//               required
//             />
//           </div>
//           {errors.email && (
//             <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <Label
//             htmlFor="password"
//             className="text-slate-700 font-medium text-sm"
//           >
//             Password
//           </Label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//             <Input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               {...register("password")}
//               className="pl-9 pr-10 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm"
//               placeholder="Enter your password"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//             >
//               {showPassword ? (
//                 <EyeOff className="w-4 h-4" />
//               ) : (
//                 <Eye className="w-4 h-4" />
//               )}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="text-red-500 text-xs mt-1">
//               {errors.password.message}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Controller
//               name="rememberMe"
//               control={control}
//               render={({ field }) => (
//                 <Checkbox
//                   id="remember"
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                   className="border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
//                 />
//               )}
//             />
//             <Label htmlFor="remember" className="text-sm text-slate-600">
//               Remember me
//             </Label>
//           </div>
//           <Link
//             href="/reset-password"
//             className="text-sm text-sky-600 hover:text-sky-700 font-medium transition-colors"
//           >
//             Forgot password?
//           </Link>
//         </div>

//         <Button
//           type="submit"
//           disabled={isLoading}
//           className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm"
//         >
//           {isLoading ? "Signing in..." : "Sign In"}
//         </Button>
//       </form>

// <div className="my-4">
//   <div className="relative">
//     <div className="absolute inset-0 flex items-center">
//       <div className="w-full border-t border-slate-300" />
//     </div>
//     <div className="relative flex justify-center text-sm">
//       <span className="px-4 bg-white text-slate-500">
//         Or continue with
//       </span>
//     </div>
//   </div>
// </div>

// <Button
//   type="button"
//   variant="outline"
//   onClick={() => handleSocialLogin("Google")}
//   className="w-full h-11 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-200 hover:scale-[1.02]  flex items-center justify-center gap-2"
// >
//   <FcGoogle />
//   Continue with Google
// </Button>

// <div className="mt-6 text-center">
//   <p className="text-slate-600 text-sm">
//     Don't have an account?{" "}
//     <Link
//       href="/sign-up"
//       className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
//     >
//       Sign up
//     </Link>
//   </p>
// </div>
//     </div>
//   )
// }

// export default LoginForm
