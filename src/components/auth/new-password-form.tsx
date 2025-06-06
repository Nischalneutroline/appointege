"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema, NewPasswordSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { changePassword } from "@/actions/new-password";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";

export default function NewPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  // Create form
  const form = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      password1: "",
    },
  });

  // handle submit
  const onSubmit = (values: NewPasswordSchemaType) => {
    setError("");
    setSuccess("");
    if (!token) {
      setError("Token is missing!");
      return;
    }
    startTransition(async () => {
      const result = await changePassword(values, token);
      // Fallback in case `result` is undefined or invalid
      if (!result) {
        setError("Unexpected error, please try again!");
        return;
      }

      const { error, success } = result; // Safely destructure
      console.log(error, success);

      if (error) {
        setError(error);
      }
      if (success) {
        setSuccess(success);
      }
      // console.error("Error while login form:", err)
      // setError("Something went wrong, please try again, or reload! 😉")
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 ">
      <div className="text-center flex flex-col gap-2">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-[3px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.0065rem]">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        disabled={isPending}
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
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="password1"
              render={({ field }) => (
                <FormItem className="space-y-[3px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.0065rem]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        disabled={isPending}
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            {/* <Button disabled={isPending} type="submit">
            Rest Password
          </Button> */}
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              {isPending ? "Updating Password..." : "Update Password"}
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
  );
}
