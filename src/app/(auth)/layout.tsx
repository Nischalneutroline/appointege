import { Calendar, CircleCheckBig, Clock, Users } from 'lucide-react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className=" flex ">
        {/* Left Side - Branding (Hidden on mobile) */}
        <div
          className="hidden lg:flex w-3/5 lg:w-3/6 xl:w-3/5 flex-col items-start justify-center text-white p-8 lg:p-12 xl:p-16 2xl:p-20 3xl:p-24 4xl:p-28 5xl:p-32 relative overflow-y-auto scrollbar-thin gap-12 leading-16"
          style={{
            background: 'linear-gradient(to bottom right, #f4fafe, #e8eefd)',
          }}
        >
          {/* Content */}
          <div className="relative z-10 text-start flex flex-col gap-4 3xl:gap-3 5xl:gap-2 top-10">
            <div className="flex flex-col mb-4 gap-2 3xl:gap-4 4xl:gap-6">
              <div className="flex items-center justify-start h-10 gap-3">
                <div className="w-10 h-10 3xl:w-12 3xl:h-12 4xl:w-14 4xl:h-14 5xl:w-16 5xl:h-16 bg-[#0ba6e9] rounded-[12px] flex items-center justify-center  ">
                  <Calendar
                    className="text-[16px] 3xl:text-[24px] 4xl:text-[32px] 5xl:text-[52px]"
                    style={{
                      color: 'white',
                    }}
                  />
                </div>

                <h1 className="text-2xl 3xl:text-4xl 4xl:text-5xl 5xl:text-6xl text-slate-800 font-bold  ">
                  Appointege
                </h1>
              </div>
              <p className="text-slate-600 text-lg  3xl:text-xl 4xl:text-2xl 5xl:text-3xl  font-medium -tracking-[0.010rem]">
                Professional Appointment Management
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col">
                  <p className="text-start text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-slate-800 font-bold -tracking-[0.010rem] ">
                    Streamline Your
                  </p>
                  <p className="text-start text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl text-sky-500 font-bold -tracking-[0.010rem] ">
                    Appointment Workflow
                  </p>
                </div>
                <p className="text-slate-600 text-lg  3xl:text-xl 4xl:text-2xl 5xl:text-3xl font-medium -tracking-[0.010rem]">
                  Transform how you manage appointments with our intuitive
                  platform designed for modern professionals.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-3 text-slate-600 font-semibold pt-[1px]">
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 bg-[#e0f1fe] rounded-md 4xl:rounded-lg flex justify-center items-center">
                    <Clock
                      className="text-[16px] 3xl:text-[20px] 4xl:text-[28px] 5xl:text-[48px]"
                      style={{
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl   leading-4 font-semibold  -tracking-[0.01rem] ">
                    Smart scheduling automation
                  </span>
                </div>
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 bg-[#e0f1fe] rounded-md 4xl:rounded-lg flex justify-center items-center">
                    <Users
                      className="text-[16px] 3xl:text-[20px] 4xl:text-[28px] 5xl:text-[48px]"
                      style={{
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl leading-4 font-semibold  -tracking-[0.01rem] ">
                    Seamless client management
                  </span>
                </div>
                <div className="flex items-center text-blue-100 gap-3">
                  <div className="h-7 w-7 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 5xl:h-14 5xl:w-14 bg-[#e0f1fe] rounded-md 4xl:rounded-lg flex justify-center items-center">
                    <CircleCheckBig
                      className="text-[16px] 3xl:text-[20px] 4xl:text-[28px] 5xl:text-[48px]"
                      style={{
                        color: '#0185c8',
                      }}
                    />
                  </div>
                  <span className="text-[#485669] text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl  leading-4 font-semibold  -tracking-[0.01rem] ">
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
                <h1 className="flex justify-center text-xl 3xl:text-3xl font-extrabold text-black -tracking-[0.045rem] ">
                  Appointege
                </h1>
                <p className="text-gray-600 text-xs font-medium -tracking-[0.006rem]">
                  Streamline Your Workflow
                </p>
              </div>
            </div>
          </div>

          {/* Auth Form Container */}
          <div
            id="auth-container"
            className={`w-full max-w-sm 3xl:max-w-lg 4xl:max-w-xl 5xl:max-w-2xl mx-auto overflow-y-auto my-auto shadow-2xl rounded-2xl`}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
