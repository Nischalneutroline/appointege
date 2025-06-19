import React from 'react'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import { AuthInitializer } from '@/store/authInitializer'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <AuthInitializer>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col lg:flex-row">
        {/* Mobile Header - Compact and aligned */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-800">Appointege</h1>
              <p className="text-xs text-slate-600">Streamline Your Workflow</p>
            </div>
          </div>
        </div>

        {/* Left Side - Brand & Value Proposition (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-white relative overflow-hidden p-8 lg:p-12 xl:p-16 2xl:p-20 3xl:p-24 4xl:p-28 5xl:p-32 ">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-600/10" />

          <div className="relative z-10 flex flex-col justify-center px-8 xl:px-12 py-8 ">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 3xl:w-12 3xl:h-12 4xl:w-14 4xl:h-14 5xl:w-16 5xl:h-16 bg-sky-500 rounded-xl 3xl:rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 2xl:w-7 2xl:h-7 4x:w-9 4xl:h-9 text-white " />
                </div>
                <h1 className="text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-slate-800 font-bold">
                  Appointege
                </h1>
              </div>
              <p className="text-slate-600 mt-2  text-lg  3xl:text-xl 4xl:text-2xl 5xl:text-3xl  font-medium -tracking-[0.010rem]">
                Professional Appointment Management
              </p>
            </div>

            {/* Value Proposition */}
            <div className="space-y-6 2xl:space-x-8 mb-8 ">
              <h2 className="text-start text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-slate-800 font-bold -tracking-[0.010rem] 3xl:leading-tight">
                Streamline Your
                <span className="text-sky-500 block">Appointment Workflow</span>
              </h2>

              <p className="text-lg   3xl:text-xl 4xl:text-2xl  font-medium 2xl:-tracking-[0.010rem] text-slate-600 leading-relaxed">
                Transform how you manage appointments with our intuitive
                platform designed for modern professionals.
              </p>

              <div className="space-y-3">
                {[
                  { icon: Clock, text: 'Smart scheduling automation' },
                  { icon: Users, text: 'Seamless client management' },
                  { icon: CheckCircle, text: 'Real-time availability sync' },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-7 h-7  3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 bg-sky-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-4 h-4 3xl:w-5 3xl:h-5 4xl:w-6 4xl:h-6 text-sky-600 " />
                    </div>
                    <span className="text-slate-700 font-medium text-sm ext-sm 3xl:text-base 4xl:text-lg 5xl:text-xl   leading-4  -tracking-[0.01rem]">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Calendar Illustration */}
            <div className="grid grid-cols-7 gap-1 max-w-xs opacity-20">
              {Array.from({ length: 28 }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded ${
                    i % 7 === 0 || i % 7 === 6
                      ? 'bg-slate-200'
                      : Math.random() > 0.7
                        ? 'bg-sky-300'
                        : 'bg-slate-100'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center px-4 py-4 lg:py-8 2xl:py-20 3xl:py-24 4xl:py-28 5xl:py-32 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="w-full max-w-sm 3xl:max-w-lg 4xl:max-w-xl 5xl:max-w-2xl mx-auto overflow-y-auto my-auto shadow-2xl rounded-2xl">
            {children}
          </div>
        </div>
      </div>
    </AuthInitializer>
  )
}

export default AuthLayout

// import { Calendar, CircleCheckBig, Clock, Users } from 'lucide-react'

// export default function AuthLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <>
//       <div className=" flex">
//         {/* Left Side - Branding (Hidden on mobile) */}
//         <div
//           className="hidden lg:flex w-3/5 lg:w-3/6 xl:w-3/5  flex-col items-start justify-center text-white p-8 xl:p-12 relative overflow-y-auto scrollbar-thin xl:gap-4 gap-2 leading-16  "
//           style={{
//             background: 'linear-gradient(to bottom right, #f4fafe, #e8eefd)',
//           }}
//         >
//           {/* Content */}
//           <div className="relative z-10 text-start flex flex-col gap-4 ">
//             <div className="flex flex-col mb-4 gap-2 ">
//               <div className="flex items-center justify-start h-10 gap-3">
//                 <div className="w-10 h-10 bg-[#0ba6e9] rounded-[12px] flex items-center justify-center  ">
//                   <Calendar
//                     style={{
//                       height: '24px',
//                       width: '24px',
//                       color: 'white',
//                     }}
//                   />
//                 </div>

//                 <h1 className="text-3xl lg:text-2xl text-slate-800 font-bold ">
//                   Appointege
//                 </h1>
//               </div>
//               <p className="text-slate-600 text-lg font-medium -tracking-[0.015rem]  ">
//                 Professional Appointment Management
//               </p>
//             </div>

//             <div className="flex flex-col gap-2">
//               <div className="flex flex-col gap-6 mb-4  ">
//                 <div className="flex flex-col">
//                   <p className="text-start text-3xl xl:text-4xl text-slate-800 font-bold xl:leading-[40px] leading-[37px]">
//                     Streamline Your
//                   </p>
//                   <p className="text-start text-3xl xl:text-4xl text-sky-500 font-bold leading-[40px] ">
//                     Appointment Workflow
//                   </p>
//                 </div>
//                 <div className="text-lg text-slate-600 -tracking-[0.012rem] font-medium leading-[28px]">
//                   Transform how you manage appointments with our intuitive
//                   platform designed for modern professionals.
//                 </div>
//               </div>

//               {/* Feature highlights */}
//               <div className="space-y-3 text-slate-600 font-semibold pt-[1px]">
//                 <div className="flex items-center text-blue-100 gap-3">
//                   <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
//                     <Clock
//                       style={{
//                         height: '16px',
//                         width: '16px',
//                         color: '#0185c8',
//                       }}
//                     />
//                   </div>
//                   <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
//                     Smart scheduling automation
//                   </span>
//                 </div>
//                 <div className="flex items-center text-blue-100 gap-3">
//                   <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
//                     <Users
//                       style={{
//                         height: '16px',
//                         width: '16px',
//                         color: '#0185c8',
//                       }}
//                     />
//                   </div>
//                   <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
//                     Seamless client management
//                   </span>
//                 </div>
//                 <div className="flex items-center text-blue-100 gap-3">
//                   <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
//                     <CircleCheckBig
//                       style={{
//                         height: '16px',
//                         width: '16px',
//                         color: '#0185c8',
//                       }}
//                     />
//                   </div>
//                   <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
//                     Real-time availability sync
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Decorative Calendar Grid */}
//           <div className="grid grid-cols-7 gap-1 w-[320px] opacity-30">
//             {Array.from({ length: 28 }, (_, i) => (
//               <div
//                 key={i}
//                 className={`aspect-square rounded  ${
//                   i % 7 === 0 || i % 7 === 6
//                     ? 'bg-slate-200 h-10.5 w-10.5'
//                     : Math.random() > 0.7
//                     ? 'bg-sky-300/60 h-10.5 w-10.5'
//                     : 'bg-slate-100/60 h-10.5 w-10.5 '
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Right Side - Auth Forms */}
//         <div className=" w-full lg:w-3/6 xl:w-2/5 flex flex-col items-center bg-[#f4f8fe] min-h-screen">
//           {/* Mobile Logo */}
//           <div className="lg:hidden w-full mb-8 shadow-xs bg-[#fefeff]">
//             <div className="flex items-center justify-center py-3 space-x-2">
//               <div className="w-8 h-8 bg-[#0ba6e9] rounded-md  flex items-center text-white justify-center ">
//                 <Calendar style={{ height: '20px', width: '20px' }} />
//               </div>
//               <div className="flex flex-col  ">
//                 <h1 className="flex justify-center text-xl font-extrabold text-black -tracking-[0.045rem] ">
//                   Appointege
//                 </h1>
//                 <p className="text-gray-600 text-xs font-medium -tracking-[0.006rem]">
//                   Streamline Your Workflow
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Auth Form Container */}
//           <div
//             id="auth-container"
//             className={`w-full max-w-sm mx-auto overflow-y-auto my-auto shadow-2xl rounded-2xl`}
//           >
//             {children}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }
