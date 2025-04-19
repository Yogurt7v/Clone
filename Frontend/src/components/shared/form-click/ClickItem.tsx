'use client'

import { Button } from '@/components/ui/button'
import { CommentsData } from '@/types/form-data'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FC } from 'react'

interface ClickItemProps {
  id: number
  updatedAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comment: CommentsData | any
}

export const ClickItem: FC<ClickItemProps> = ({ id, updatedAt, comment }) => {
  const params = useParams()
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Дата не указана'

    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Link href={`/forms/${params.id}/responses/${String(id)}`}>
      <Button
        variant={'secondary'}
        className={'flex items-center justify-between pt-8 pb-8 border-gray-300 cursor-pointer border w-full'}
      >
        <div>
          <div className={'border-b border-gray-500 text-xl'}>
            {comment.author.firstName} {comment.author.lastName}
          </div>
          <div>{comment.author.email}</div>
        </div>
        <span className={'text-gray-500'}>{formatDate(updatedAt)}</span>
      </Button>
    </Link>
  )
}
