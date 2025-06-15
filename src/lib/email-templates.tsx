// export function getPasswordResetEmail(
//   userName: string,
//   resetLink: string,
// ): string {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//     <title>Password Reset</title>
//   </head>
//   <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
//     <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

//       <!-- Header -->
//       <div style="padding:24px 32px; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center;">
//         <div style="display:flex; align-items:center; gap:12px;">
//           <div style="width:40px; height:40px; background-color:#4F7CFF; border-radius:12px; display:flex; align-items:center; justify-content:center;">
//             <svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; color:#ffffff;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
//             </svg>
//           </div>
//           <h1 style="font-size:24px; font-weight:bold; color:#1f2937;">Appointege</h1>
//         </div>
//       </div>

//       <!-- Content -->
//       <div style="padding:32px;">
//         <h2 style="font-size:22px; color:#1f2937; margin-bottom:24px;">Hello ${userName},</h2>
//         <p style="font-size:16px; color:#374151; line-height:1.5; margin-bottom:16px;">
//           Welcome to Appointege! We're excited to have you on board and help you manage your appointments seamlessly.
//         </p>
//         <p style="font-size:16px; color:#6b7280; line-height:1.5; margin-bottom:32px;">
//           To get started and secure your account, we need you to set up your password.
//         </p>

//         <!-- Icon -->
//         <div style="text-align:center; margin-bottom:32px;">
//           <div style="width:64px; height:64px; background-color:#ebf4ff; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
//             <svg xmlns="http://www.w3.org/2000/svg" style="width:32px; height:32px; color:#4F7CFF;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2m-6 0v2m0 0H9m3 0h3m-6 0V9a5 5 0 0110 0v2a5 5 0 01-10 0v2z" />
//             </svg>
//           </div>
//         </div>

//         <div style="text-align:center; margin-bottom:24px;">
//           <h3 style="font-size:20px; color:#1f2937; margin-bottom:16px;">Password Reset Request</h3>
//           <p style="font-size:16px; color:#6b7280; margin-bottom:24px;">
//             We received a request to reset your password for your Appointege account.
//             Click the button below to create a new password.
//           </p>
//         </div>

//         <!-- Button -->
//         <div style="text-align:center; margin-bottom:32px;">
//           <a href="${resetLink}" style="display:inline-block; background-color:#4F7CFF; color:#ffffff; padding:16px 32px; font-weight:600; border-radius:12px; text-decoration:none;">
//             Reset Password
//           </a>
//         </div>

//         <!-- Security Info -->
//         <div style="background-color:#fef9c3; border:1px solid #fde68a; border-radius:12px; padding:16px; margin-bottom:24px;">
//           <p style="font-size:14px; color:#374151;">
//             <strong>Important:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
//           </p>
//         </div>

//         <!-- Expiry -->
//         <div style="text-align:center;">
//           <p style="font-size:14px; color:#9ca3af;">
//             This link will expire in 24 hours for your security.
//           </p>
//         </div>
//       </div>

//       <!-- Footer -->
//       <div style="background-color:#f9fafb; padding:24px 32px; text-align:center; border-top:1px solid #e5e7eb;">
//         <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
//           Need help? Contact our support team at <span style="color:#4F7CFF;">support@appointege.com</span>
//         </p>
//         <p style="font-size:12px; color:#9ca3af; margin-bottom:4px;">© 2025 Appointege. All rights reserved.</p>
//         <p style="font-size:12px; color:#9ca3af;">123 Business Street, Suite 100, City, State 12345</p>
//       </div>
//     </div>
//   </body>
//   </html>
//   `
// }
// interface EmailTemplateParams {
//   userName: string
//   link: string
//   supportEmail: string
// }

// // Welcome/Confirm Email Template
// export function getWelcomeEmailTemplate({
//   userName,
//   link,
//   supportEmail,
// }: EmailTemplateParams): string {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//       <title>Welcome to Appointege</title>
//     </head>
//     <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
//       <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

