import React from 'react'
import { Mail, Shield } from 'lucide-react'

interface PasswordResetEmailProps {
  userName: string
}

const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  userName,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-100 px-6 sm:px-8 py-5 border-b border-slate-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                Appointege
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 sm:p-12 space-y-8">
          {/* Greeting */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
              Hello, {userName}!
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-sky-600 mx-auto rounded"></div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-5 text-center">
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              We’ve received a request to reset your Appointege account
              password.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Click the button below to set a new password and secure your
              account.
            </p>
          </div>

          {/* Security Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-sky-500" />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
              Reset Your Password
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
              Create a new password to regain access to your Appointege account
              and continue managing your appointments seamlessly.
            </p>
          </div>

          {/* Reset Button */}
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Reset Password
            </a>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Important:</strong> If you didn’t request a password
              reset, please ignore this email. Your account remains secure.
            </p>
          </div>

          {/* Expiry Notice */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              This link will expire in 1 hours for your security.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-200 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-500">
              Need assistance? Contact our support team at{' '}
              <a
                href="mailto:support@appointege.com"
                className="text-sky-500 hover:underline"
              >
                support@appointege.com
              </a>
            </p>
            <p className="text-xs text-slate-400">
              © 2025 Appointege. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              123 Business Street, Suite 100, City, State 12345
            </p>
          </div>
        </div>

        {/* Email Client Styles */}
        <style>{`
          @media only screen and (max-width: 768px) {
            .max-w-2xl {
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .p-8 {
              padding: 1.5rem !important;
            }
            .sm\\:p-12 {
              padding: 1.5rem !important;
            }
            .text-2xl {
              font-size: 1.5rem !important;
            }
            .sm\\:text-3xl {
              font-size: 1.75rem !important;
            }
            .text-lg {
              font-size: 1.125rem !important;
            }
            .sm\\:text-xl {
              font-size: 1.25rem !important;
            }
            .text-base {
              font-size: 0.875rem !important;
            }
            .sm\\:text-lg {
              font-size: 1rem !important;
            }
          }

          @media only screen and (min-width: 769px) {
            .max-w-2xl {
              max-width: 42rem !important;
            }
            .p-8 {
              padding: 2rem !important;
            }
            .sm\\:p-12 {
              padding: 3rem !important;
            }
          }

          /* Accessibility improvements */
          a:focus {
            outline: 2px solid #38BDF8;
            outline-offset: 2px;
          }

          /* Email client compatibility */
          .bg-gradient-to-r {
            background: #38BDF8 !important; /* Fallback for email clients */
          }

          /* Ensure button text alignment */
          .inline-flex {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </div>
    </div>
  )
}

export default PasswordResetEmail

// import React from 'react'
// import { Mail, CheckCircle } from 'lucide-react'

// interface WelcomeConfirmEmailProps {
//   userName: string
// }

// const WelcomeConfirmEmail: React.FC<WelcomeConfirmEmailProps> = ({
//   userName,
// }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
//       <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//         {/* Header */}
//         <div className="bg-slate-100 px-6 sm:px-8 py-5 border-b border-slate-200">
//           <div className="flex items-center justify-center">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
//                 <Mail className="w-7 h-7 text-white" />
//               </div>
//               <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
//                 Appointege
//               </h1>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="p-8 sm:p-12 space-y-8">
//           {/* Greeting */}
//           <div className="text-center">
//             <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
//               Welcome, {userName}!
//             </h2>
//             <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-sky-600 mx-auto rounded"></div>
//           </div>

//           {/* Welcome Message */}
//           <div className="space-y-5 text-center">
//             <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
//               Thank you for joining Appointege! We're excited to help you
//               streamline your appointment management.
//             </p>
//             <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
//               Please confirm your email address to activate your account and
//               unlock all features.
//             </p>
//           </div>

//           {/* Confirmation Icon */}
//           <div className="flex justify-center">
//             <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center">
//               <CheckCircle className="w-8 h-8 text-sky-500" />
//             </div>
//           </div>

//           {/* Main Message */}
//           <div className="text-center space-y-4">
//             <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
//               Verify Your Email Address
//             </h3>
//             <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
//               Click the button below to confirm your email and start using
//               Appointege to manage your appointments effortlessly.
//             </p>
//           </div>

//           {/* Confirm Button */}
//           <div className="text-center">
//             <a
//               href="#"
//               className="inline-flex items-center justify-center h-14 px-10 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
//             >
//               Confirm My Email
//             </a>
//           </div>

//           {/* Security Notice */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
//             <p className="text-sm text-slate-700 leading-relaxed">
//               <strong>Important:</strong> If you didn’t create an Appointege
//               account, please ignore this email. No action is required.
//             </p>
//           </div>

//           {/* Expiry Notice */}
//           <div className="text-center">
//             <p className="text-xs sm:text-sm text-slate-500">
//               This link will expire in 24 hours for your security.
//             </p>
//           </div>

//           {/* Footer */}
//           <div className="pt-8 border-t border-slate-200 text-center space-y-3">
//             <p className="text-xs sm:text-sm text-slate-500">
//               Need assistance? Reach out to our support team at{' '}
//               <a
//                 href="mailto:support@appointege.com"
//                 className="text-sky-500 hover:underline"
//               >
//                 support@appointege.com
//               </a>
//             </p>
//             <p className="text-xs text-slate-400">
//               © 2025 Appointege. All rights reserved.
//             </p>
//             <p className="text-xs text-slate-400">
//               123 Business Street, Suite 100, City, State 12345
//             </p>
//           </div>
//         </div>

//         {/* Email Client Styles */}
//         <style>{`
//           @media only screen and (max-width: 768px) {
//             .max-w-2xl {
//               margin: 0 !important;
//               width: 100% !normal;
//               max-width: 100% !important;
//             }
//             .p-8 {
//               padding: 1.5rem !important;
//             }
//             .sm\\:p-12 {
//               padding: 1.5rem !important;
//             }
//             .text-2xl {
//               font-size: 1.5rem !important;
//             }
//             .sm\\:text-3xl {
//               font-size: 1.75rem !important;
//             }
//             .text-lg {
//               font-size: 1.125rem !important;
//             }
//             .sm\\:text-xl {
//               font-size: 1.25rem !important;
//             }
//             .text-base {
//               font-size: 0.875rem !important;
//             }
//             .sm\\:text-lg {
//               font-size: 1rem !important;
//             }
//           }

//           @media only screen and (min-width: 769px) {
//             .max-w-2xl {
//               max-width: 42rem !important;
//             }
//             .p-8 {
//               padding: 2rem !important;
//             }
//             .sm\\:p-12 {
//               padding: 3rem !important;
//             }
//           }

//           /* Accessibility improvements */
//           a:focus {
//             outline: 2px solid #38BDF8;
//             outline-offset: 2px;
//           }

//           /* Email client compatibility */
//           .bg-gradient-to-r {
//             background: #38BDF8 !important; /* Fallback for email clients */
//           }

//           /* Ensure button text alignment */
//           .inline-flex {
//             display: inline-flex;
//             align-items: center;
//             justify-content: center;
//             text-align: center;
//           }
//         `}</style>
//       </div>
//     </div>
//   )
// }

// export default WelcomeConfirmEmail
