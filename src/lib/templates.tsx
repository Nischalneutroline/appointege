import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

// Define and export the props interface
export interface EmailTemplateParams {
  userName?: string
  link: string
  supportEmail?: string
}

export function WelcomeEmailTemplate({
  userName,
  link,
  supportEmail = 'info@appointege.com',
}: EmailTemplateParams) {
  const name = userName || 'there'
  return (
    <Html>
      <Head />
      <Preview>Get ready to master your schedule with Appointege!</Preview>
      <Body style={main}>
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <Section
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              textAlign: 'center',
            }}
          >
            <Link
              href="https://appointege.com"
              style={{ textDecoration: 'none' }}
            >
              <Img
                src="https://img.icons8.com/?size=100&id=udduMUcrHmZa&format=png&color=000000"
                width="40"
                height="40"
                alt="Appointege Logo"
                style={{
                  backgroundColor: '#4F7CFF',
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
              <Heading
                as="h1"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  paddingLeft: '12px',
                }}
              >
                Appointege
              </Heading>
            </Link>
          </Section>

          {/* Content */}
          <Section style={{ padding: '32px 24px' }}>
            <Heading
              as="h2"
              style={{
                fontSize: '22px',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              Hello {name},
            </Heading>
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                marginBottom: '16px',
              }}
            >
              Welcome to Appointege! We’re thrilled to have you on board to
              simplify your appointment management.
            </Text>
            <Text
              style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '24px',
                marginBottom: '16px',
              }}
            >
              Click the button below to confirm your email and start booking,
              tracking, and organizing your schedule like a pro!
            </Text>

            {/* Icon */}
            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Img
                src="https://img.icons8.com/?size=100&id=udduMUcrHmZa&format=png&color=000000"
                width="64"
                height="64"
                alt="Welcome Icon"
                style={{
                  backgroundColor: '#ebf4ff',
                  borderRadius: '50%',
                  padding: '16px',
                  display: 'inline-block',
                }}
              />
            </Section>

            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Heading
                as="h3"
                style={{
                  fontSize: '20px',
                  color: '#1f2937',
                  marginBottom: '16px',
                }}
              >
                Get Started with Appointege
              </Heading>
              <Text
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '16px',
                }}
              >
                Confirm your email to unlock the full power of Appointege’s
                scheduling tools.
              </Text>
            </Section>

            {/* Button */}
            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Button
                href={link}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #0ea5e9, #0284c7)',
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Confirm now!
              </Button>
            </Section>

            {/* Security Info */}
            <Section
              style={{
                backgroundColor: '#fef9c3',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <Text
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  margin: '0',
                  lineHeight: '20px',
                }}
              >
                <strong>Important:</strong> If you didn’t sign up for
                Appointege, please ignore this email. Contact{' '}
                <Link
                  href="mailto:support@appointege.com"
                  style={{ color: '#4F7CFF', textDecoration: 'none' }}
                >
                  support@appointege.com
                </Link>{' '}
                for assistance.
              </Text>
            </Section>

            {/* Expiry */}
            <Section
              style={{
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  margin: '0',
                  lineHeight: '20px',
                }}
              >
                This link will expire in 24 hours for your security.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: '#f9fafb',
              padding: '24px 32px',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                lineHeight: '20px',
              }}
            >
              Need help? Contact our support team at{' '}
              <Link
                href={`mailto:${supportEmail}`}
                style={{ color: '#4F7CFF', textDecoration: 'none' }}
              >
                support@appointege.com
              </Link>
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 4px 0',
                lineHeight: '18px',
              }}
            >
              © 2025 Appointege. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0',
                lineHeight: '18px',
              }}
            >
              123 Business Street, Suite 100, City, State 12345
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const ResetPasswordEmailTemplate = ({
  userName,
  link,
  supportEmail = 'info@appointege.com',
}: EmailTemplateParams) => {
  const name = userName || 'there'
  return (
    <Html>
      <Head />
      <Preview>
        Reset your Appointege password to keep your schedule on track!
      </Preview>
      <Body style={main}>
        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {/* Header */}
          <Section
            style={{
              padding: '24px 32px',
              borderBottom: '1px solid #e5e7eb',
              textAlign: 'center',
            }}
          >
            <Link
              href="https://appointege.com"
              style={{ textDecoration: 'none' }}
            >
              <Img
                src="https://img.icons8.com/?size=100&id=udduMUcrHmZa&format=png&color=000000"
                width="40"
                height="40"
                alt="Appointege Logo"
                style={{
                  backgroundColor: '#4F7CFF',
                  borderRadius: '12px',
                  padding: '8px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              />
              <Heading
                as="h1"
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  paddingLeft: '12px',
                }}
              >
                Appointege
              </Heading>
            </Link>
          </Section>

          {/* Content */}
          <Section style={{ padding: '32px 24px' }}>
            <Heading
              as="h2"
              style={{
                fontSize: '22px',
                color: '#1f2937',
                marginBottom: '24px',
              }}
            >
              Hello {name},
            </Heading>
            <Text
              style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                marginBottom: '16px',
              }}
            >
              We’ve received a request to reset your Appointege account
              password. Get back to managing your appointments in no time!
            </Text>
            <Text
              style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: '24px',
                marginBottom: '16px',
              }}
            >
              Click the button below to set a new password and keep your
              schedule on track.
            </Text>

            {/* Icon */}
            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Img
                src="https://img.icons8.com/?size=100&id=udduMUcrHmZa&format=png&color=000000"
                width="64"
                height="64"
                alt="Password Reset Icon"
                style={{
                  backgroundColor: '#ebf4ff',
                  borderRadius: '50%',
                  padding: '16px',
                  display: 'inline-block',
                }}
              />
            </Section>

            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Heading
                as="h3"
                style={{
                  fontSize: '20px',
                  color: '#1f2937',
                  marginBottom: '16px',
                }}
              >
                Password Reset Request
              </Heading>
              <Text
                style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  marginBottom: '16px',
                }}
              >
                Set a new password to securely access your Appointege account.
              </Text>
            </Section>

            {/* Button */}
            <Section
              style={{
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <Button
                href={link}
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #0ea5e9, #0284c7)',
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Reset Password Now!
              </Button>
            </Section>

            {/* Security Info */}
            <Section
              style={{
                backgroundColor: '#fef9c3',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <Text
                style={{
                  fontSize: '14px',
                  color: '#374151',
                  margin: '0',
                  lineHeight: '20px',
                }}
              >
                <strong>Important:</strong> If you didn’t request this password
                reset, please ignore this email. Your password remains secure.
                Contact{' '}
                <Link
                  href="mailto:support@appointege.com"
                  style={{ color: '#4F7CFF', textDecoration: 'none' }}
                >
                  support@appointege.com
                </Link>{' '}
                for assistance.
              </Text>
            </Section>

            {/* Expiry */}
            <Section
              style={{
                textAlign: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  margin: '0',
                  lineHeight: '20px',
                }}
              >
                This link will expire in 24 hours for your security.
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: '#f9fafb',
              padding: '24px 32px',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                lineHeight: '20px',
              }}
            >
              Need help? Contact our support team at{' '}
              <Link
                href="mailto:support@appointege.com"
                style={{ color: '#4F7CFF', textDecoration: 'none' }}
              >
                support@appointege.com
              </Link>
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 4px 0',
                lineHeight: '18px',
              }}
            >
              © 2025 Appointege. All rights reserved.
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0',
                lineHeight: '18px',
              }}
            >
              123 Business Street, Suite 100, City, State 12345
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f9fafb',
  fontFamily:
    'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  margin: '0',
  padding: '0',
}