//         <!-- Header -->
//         <div style="padding:24px 32px; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center;">
//           <div style="display:flex; align-items:center; gap:12px;">
//             <div style="width:40px; height:40px; background-color:#38BDF8; border-radius:12px; display:flex; align-items:center; justify-content:center;">
//               <svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; color:#ffffff;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
//               </svg>
//             </div>
//             <h1 style="font-size:24px; font-weight:bold; color:#1f2937;">Appointege</h1>
//           </div>
//         </div>

//         <!-- Content -->
//         <div style="padding:32px;">
//           <h2 style="font-size:22px; color:#1f2937; margin-bottom:24px;">Hello ${userName},</h2>
//           <p style="font-size:16px; color:#374151; line-height:1.5; margin-bottom:16px;">
//             Welcome to Appointege! We're excited to have you on board and help you manage your appointments seamlessly.
//           </p>
//           <p style="font-size:16px; color:#6b7280; line-height:1.5; margin-bottom:32px;">
//             Please confirm your email address to activate your account and unlock all features.
//           </p>

//           <!-- Icon -->
//           <div style="text-align:center; margin-bottom:32px;">
//             <div style="width:64px; height:64px; background-color:#e0f2fe; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
//               <svg xmlns="http://www.w3.org/2000/svg" style="width:32px; height:32px; color:#38BDF8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//           </div>

//           <div style="text-align:center; margin-bottom:24px;">
//             <h3 style="font-size:20px; color:#1f2937; margin-bottom:16px;">Confirm Your Email</h3>
//             <p style="font-size:16px; color:#6b7280; margin-bottom:24px;">
//               Click the button below to verify your email and start using Appointege.
//             </p>
//           </div>

//           <!-- Button -->
//           <div style="text-align:center; margin-bottom:32px;">
//             <a href="${link}" style="display:inline-block; background-color:#38BDF8; color:#ffffff; padding:16px 32px; font-weight:600; border-radius:12px; text-decoration:none;">
//               Confirm My Email
//             </a>
//           </div>

//           <!-- Security Info -->
//           <div style="background-color:#fef9c3; border:1px solid #fde68a; border-radius:12px; padding:16px; margin-bottom:24px;">
//             <p style="font-size:14px; color:#374151;">
//               <strong>Important:</strong> If you didn’t sign up for Appointege, please ignore this email. No action is required.
//             </p>
//           </div>

//           <!-- Expiry -->
//           <div style="text-align:center;">
//             <p style="font-size:14px; color:#9ca3af;">
//               This link will expire in 24 hours for your security.
//             </p>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="background-color:#f9fafb; padding:24px 32px; text-align:center; border-top:1px solid #e5e7eb;">
//           <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
//             Need help? Contact our support team at <a href="mailto:${supportEmail}" style="color:#38BDF8; text-decoration:none;">${supportEmail}</a>
//           </p>
//           <p style="font-size:12px; color:#9ca3af; margin-bottom:4px;">© 2025 Appointege. All rights reserved.</p>
//           <p style="font-size:12px; color:#9ca3af;">123 Business Street, Suite 100, City, State 12345</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `
// }

// // Password Reset Email Template
// export function getPasswordResetEmailTemplate({
//   userName,
//   link,
//   supportEmail,
// }: EmailTemplateParams): string {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//       <title>Password Reset</title>
//     </head>
//     <body style="margin:0; padding:0; background-color:#f9fafb; font-family:Arial, sans-serif;">
//       <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">

//         <!-- Header -->
//         <div style="padding:24px 32px; border-bottom:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center;">
//           <div style="display:flex; align-items:center; gap:12px;">
//             <div style="width:40px; height:40px; background-color:#38BDF8; border-radius:12px; display:flex; align-items:center; justify-content:center;">
//               <svg xmlns="http://www.w3.org/2000/svg" style="width:24px; height:24px; color:#ffffff;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8" />
//               </svg>
//             </div>
//             <h1 style="font-size:24px; font-weight:bold; color:#1f2937;">Appointege</h1>
//           </div>
//         </div>

