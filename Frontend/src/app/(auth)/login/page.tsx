'use client'

import { Container } from '@/components/shared/container'
import Link from 'next/link'
import { LoginForm } from '@/components/shared/form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import google from '../../../../public/google.svg'
import { loginWithGoogle } from '@/services/user'

function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'authenticated' || status === 'loading') {
    return <div>Loading...</div>
  }
  return (
    <Container className={'flex justify-center items-center h-[100vh]'}>
      <div
        className={
          'w-[450px] flex flex-col px-[10px] py-[10px]   sm:py-[20px] sm:px-[80px] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.25)]'
        }
      >
        {/* <h1 className='text-center mb-5 font-custom'>Войти</h1> */}
        <LoginForm />
        <button
          onClick={() => loginWithGoogle()}
          className='mt-4 w-full bg-white border border-gray-300 rounded-lg py-2 px-4 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300'
        >
          <Image src={google} width={10} height={10} alt='Google' className='w-5 h-5 ' />
          Войти через Google
        </button>
        <div className={'flex justify-center gap-4 mt-6'}>
          <p>Нет аккаунта ?</p>
          <Link href={'/register'} className={'text-center text-blue-500 hover:underline'}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </Container>
  )
}
export default LoginPage
