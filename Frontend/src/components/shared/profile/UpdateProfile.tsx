'use client'

import React, { FC, FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { IFetchedProfile } from '@/types/user'
import { useUserStore } from '@/store/useUserStore'
import { Input } from '@/components/ui/input'
import { useImageUpload } from '@/hooks/useImageUpload'
import { X } from 'lucide-react'
import { validateProfile } from '@/lib/validateProfile'
import { useFormField } from '@/hooks'

interface UpdateProfileProps {
  profile: IFetchedProfile | null
  setProfile: (val: Pick<IFetchedProfile, 'firstName' | 'lastName' | 'avatarUrl'>) => void
  setIsFilled: (val: boolean) => void
  isFilled: boolean
}

export const UpdateProfile: FC<UpdateProfileProps> = ({ profile, setProfile, setIsFilled, isFilled }) => {
  const { updateProfile, loading } = useUserStore()
  const { image, handleImageUpload, fileInputRef, handleRemoveImage, isAvatarChanged } = useImageUpload(() => {})
  const {
    value: name,
    isTouched: isTouchedName,
    handleChange: handleNameChange,
    setValue: setName
  } = useFormField(profile?.firstName || '')
  const {
    value: fullName,
    isTouched: isTouchedFullName,
    handleChange: handleFullNameChange,
    setValue: setFullName
  } = useFormField(profile?.lastName || '')

  // Ошибки для полей
  const [errors, setErrors] = useState({ firstName: '', lastName: '' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationErrors, setValidationErrors] = useState({ firstName: '', lastName: '' })

  useEffect(() => {
    if (profile) {
      setName(profile.firstName || '')
      setFullName(profile.lastName || '')
    }
  }, [profile, profile?.firstName, profile?.lastName, setName, setFullName])

  useEffect(() => {
    // Проверяем, были ли изменены поля (кроме аватара)
    const isNameFieldsChanged =
      name.trim() !== profile?.firstName?.trim() || fullName.trim() !== profile?.lastName?.trim()

    if (isTouchedName || isTouchedFullName) {
      const validationErrors = validateProfile(name, fullName)
      setErrors(validationErrors)
    }

    // изменены текстовые поля ИЛИ аватар
    setIsFilled(!validationErrors.firstName && !validationErrors.lastName && (isNameFieldsChanged || isAvatarChanged))
  }, [
    name,
    fullName,
    image,
    profile,
    isTouchedName,
    isTouchedFullName,
    isAvatarChanged,
    validateProfile,
    setErrors,
    setIsFilled,
    validationErrors
  ])

  // Отправка формы
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFilled) return
    try {
      await updateProfile({
        id: profile?.id,
        firstName: name,
        lastName: fullName,
        avatarUrl: image || profile?.avatarUrl
      })
      setProfile({
        firstName: name,
        lastName: fullName,
        avatarUrl: image || profile?.avatarUrl
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleUpdateProfile} className={'sm:w-full'}>
      {/* Поле Имя */}
      <div className='mb-4'>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
          Имя
        </label>
        <Input
          type='text'
          value={name}
          onChange={handleNameChange}
          className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${errors.firstName ? 'border-red-500' : ''}`}
        />
        {errors.firstName && <div className='text-red-500 text-sm mt-1'>{errors.firstName}</div>}
      </div>

      {/* Поле Фамилия */}
      <div className='mb-4'>
        <label htmlFor='fullName' className='block text-sm font-medium text-gray-700'>
          Фамилия
        </label>
        <Input
          type='text'
          value={fullName}
          onChange={handleFullNameChange}
          className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${errors.lastName ? 'border-red-500' : ''}`}
        />
        {errors.lastName && <div className='text-red-500 text-sm mt-1'>{errors.lastName}</div>}
      </div>

      {/* Поле загрузки аватара */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700'>Аватар</label>
        <div className='flex items-center'>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            ref={fileInputRef}
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
          />
          {image && <X onClick={handleRemoveImage} className='cursor-pointer' />}
        </div>
      </div>

      {/* Кнопка */}
      <Button
        disabled={!isFilled || loading}
        loading={loading}
        className={'w-full mt-5 cursor-pointer relative'}
        type={'submit'}
      >
        Редактировать
      </Button>
    </form>
  )
}
