import { Calendar, CircleCheckBig, Clock, Users } from 'lucide-react'
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className=" flex">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div
          className="hidden lg:flex w-3/5 lg:w-3/6 xl:w-3/5  flex-col items-start justify-center text-white p-8 xl:p-12 relative overflow-y-auto scrollbar-thin xl:gap-4 gap-2 leading-16  "
          style={{
            background: 'linear-gradient(to bottom right, #f4fafe, #e8eefd)',
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-start flex flex-col gap-4 ">
            <div className="flex flex-col mb-4 gap-2 ">
              <div className="flex items-center justify-start h-10 gap-3">
                <div className="w-10 h-10 bg-[#0ba6e9] rounded-[12px] flex items-center justify-center  ">
                  <Calendar
                    style={{
                      height: '24px',
                      width: '24px',
                      color: 'white',
                    }}
                  />
                </div>

                <h1 className="text-3xl lg:text-2xl text-slate-800 font-bold ">
                  Appointege
                </h1>
              </div>
              <p className="text-slate-600 text-lg font-medium -tracking-[0.015rem]  ">
                Professional Appointment Management
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-6 mb-4  ">
                <div className="flex flex-col">
                  <p className="text-start text-3xl xl:text-4xl text-slate-800 font-bold xl:leading-[40px] leading-[37px]">
                    Streamline Your
                  </p>
                  <p className="text-start text-3xl xl:text-4xl text-sky-500 font-bold leading-[40px] ">
                    Appointment Workflow
                  </p>
                </div>
                <div className="text-lg text-slate-600 -tracking-[0.012rem] font-medium leading-[28px]">
                  Transform how you manage appointments with our intuitive
                  platform designed for modern professionals.
                </div>
              </div>

              {/* Feature highlights */}
              <div className="space-y-3 text-slate-600 font-semibold pt-[1px]">
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
                    <Clock
                      style={{
                        height: '16px',
                        width: '16px',
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
                    Smart scheduling automation
                  </span>
                </div>
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
                    <Users
                      style={{
                        height: '16px',
                        width: '16px',
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
                    Seamless client management
                  </span>
                </div>
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 bg-[#e0f1fe] rounded-md flex justify-center items-center">
                    <CircleCheckBig
                      style={{
                        height: '16px',
                        width: '16px',
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm leading-4 font-semibold -tracking-[0.01rem] ">
                    Real-time availability sync
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 w-[320px] opacity-30">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className={`aspect-square rounded  ${
                  i % 7 === 0 || i % 7 === 6
                    ? 'bg-slate-200 h-10.5 w-10.5'
                    : Math.random() > 0.7
                    ? 'bg-sky-300/60 h-10.5 w-10.5'
                    : 'bg-slate-100/60 h-10.5 w-10.5 '
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className=" w-full lg:w-3/6 xl:w-2/5 flex flex-col items-center bg-[#f4f8fe] min-h-screen">
          {/* Mobile Logo */}
          <div className="lg:hidden w-full mb-8 shadow-xs bg-[#fefeff]">
            <div className="flex items-center justify-center py-3 space-x-2">
              <div className="w-8 h-8 bg-[#0ba6e9] rounded-md  flex items-center text-white justify-center ">
                <Calendar style={{ height: '20px', width: '20px' }} />
              </div>
              <div className="flex flex-col  ">
                <h1 className="flex justify-center text-xl font-extrabold text-black -tracking-[0.045rem] ">
                  Appointege
                </h1>
                <p className="text-gray-600 text-xs font-medium -tracking-[0.006rem]">
                  Streamline Your Workflow
                </p>
              </div>
            </div>
          </div>

          {/* Auth Form Container */}
          <div className="w-full max-w-sm  mx-auto my-auto overflow-y-auto rounded-2xl shadow-xl/10  ">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
