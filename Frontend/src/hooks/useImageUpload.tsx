import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form'

type FormValues = {
  avatarUrl?: string
  email: string
  password: string
  firstName: string
  lastName: string
  confirmPassword: string
}

export const useImageUpload = (setValue: UseFormSetValue<FormValues>, trigger?: UseFormTrigger<FormValues>) => {
  const [image, setImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isAvatarChanged, setIsAvatarChanged] = useState(false);

  const handleRemoveImage = async (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault()
    setImage(null)
    setValue('avatarUrl', '', { shouldValidate: true })
    if (trigger) {
      await trigger('avatarUrl')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]
    if (!file) return
    if (file.size > 1 * 1024 * 1024) { 
      toast.error('Файл слишком большой, максимальный размер 1MB')
      return;
    }

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        const imageResult = reader.result as string
        setValue('avatarUrl', imageResult, { shouldValidate: true })
        setImage(imageResult)
        setIsAvatarChanged(true)
        if (trigger) {
          await trigger('avatarUrl')
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      toast.error('Ошибка загрузки изображения')
    }
  }

  return { image, handleImageUpload, fileInputRef, handleRemoveImage, isAvatarChanged }
}
