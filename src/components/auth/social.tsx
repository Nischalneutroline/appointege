// "use client";

// import { FcGoogle } from "react-icons/fc";
// import { signIn } from "next-auth/react";
// import { Button } from "@/components/ui/button";
// // import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
// import { useSearchParams } from "next/navigation";
// import { DEFAULT_LOGGEDIN_USER_REDIRECT } from "@/routes";

// interface SocialProps {
//   type: string;
// }

// export function Social({ type }: SocialProps) {
//   // const searchParams = useSearchParams()
//   // const callbackUrl = searchParams.get("callbackUrl")
//   const onClick = (provider: "google" | "github") => {
//     signIn(provider, {
//       redirectTo: DEFAULT_LOGGEDIN_USER_REDIRECT,
//     });
//   };
//   return (
//     <>
//       {/* Line */}
//       <div className="">
//         <div className="relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-slate-300" />
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-white text-slate-500 font-medium -tracking-[0.006rem]">
//               Or continue with
//             </span>
//           </div>
//         </div>
//       </div>
//       {/* Google Button */}
//       <Button
//         type="button"
//         variant="outline"
//         onClick={() => onClick("google")}
//         className="cursor-pointer w-full h-11 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-200 hover:scale-[1.02] text-sm font-semibold -tracking-[0.006rem]"
//       >
//         <FcGoogle
//           style={{
//             marginRight: "8px",
//             height: "18px",
//             width: "18px",
//           }}
//         />
//         {` Sign ${type} with Google`}
//       </Button>
//     </>
//   );
// }

//-----  New page redirect
'use client'

import { FcGoogle } from 'react-icons/fc'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { DEFAULT_LOGGEDIN_USER_REDIRECT } from '@/routes'

interface SocialProps {
  type: string
}

export function Social({ type }: SocialProps) {
  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGGEDIN_USER_REDIRECT,
      redirect: false, // Prevent default redirect behavior
    }).then((response) => {
      if (response?.url) {
        // Open Google OAuth in a popup
        window.open(
          response.url,
          'googleAuth',
          'width=600,height=600,menubar=no,toolbar=no,location=no',
        )
      }
    })
  }

  return (
    <>
      {/* Line */}
      <div className="">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl">
            <span className="px-4 bg-white text-slate-500 font-medium -tracking-[0.006rem]">
              Or continue with
            </span>
          </div>
        </div>
      </div>
      {/* Google Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => onClick('google')}
        className="cursor-pointer w-full h-11 3xl:h-12 4xl:h-14 5xl:h-16 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg  text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl font-bold -tracking-[0.006rem] "
      >
        {/* cursor-pointer w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg disabled:scale-100 text-sm leading-5 -tracking-[0.011rem] transition-all duration-300 transform hover:scale-105 hover:shadow-lg */}
        <FcGoogle
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 3xl:w-7 4xl:w-8"
          style={{
            marginRight: '8px',
          }}
        />
        {` Sign ${type} with Google`}
      </Button>
    </>
  )
}
