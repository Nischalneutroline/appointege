import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/store/ReduxProvider'
import { Toaster } from '@/components/ui/sonner'

// Load Inter font
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Appointege',
  description: 'AI-powered appointment scheduling | Appointment Manager',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased bg-stone-200`}>
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}
