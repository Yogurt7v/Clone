'use client'

import { Title } from '@/components/shared/title'
import Link from 'next/link'
import { Container } from '@/components/shared/container'
import { SignupForm } from '@/components/shared/form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function SignupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем его на главную
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, session, router])

  // Показываем лоадер во время проверки авторизации
  if (status === 'loading' || status === 'authenticated') {
    return (
      <Container className={'flex justify-center items-center h-[100vh]'}>
        <div>Loading...</div>
      </Container>
    )
  }

  return (
    <Container className={'flex justify-center items-center h-[100vh]'}>
      <div
        className={
          'w-[450px] flex flex-col py-[12px] px-[12px] sm:py-[20px] sm:px-[80px] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.25)]'
        }
      >
        <Title text={'Зарегистрироваться'} className={'text-center mb-5'} />
        <SignupForm />
        <div className={'flex justify-center gap-4 mt-6'}>
          <p>Есть аккаунт?</p>
          <Link href={'/login'} className={'text-center text-blue-500 hover:underline'}>
            Войти
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default SignupPage
