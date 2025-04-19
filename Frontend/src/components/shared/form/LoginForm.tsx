'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { IFormLogin, loginSchema } from '@/lib/formValidation'
import { FormInput } from '@/components/shared/formInput'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { login, loading } = useUserStore()
  const navigate = useRouter()

  const form = useForm<IFormLogin>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const {
    reset,
    formState: { isValid },
    handleSubmit
  } = form

  const onSubmit = async (data: IFormLogin) => {
    try {
      await login(data)
      reset()
      navigate.push('/')
      return
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} role='form'>
        <FormInput
          data-testid='email-input'
          placeholder='Введите ваш email'
          label={'Электронная почта'}
          name={'email'}
          type={'email'}
          required
        />
        <FormInput
          data-testid='password-input'
          placeholder='Введите ваш пароль'
          className={'right-10'}
          onIconClick={() => setShowPassword(!showPassword)}
          icon={showPassword ? <Eye /> : <EyeOff />}
          label={'Пароль'}
          name={'password'}
          type={showPassword ? 'text' : 'password'}
          required
        />
        <Button
          data-testid='login-button'
          loading={loading}
          disabled={!isValid}
          className={'w-full mt-5 cursor-pointer'}
          type={'submit'}
        >
          Войти
        </Button>
      </form>
    </FormProvider>
  )
}
