'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Публичные маршруты (доступ без авторизации)
const publicRoutes = ['/login', '/register']
// Пути, доступные без авторизации (регулярное выражение)
const publicPatterns = [/^\/forms\/\d+$/]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname) || publicPatterns.some((pattern) => pattern.test(pathname))
    if (isPublicRoute) {
      setIsAuth(true)
      return
    }

    // Проверяем токен в localStorage
    const token = localStorage.getItem('accessToken')

    if (token) {
      setIsAuth(true)
    } else {
      setIsAuth(false)
      router.push('/login')
    }
  }, [pathname, router])

  if (isAuth === null) {
    return null // Или лоадер
  }

  return isAuth ? <>{children}</> : null
}
