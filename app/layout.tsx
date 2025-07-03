import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'Speaker profile',
  description: 'Manage Your Speaker Profile with Ease & Style, Create multiple bio versions, manage headshots, and share your speaker profile effortlessly. Perfect for conferences, events, and professional networking.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        </body>
    </html>
  )
}
