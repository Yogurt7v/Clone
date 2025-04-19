'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/formInput'
import { IFormRegister, registerSchema } from '@/lib/formValidation'
import React, { useState } from 'react'
import { Eye, EyeOff, Upload, X } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'
import { useImageUpload } from '../../../hooks'
import { IUserRegister } from '@/types/user'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const navigation = useRouter()
  const { register, loading } = useUserStore()

  const form = useForm<IFormRegister>({
    mode: 'onBlur',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
      // avatarUrl: ''
    }
  })

  const {
    reset,
    handleSubmit,
    formState: { isValid },
    setValue
  } = form

  const { image, handleImageUpload, fileInputRef, handleRemoveImage } = useImageUpload(setValue)
  const onSubmit = async (data: IFormRegister) => {
    try {
      const registerData: IUserRegister = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      }
      await register(registerData)
      navigation.push('/')
      reset()
      // логика заполнения юзера в состоянии и редирект
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput placeholder='Имя' label={'Имя'} name={'firstName'} type={'text'} required />
        <FormInput placeholder='Фамилия' label={'Фамилия'} name={'lastName'} type={'text'} required />
        <FormInput placeholder='Электронная почта' label={'Электронная почта'} name={'email'} type={'email'} required />
        <FormInput
          className={'right-10'}
          onIconClick={() => setShowPassword(!showPassword)}
          icon={showPassword ? <Eye /> : <EyeOff />}
          label={'Пароль'}
          placeholder='Пароль'
          name={'password'}
          type={showPassword ? 'text' : 'password'}
          required
        />
        <FormInput
          className={'right-10'}
          onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          icon={showConfirmPassword ? <Eye /> : <EyeOff />}
          placeholder='Подтвердите пароль'
          label={'Подтвердите пароль'}
          name={'confirmPassword'}
          type={showConfirmPassword ? 'text' : 'password'}
          required
        />
        <div className='mt-1 flex  items-center'>
          <input
            ref={fileInputRef}
            type='file'
            id='image'
            className={'sr-only'}
            accept='image/*'
            onChange={handleImageUpload}
          />
          <label
            htmlFor='image'
            className=' relative cursor-pointer w-full bg-gray-700 py-2 px-3 border border-gray-600 mt-2 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
          >
            <Upload className='h-5 w-5 inline-block mr-2' />
            {image ? 'Картинка загрузилась' : 'Загрузить картинку'}
            {image && (
              <X
                onClick={handleRemoveImage}
                className='h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer'
              />
            )}
          </label>
        </div>
        <Button
          data-testid='signup-button'
          loading={loading}
          disabled={!isValid}
          className={'w-full mt-5 cursor-pointer'}
          type={'submit'}
        >
          Регистрация
        </Button>
      </form>
    </FormProvider>
  )
}
