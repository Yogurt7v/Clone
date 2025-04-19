import React, { FC, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface MyFormProps {
  setAuthorId: (val: number | undefined) => void
}

export const MyForm: FC<MyFormProps> = ({ setAuthorId }) => {
  const userString = localStorage.getItem('user')
  const user = userString ? JSON.parse(userString) : undefined
  const userId = user?.id
  const [idState, setIdState] = useState<number | undefined>(undefined)

  const toggleValue = () => {
    setIdState((prev) => (prev === userId ? undefined : userId))
  }

  useEffect(() => {
    setAuthorId(idState)
  }, [idState, setAuthorId])

  return (
    <div className={'flex w-full sm:w-[140px] items-center gap-2 p-2 sm:p-0'}>
      <Input id='user-form' type={'checkbox'} className={'w-4 h-4 sm:w-5 sm:h-5'} onClick={toggleValue} />
      <label htmlFor='user-form' className='text-sm sm:text-base whitespace-nowrap'>
        Мои формы
      </label>
    </div>
  )
}
