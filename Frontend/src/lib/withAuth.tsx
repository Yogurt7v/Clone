'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

/**
 * Хук для проверки авторизации и перенаправления на страницу логина.
 */
const withAuth = <T extends Record<string, unknown>>(Component: React.FC<T>) => {
  const AuthenticatedComponent = (props: T) => {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const pathname = usePathname()

    useEffect(() => {
      const token = localStorage.getItem('accessToken')
      const isPublicPath = ['/login', '/register'].includes(pathname)
      const isFormPath = /^\/forms\/\d+$/.test(pathname) // Проверяет /forms/1, /forms/42 и т.д.

      if (!token) {
        if (!isPublicPath && !isFormPath) {
          router.replace('/login')
        } else {
          setLoading(false)
        }
      } else {
        if (isPublicPath) {
          router.replace('/')
        } else {
          setLoading(false)
        }
      }
    }, [router, pathname])

    if (loading)
      return (
        <div className='fixed inset-0 flex justify-center items-center bg-white/100 z-50'>
          <Loader className='w-10 h-10  animate-spin' />
        </div>
      )

    return <Component {...props} />
  }

  AuthenticatedComponent.displayName = 'AuthenticatedComponent'

  return AuthenticatedComponent
}

export default withAuth
