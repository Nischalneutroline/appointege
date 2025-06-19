// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/store/ReduxProvider'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

// Load Inter font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})
export const metadata: Metadata = {
  title: 'Appointege',
  description: 'AI-powered appointment scheduling | Appointment Manager',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  console.log('Session: in layout-----', session)
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-stone-200`}>
        <ReduxProvider>
          <SessionProvider session={session}>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
