"use client";

import React, { useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema, LoginSchemaType, SignupSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Social } from "./social";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { login } from "@/actions/login"
// import { register } from "@/actions/register"

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      password1: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignupSchema>) => {
    setSuccess("");
    setError("");
    startTransition(async () => {
      const { success, error } = await register(values);
      if (success) {
        setSuccess(success);
        form.reset();
      }
      if (error) setError(error);
      // register(values)
      //   .then(({ success, error }) => {
      //     if (success) setSuccess(success)
      //     if (error) setError(error)
      //   })
      //   .catch((error) => setError("Couldn't get action!"))
    });
  };

  const handleTermsChange = (checked: boolean) => {
    setAgreeToTerms(checked === true);
  };

  return (
    // <div className="bg-white rounded-2xl shadow-xl border border-slate-200 px-6 pb-8 space-y-6 max-h-[calc(100vh-17rem)] overflow-y-auto scrollbar-thin">
    //   <div className="sticky top-0 z-10 text-center flex flex-col gap-1 bg-white pt-6">
    //     <div className="text-2xl text-slate-800 font-extrabold -tracking-[0.011rem] ">
    //       Create Account
    //     </div>
    //     <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem] ">
    //       Join Appointege and start managing appointments
    //     </p>
    //   </div>

    //   <div className="flex flex-col gap-4">
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
    //         {/* Name */}
    //         <FormField
    //           control={form.control}
    //           name="name"
    //           render={({ field }) => (
    //             <FormItem className="space-y-[2px] pt-[5px]">
    //               <FormLabel className="text-slate-700 font-semibold text-sm leading-[17px] -tracking-[0.006rem]">
    //                 Full Name
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   {" "}
    //                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
    //                   <Input
    //                     {...field}
    //                     type="text"
    //                     placeholder="Full name"
    //                     disabled={isPending}
    //                     className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
    //                   />
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {/* Email */}
    //         <FormField
    //           control={form.control}
    //           name="email"
    //           render={({ field }) => (
    //             <FormItem className="space-y-[2px] pt-[5px]">
    //               <FormLabel className="text-slate-700 font-semibold text-sm leading-[17px] -tracking-[0.006rem]">
    //                 Email Address
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

    //                   <Input
    //                     {...field}
    //                     disabled={isPending}
    //                     type="email"
    //                     placeholder="Enter your email"
    //                     className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
    //                   />
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         {/* Phone Number */}
    //         <FormField
    //           control={form.control}
    //           name="phone"
    //           render={({ field }) => (
    //             <FormItem className="space-y-[2px] pt-[5px]">
    //               <FormLabel className="text-slate-700 font-semibold text-sm leading-[17px] -tracking-[0.006rem]">
    //                 Phone Number
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
    //                   <Input
    //                     {...field}
    //                     disabled={isPending}
    //                     type="tel"
    //                     placeholder="Enter your phone number"
    //                     className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
    //                   />
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         {/* Password */}
    //         <FormField
    //           control={form.control}
    //           name="password"
    //           render={({ field }) => (
    //             <FormItem className="space-y-[2px] pt-[5px]">
    //               <FormLabel className="text-slate-700 font-semibold text-sm leading-[17px] -tracking-[0.006rem]">
    //                 Password
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
    //                   <Input
    //                     {...field}
    //                     type={showPassword ? "text" : "password"}
    //                     placeholder="Create a password"
    //                     disabled={isPending}
    //                     className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() => setShowPassword(!showPassword)}
    //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
    //                   >
    //                     {showPassword ? (
    //                       <EyeOff className="w-4 h-4" />
    //                     ) : (
    //                       <Eye className="w-4 h-4" />
    //                     )}
    //                   </button>
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />
    //         {/* Confirm Password */}
    //         <FormField
    //           control={form.control}
    //           name="password1"
    //           render={({ field }) => (
    //             <FormItem className="space-y-[2px] pt-1">
    //               <FormLabel className="text-slate-700 font-medium text-sm leading-5">
    //                 Confirm Password
    //               </FormLabel>
    //               <FormControl>
    //                 <div className="relative">
    //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

    //                   <Input
    //                     {...field}
    //                     type={showPassword1 ? "text" : "password"}
    //                     placeholder="Confirm password"
    //                     disabled={isPending}
    //                     className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
    //                   />
    //                   <button
    //                     type="button"
    //                     onClick={() => setShowPassword1(!showPassword1)}
    //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
    //                   >
    //                     {showPassword1 ? (
    //                       <EyeOff className="w-4 h-4" />
    //                     ) : (
    //                       <Eye className="w-4 h-4" />
    //                     )}
    //                   </button>
    //                 </div>
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormError message={error} />
    //         <FormSuccess message={success} />
    //         <div className="flex w-full items-start">
    //           <Checkbox
    //             id="terms"
    //             checked={agreeToTerms}
    //             onCheckedChange={handleTermsChange}
    //             className="mt-0.5 h-4 w-4 flex-shrink-0 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
    //           />
    //           <Label
    //             htmlFor="terms"
    //             className="ml-2 text-sm text-black cursor-pointer font-medium  "
    //           >
    //             <span className="whitespace-nowrap">
    //               I agree to the{" "}
    //               <a
    //                 href="#"
    //                 className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
    //               >
    //                 Terms of Service
    //               </a>{" "}
    //               and{" "}
    //               <a
    //                 href="#"
    //                 className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
    //               >
    //                 Privacy Policy
    //               </a>
    //             </span>
    //           </Label>
    //         </div>
    //         {/* <div className="flex w-full items-start">
    //           <Checkbox
    //             id="terms"
    //             checked={agreeToTerms}
    //             onCheckedChange={handleTermsChange}
    //             className="mt-0.5 h-4 w-4 flex-shrink-0 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
    //           />
    //           <Label
    //             htmlFor="terms"
    //             className="ml-2 text-sm text-black cursor-pointer font-medium  "
    //           >
    //             I agree to the{" "}
    //             <a
    //               href="#"
    //               className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
    //             >
    //               Terms of Service
    //             </a>{" "}
    //             and{" "}
    //             <a
    //               href="#"
    //               className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
    //             >
    //               Privacy Policy
    //             </a>
    //           </Label>
    //         </div> */}

    //         <Button
    //           type="submit"
    //           disabled={isPending || !agreeToTerms}
    //           className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 text-sm"
    //         >
    //           {isPending
    //             ? "Creating Account..."
    //             : "Create Account & Start Managing"}
    //         </Button>
    //       </form>
    //     </Form>

    //     <Social />
    //   </div>

    //   <div className="mt-6 text-center">
    //     <p className="text-black text-sm font-normal">
    //       Already have an account?{" "}
    //       <Link
    //         href={"/login"}
    //         className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
    //       >
    //         Sign in
    //       </Link>
    //     </p>
    //   </div>
    // </div>
    <div className=" bg-white rounded-2xl border border-slate-200 p-6 space-y-6  ">
      <div className="text-center flex flex-col gap-1">
        <div className="text-2xl text-slate-800 font-extrabold -tracking-[0.020rem] ">
          Create Account
        </div>
        <p className="text-slate-600 text-sm font-medium  -tracking-[0.011rem] ">
          Join Appointege and start managing appointments
        </p>
      </div>

      <div className="flex flex-col gap-4 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {" "}
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        type="text"
                        placeholder="Full name"
                        disabled={isPending}
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone Number */}
            {/* <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        disabled={isPending}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
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
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="password1"
              render={({ field }) => (
                <FormItem className="space-y-[2px] pt-[5px]">
                  <FormLabel className="text-slate-700 font-semibold  text-sm leading-[17px] w-fit -tracking-[0.006rem]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />

                      <Input
                        {...field}
                        type={showPassword1 ? "text" : "password"}
                        placeholder="Confirm password"
                        disabled={isPending}
                        className="pl-9 h-11 border-slate-300 focus:border-sky-500 focus:ring-sky-500 rounded-xl text-sm font-medium placeholder:-tracking-[0.011rem] "
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormError message={error} />
            <FormSuccess message={success} />
            <div className="flex w-full items-start py-1">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={handleTermsChange}
                className="mt-[4px] h-4 w-4 flex-shrink-0 border-slate-300 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500"
              />
              <Label htmlFor="terms" className="ml-2  text-sm text-slate-600">
                <span className="whitespace-nowrap">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Privacy <br /> Policy
                  </a>
                </span>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isPending || !agreeToTerms}
              className="cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 text-sm leading-5 -tracking-[0.011rem]"
            >
              {isPending
                ? "Creating Account..."
                : "Create Account & Start Managing"}
            </Button>
          </form>
        </Form>

        <Social type="up" />
      </div>

      <div className="mt-6 text-center">
        <p className="text-back text-sm font-normal">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-sm text-sky-600 hover:text-sky-700 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
