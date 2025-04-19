'use client'

import { Container } from '@/components/shared/container'
import { UpdateProfile } from '@/components/shared/profile/UpdateProfile'
import { ChevronLeft, CircleCheckBig, Pen } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DataProfile } from '@/components/shared/profile/DataProfile'
import { IFetchedProfile } from '@/types/user'
import defaultAvatar from '../../../../public/bccvxj7Ogv.gif'
import Image from 'next/image'

export const Profile = () => {
  const [showForm, setShowForm] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false) // Отслеживание заполненности
  const [profile, setProfile] = useState<IFetchedProfile | null>(null)

  const clickShow = () => {
    setShowForm(true)
  }

  return (
    <Container className={'flex justify-center items-center py-6'}>
      <div
        className={
          'w-[450px] relative flex flex-col items-center pb-[20px]  sm:py-[20px] sm:px-[80px] rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.25)]'
        }
      >
        {showForm && (
          <button
            onClick={() => setShowForm(false)}
            className={'flex items-center gap-[4px] cursor-pointer absolute left-2 top-[13px]'}
          >
            <ChevronLeft className={'transition-transform duration-300 hover:translate-x-2'} size={40} />
          </button>
        )}
        {showForm ? (
          <CircleCheckBig
            className={cn('absolute cursor-pointer right-[13px] top-[13px]')}
            size={35}
            color={isFilled ? '#34eb4f' : '#bdb1bb'}
          />
        ) : (
          <Pen
            onClick={clickShow}
            className={'absolute right-[13px] cursor-pointer top-[13px]'}
            size={25}
            color={'#3452eb'}
          />
        )}
        {profile?.avatarUrl ? (
          <Image
            width={300}
            height={300}
            className='w-[300px] h-[300px] rounded-lg'
            src={profile.avatarUrl}
            alt='Профиль'
          />
        ) : (
          <Image
            width={300}
            height={300}
            className='w-[300px] h-[300px] rounded-lg'
            src={defaultAvatar}
            alt='Профиль'
          />
        )}
        {!showForm && <DataProfile profile={profile} setProfile={setProfile} />}
        {showForm && (
          <UpdateProfile isFilled={isFilled} setIsFilled={setIsFilled} setProfile={setProfile} profile={profile} />
        )}
      </div>
    </Container>
  )
}
