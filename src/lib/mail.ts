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
          ? await getWelcomeEmailTemplate({
              userName: userName || 'User',
              link: link,
              supportEmail: 'info@appointege.com',
            })
          : await getPasswordResetEmailTemplate({
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
