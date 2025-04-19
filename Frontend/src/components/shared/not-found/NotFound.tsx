import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FC } from 'react'
import { Container } from '../container'

const NotFound: FC = () => {
  return (
    <div className='flex h-screen justify-center items-center bg-gray-100'>
      <Container>
        <div className='text-center'>
          <h1 className='text-8xl md:text-9xl font-bold text-gray-600 mb-4'>404</h1>
          <h2 className='text-2xl md:text-3xl font-medium text-gray-600 mb-4'>Страница не найдена</h2>
          <p className='text-md md:text-lg text-gray-600 mb-8'>
            К сожалению, страница, которую вы ищете, не существует. Проверьте URL или вернитесь на главную страницу.
          </p>
          <Button>
            <Link href='/'>Вернуться на главную</Link>
          </Button>
        </div>
      </Container>
    </div>
  )
}

export default NotFound
