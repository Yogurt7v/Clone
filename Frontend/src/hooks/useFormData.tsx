/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useFormsStore } from '@/store/useFormStore'
import { FormData } from '@/types/form-data'

export const useFormData = (formId: number) => {
  const { getFormById } = useFormsStore()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [originalFormData, setOriginalFormData] = useState<FormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const form = await getFormById(formId)
      if (form?.SingleForm) {
        const data = form.SingleForm as unknown as FormData
        setFormData(data)
        setOriginalFormData(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [formId])

  return { formData, originalFormData, isLoading, setFormData, setOriginalFormData }
}
