'use client'

import React from 'react'
import { AuthProvider } from '@/lib/auth-provider'
import { SessionProvider } from 'next-auth/react'

const ProvidersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  )
}

export default ProvidersLayout
