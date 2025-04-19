'use client'

import React from 'react'

import { Input } from '@/components/ui/input'
import { ClearButton } from '@/components/shared/clearButton'
import { ErrorText } from '@/components/shared/errorText'
import { useFormContext } from 'react-hook-form'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  icon?: React.ReactNode
  label?: string
  required?: boolean
  className?: string
  onIconClick?: () => void
  placeholder?: string
  type: 'text' | 'password' | 'email' | 'password_confirmation'
}

export const FormInput: React.FC<Props> = ({
  icon,
  type,
  onIconClick,
  name,
  className,
  label,
  required,
  placeholder,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = useFormContext()

  const value = watch(name)
  const errorText = errors[name]?.message as string

  const onClickClear = () => {
    setValue(name, '', { shouldValidate: true })
  }
  return (
    <div className={className}>
      {label && (
        <label className={'font-medium mb-2'}>
          {label}
          {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <div className={'relative'}>
        <Input
          type={type}
          className={`${errorText && 'border-red-500'}`}
          placeholder={placeholder}
          {...register(name)}
          {...props}
        />
        {icon && (
          <div
            data-testid='icon'
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer'
            onClick={onIconClick} // Добавляем обработчик клика
          >
            {icon}
          </div>
        )}
        {value && <ClearButton className={className} onClick={onClickClear} />}
      </div>
      {errorText && <ErrorText text={errorText} className={'mt-2'} />}
    </div>
  )
}
