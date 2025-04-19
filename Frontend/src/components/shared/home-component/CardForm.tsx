import * as React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Trash, CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useCardForm } from '../../../hooks'
import { Modal } from '@/components/shared/modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface CardFormProps {
  id: number
  title: string
  boolean?: boolean
  count: number
  author: {
    firstName: string
    lastName: string
    avatarUrl?: string
  }
  createdAt: string
}

export function CardForm({ id, title, boolean, count, author, createdAt }: CardFormProps) {
  const { loadingCard, openModal, handleOpenModal, closeModal, clickDeleteCard } = useCardForm()

  const formattedDate = format(new Date(createdAt), 'd MMMM yyyy', { locale: ru })
  const initials = `${author.firstName[0]}${author.lastName[0]}`

  return (
    <>
      <Link href={`/forms/${id}`}>
        <Card
          className={`${loadingCard === id ? 'opacity-50' : 'opacity-100'} 
          flex flex-col justify-between w-full h-[270px] transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
        >
          <CardHeader className={'relative p-4 sm:p-2'}>
            {boolean && (
              <div
                onClick={handleOpenModal}
                className={
                  'absolute cursor-pointer right-[-10px] bg-white top-[-30px] w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] rounded-[50%] border-2 border-red-500 flex justify-center items-center'
                }
              >
                <Trash color={'red'} className='w-4 h-4 sm:w-5 sm:h-5' />
              </div>
            )}
            <h4 className='text-center font-semibold text-sm sm:text-base md:text-lg overflow-hidden line-clamp-3 -webkit-line-clamp-3'>
              {title}
            </h4>
          </CardHeader>

          <CardContent className='flex flex-col justify-between py-2 p-4 sm:p-6'>
            <div className='flex items-center space-x-3 mb-2'>
              <Avatar className='h-6 w-6 sm:h-8 sm:w-8 border-2 border-blue-500'>
                <AvatarImage src={author.avatarUrl} alt={`${author.firstName} ${author.lastName}`} />
                <AvatarFallback className='bg-blue-100 text-blue-600'>{initials}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <div className='flex items-center space-x-1'>
                  <p className='text-xs sm:text-sm font-medium truncate'>{`${author.firstName} ${author.lastName}`}</p>
                </div>
                <div className='flex items-center space-x-1 text-gray-500'>
                  <CalendarIcon className='h-3 w-3' />
                  <p className='text-xs'>{formattedDate}</p>
                </div>
              </div>
            </div>
            <p className={'text-xs sm:text-sm text-gray-800 font-semibold'}>Количество ответов: {count}</p>
          </CardContent>
          {/* <CardFooter className="py-2 p-4 sm:p-6">
            <p className={'text-xs sm:text-sm text-gray-500'}>Нажмите для просмотра</p>
          </CardFooter> */}
        </Card>
      </Link>
      {openModal && <Modal clickDeleteCard={(e) => clickDeleteCard(e, id)} open={openModal} onClose={closeModal} />}
    </>
  )
}
