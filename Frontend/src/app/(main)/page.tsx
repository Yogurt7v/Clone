'use client'

import { HomeComponent } from '@/components/shared/home-component'
import { Container } from '@/components/shared'
import { AuthProvider } from '@/lib/auth-provider'

function Home() {
  return (
    <AuthProvider>
      <Container className='pt-8'>
        <HomeComponent />
      </Container>
    </AuthProvider>
  )
}

export default Home
