// // import { Resend } from "resend"

// // const resend = new Resend(process.env.RESEND_API_KEY)

// // export const sendVerificationEmail = async (email: string, token: string) => {
// //   const confirmLink = `http://localhost:3000/auth/verify-email?token=${token}`

// //   await resend.emails.send({
// //     from: "onboarding@resend.dev",
// //     to: email,
// //     subject: "Confirm your email",
// //     html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
// //   })
// // }

// import nodemailer from 'nodemailer'
// import { getBaseUrl } from './baseUrl'
// import {
//   getPasswordResetEmailTemplate,
//   getWelcomeEmailTemplate,
// } from './email-templates'

// // Configuration
// const senderEmail = process.env.SENDER_EMAIL // Replace with your email
// const senderPassword = process.env.SENDER_PASSWORD // Replace with your Gmail App Password

// enum EmailType {
//   Verification = 'Verification',
//   Reset = 'Reset',
//   TwoFactor = 'TwoFactor',
// }

// const getEmailRedirectUrl = (type: EmailType, token: string) => {
//   const baseUrl = getBaseUrl()
//   return `${baseUrl}/${
//     type === EmailType.Verification ? 'verify-email' : 'new-password'
//   }?token=${token}`
// }

// /**
//  *Sends email, either confirm or reset
//  * @param email - Sends email to given address
//  * @param token - Token is used to create link
//  * @param type - Check either email is verify or reset
//  * @returns - returns info of email sent
//  */

// const sendEmail = async (
//   email: string,

//   type: EmailType = EmailType.Verification,
//   template: string,
// ) => {
//   try {
//     // Step 1: Create the transporter
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com', // Gmail SMTP server
//       port: 587, // Port for TLS
//       secure: false, // Use TLS
//       auth: {
//         user: senderEmail, // Your email
//         pass: senderPassword, // Your app password
//       },
//     })

//     // Step 2: Email content
//     const mailOptions = {
//       from: `Appointege <${senderEmail}>`, // Sender address
//       to: email, // Recipient address
//       subject: `${
//         type === EmailType.Verification
//           ? 'Verify Your Email'
//           : 'Reset your password'
//       }`, // Subject line
//       text: `Email from Appointege`, // Plain text
//       html: template,
//     }

//     // Step 3: Send the email
//     const info = await transporter.sendMail(mailOptions)

//     console.log('Email sent successfully!')
//     console.log('Message ID:', info.messageId)
//     return info
//   } catch (error) {
//     console.error('Error sending email:', error)
//     return
//   }
// }

// // Verification Email
// export async function sendVerificationEmail(
//   email: string,
//   token: string,
//   userName: string,
// ) {
//   // Construct the confirmation link
//   const confirmLink = `${getEmailRedirectUrl(EmailType.Verification, token)}`
//   const template = getWelcomeEmailTemplate({
//     userName,
//     link: confirmLink,
//     supportEmail: 'info@appointege.com',
//   })
//   const info = await sendEmail(email, EmailType.Verification, template)
// }

// // Reset Email
// export async function sendResetEmail(
//   email: string,
//   token: string,
//   userName: string,
// ) {
//   const resetLink = `${getEmailRedirectUrl(EmailType.Reset, token)}`
//   const template = getPasswordResetEmailTemplate({
//     userName,
//     link: resetLink,
//     supportEmail: 'info@appointege.com',
//   })
//   const info = await sendEmail(email, EmailType.Reset, template)
// }

// // Two factor email
// export const sendTwoFactorEmail = async (email: string, token: string) => {
//   try {
//     // Step 1: Create the transporter
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com', // Gmail SMTP server
//       port: 587, // Port for TLS
//       secure: false, // Use TLS
//       auth: {
//         user: senderEmail, // Your email
//         pass: senderPassword, // Your app password
//       },
//     })

//     // Step 2: Email content
//     const mailOptions = {
//       from: `Appintege <${senderEmail}>`, // Sender address
//       to: email, // Recipient address
//       subject: 'Appiontege Two Factor Code', // Subject line
//       html: `<p>Your two factor code: ${token}</p>`, // HTML content
//     }

//     // Step 3: Send the email
//     const info = await transporter.sendMail(mailOptions)

//     console.log('Email sent successfully!')
//     console.log(info)
//     console.log('Message ID:', info.messageId)
//     return info
//   } catch (error) {
//     console.error('Error sending email:', error)
//     return
//   }
// }

import nodemailer from 'nodemailer'
import { getBaseUrl } from './baseUrl'
import {
  getPasswordResetEmailTemplate,
  getWelcomeEmailTemplate,
} from './email-templates'

interface EmailTemplateParams {
  userName: string
  link: string
  supportEmail: string
}

enum EmailType {
  Verification = 'Verification',
  Reset = 'Reset',
  TwoFactor = 'TwoFactor',
}

const getEmailRedirectUrl = (type: EmailType, token: string) => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}/${
    type === EmailType.Verification ? 'verify-email' : 'new-password'
  }?token=${token}`
}

/**
 * Sends email, either confirm, reset, or two-factor
 * @param email - Sends email to given address
 * @param type - Check either email is verify, reset, or two-factor
 * @param token - Token is used to create link (for Verification/Reset)
 * @param userName - Username for personalization (for Verification/Reset)
 * @returns - Returns info of email sent or undefined if failed
 */
const sendEmail = async (
  email: string,
  type: EmailType = EmailType.Verification,
  token?: string,
  userName?: string,
): Promise<nodemailer.SentMessageInfo | undefined> => {
  try {
    // Step 1: Create the transporter with enhanced security
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true, // Ensures secure connection
      },
    })

    // Step 2: Prepare email content based on type
    let mailOptions: nodemailer.SendMailOptions
    if (type === EmailType.TwoFactor) {
      mailOptions = {
        from: `Appointege <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: 'Appointege Two-Factor Code',
        html: `<p>Your two-factor code: <strong>${token}</strong></p>`,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@appointege.com>',
          'Reply-To': process.env.SENDER_EMAIL
            ? process.env.SENDER_EMAIL
            : 'info@appointege.com',
          'X-Mailer': 'Appointege Email Service',
        },
      }
    } else {
      const link = token ? getEmailRedirectUrl(type, token) : ''
      const template =
        type === EmailType.Verification
          ? getWelcomeEmailTemplate({
              userName: userName || 'User',
              link: link,
              supportEmail: 'info@appointege.com',
            })
          : getPasswordResetEmailTemplate({
              userName: userName || 'User',
              link: link,
              supportEmail: 'info@appointege.com',
            })

      mailOptions = {
        from: `Appointege <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: `${
          type === EmailType.Verification
            ? 'Verify Your Email'
            : 'Reset Your Password'
        }`,
        text: `Email from Appointege regarding your ${type.toLowerCase()} request.`,
        html: template,
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@appointege.com>',
          'Reply-To': process.env.SENDER_EMAIL || 'info@appointege.com',
          'X-Mailer': 'Appointege Email Service',
        },
      }
    }

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully!')
    console.log('Message ID:', info.messageId)
    console.log('Response:', info.response)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    return undefined
  }
}

// Verification Email
export async function sendVerificationEmail(
  email: string,
  token: string,
  userName: string,
) {
  return sendEmail(email, EmailType.Verification, token, userName)
}

// Reset Email
export async function sendResetEmail(
  email: string,
  token: string,
  userName: string,
) {
  return sendEmail(email, EmailType.Reset, token, userName)
}

// Two-Factor Email
export const sendTwoFactorEmail = async (email: string, token: string) => {
  return sendEmail(email, EmailType.TwoFactor, token)
}
