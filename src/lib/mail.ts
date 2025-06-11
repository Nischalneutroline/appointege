// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export const sendVerificationEmail = async (email: string, token: string) => {
//   const confirmLink = `http://localhost:3000/auth/verify-email?token=${token}`

//   await resend.emails.send({
//     from: "onboarding@resend.dev",
//     to: email,
//     subject: "Confirm your email",
//     html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
//   })
// }

import nodemailer from 'nodemailer'
import { getBaseUrl } from './baseUrl'
import {
  getPasswordResetEmailTemplate,
  getWelcomeEmailTemplate,
} from './email-templates'

// Configuration
const senderEmail = process.env.SENDER_EMAIL // Replace with your email
const senderPassword = process.env.SENDER_PASSWORD // Replace with your Gmail App Password

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
 *Sends email, either confirm or reset
 * @param email - Sends email to given address
 * @param token - Token is used to create link
 * @param type - Check either email is verify or reset
 * @returns - returns info of email sent
 */

const sendEmail = async (
  email: string,

  type: EmailType = EmailType.Verification,
  template: string,
) => {
  try {
    // Step 1: Create the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP server
      port: 587, // Port for TLS
      secure: false, // Use TLS
      auth: {
        user: senderEmail, // Your email
        pass: senderPassword, // Your app password
      },
    })

    // Step 2: Email content
    const mailOptions = {
      from: `Appointege <${senderEmail}>`, // Sender address
      to: email, // Recipient address
      subject: `${
        type === EmailType.Verification
          ? 'Verify Your Email'
          : 'Reset your password'
      }`, // Subject line
      text: `Email from Appointege`, // Plain text
      html: template,
    }

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully!')
    console.log('Message ID:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    return
  }
}

// Verification Email
export async function sendVerificationEmail(
  email: string,
  token: string,
  userName: string,
) {
  // Construct the confirmation link
  const confirmLink = `${getEmailRedirectUrl(EmailType.Verification, token)}`
  const template = getWelcomeEmailTemplate({
    userName,
    link: confirmLink,
    supportEmail: 'info@appointege.com',
  })
  const info = await sendEmail(email, EmailType.Verification, template)
}

// Reset Email
export async function sendResetEmail(
  email: string,
  token: string,
  userName: string,
) {
  const resetLink = `${getEmailRedirectUrl(EmailType.Reset, token)}`
  const template = getPasswordResetEmailTemplate({
    userName,
    link: resetLink,
    supportEmail: 'info@appointege.com',
  })
  const info = await sendEmail(email, EmailType.Reset, template)
}

// Two factor email
export const sendTwoFactorEmail = async (email: string, token: string) => {
  try {
    // Step 1: Create the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP server
      port: 587, // Port for TLS
      secure: false, // Use TLS
      auth: {
        user: senderEmail, // Your email
        pass: senderPassword, // Your app password
      },
    })

    // Step 2: Email content
    const mailOptions = {
      from: `Appintege <${senderEmail}>`, // Sender address
      to: email, // Recipient address
      subject: 'Appiontege Two Factor Code', // Subject line
      html: `<p>Your two factor code: ${token}</p>`, // HTML content
    }

    // Step 3: Send the email
    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent successfully!')
    console.log(info)
    console.log('Message ID:', info.messageId)
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    return
  }
}
