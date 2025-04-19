import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import ProvidersLayout from '@/app/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ProvidersLayout>{children}</ProvidersLayout>
        <Toaster position='top-center' reverseOrder={false} />
      </body>
    </html>
  )
}