//         <!-- Content -->
//         <div style="padding:32px;">
//           <h2 style="font-size:22px; color:#1f2937; margin-bottom:24px;">Hello ${userName},</h2>
//           <p style="font-size:16px; color:#374151; line-height:1.5; margin-bottom:16px;">
//             We’ve received a request to reset your Appointege account password.
//           </p>
//           <p style="font-size:16px; color:#6b7280; line-height:1.5; margin-bottom:32px;">
//             Click the button below to set a new password and secure your account.
//           </p>

//           <!-- Icon -->
//           <div style="text-align:center; margin-bottom:32px;">
//             <div style="width:64px; height:64px; background-color:#e0f2fe; border-radius:50%; display:inline-flex; align-items:center; justify-content:center;">
//               <svg xmlns="http://www.w3.org/2000/svg" style="width:32px; height:32px; color:#38BDF8;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2m-6 0v2m0 0H9m3 0h3m-6 0V9a5 5 0 0110 0v2a5 5 0 01-10 0v2z" />
//                 </svg>
//             </div>
//           </div>

//           <div style="text-align:center; margin-bottom:24px;">
//             <h3 style="font-size:20px; color:#1f2937; margin-bottom:16px;">Password Reset Request</h3>
//             <p style="font-size:16px; color:#6b7280; margin-bottom:24px;">
//               Click the button below to create a new password.
//             </p>
//           </div>

//           <!-- Button -->
//           <div style="text-align:center; margin-bottom:32px;">
//             <a href="${link}" style="display:inline-block; background-color:#38BDF8; color:#ffffff; padding:16px 32px; font-weight:600; border-radius:12px; text-decoration:none;">
//               Reset Password
//             </a>
//           </div>

//           <!-- Security Info -->
//           <div style="background-color:#fef9c3; border:1px solid #fde68a; border-radius:12px; padding:16px; margin-bottom:24px;">
//             <p style="font-size:14px; color:#374151;">
//               <strong>Important:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
//             </p>
//           </div>

//           <!-- Expiry -->
//           <div style="text-align:center;">
//             <p style="font-size:14px; color:#9ca3af;">
//               This link will expire in 1 hour for your security.
//             </p>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="background-color:#f9fafb; padding:24px 32px; text-align:center; border-top:1px solid #e5e7eb;">
//           <p style="font-size:14px; color:#6b7280; margin-bottom:8px;">
//             Need help? Contact our support team at <a href="mailto:${supportEmail}" style="color:#38BDF8; text-decoration:none;">${supportEmail}</a>
//           </p>
//           <p style="font-size:12px; color:#9ca3af; margin-bottom:4px;">© 2025 Appointege. All rights reserved.</p>
//           <p style="font-size:12px; color:#9ca3af;">123 Business Street, Suite 100, City, State 12345</p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `
// }

import { render, pretty } from '@react-email/render'
import {
  WelcomeEmailTemplate,
  EmailTemplateParams,
  ResetPasswordEmailTemplate,
} from './templates'

async function getWelcomeEmailTemplate({
  userName,
  link,
  supportEmail,
}: EmailTemplateParams): Promise<string> {
  return await pretty(
    await render(
      <WelcomeEmailTemplate
        userName={userName}
        link={link}
        supportEmail={supportEmail}
      />,
    ),
  )
}

// Placeholder: Replace with actual PasswordResetEmail implementation
export interface PasswordResetEmailProps {
  userName?: string
  link: string
  supportEmail: string
}

async function getPasswordResetEmailTemplate({
  userName,
  link,
  supportEmail,
}: PasswordResetEmailProps): Promise<string> {
  return await pretty(
    await render(
      <ResetPasswordEmailTemplate
        userName={userName}
        link={link}
        supportEmail={supportEmail}
      />,
    ),
  )
}

// async function getWelcomeEmailTemplate({
//   userName,
//   link,
//   supportEmail,
// }: PasswordResetEmailProps): Promise<string> {
//   // Placeholder: Implement if needed
//   return ''
// }

export { getPasswordResetEmailTemplate, getWelcomeEmailTemplate }
