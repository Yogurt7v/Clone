import { useState } from 'react'
import { updateForm } from '@/services/forms'
import toast from 'react-hot-toast'
import { FormData } from '@/types/form-data'

export const useFormActions = (
  formData: FormData | null,
  originalFormData: FormData | null,
  setOriginalFormData: (data: FormData) => void
) => {
  const [isSaving, setIsSaving] = useState(false)
  const [errors] = useState<{ title?: string; questions?: string[] }>({})

  const hasChanges = () => {
    if (!originalFormData || !formData) return false

    // Проверка на пустые поля
    if (!formData.title.trim()) return false
    if (formData.questions.some((q) => !q.question.trim())) return false

    return JSON.stringify(originalFormData) !== JSON.stringify(formData)
  }

  const handleSave = async (formId: number) => {
    if (!formData || !hasChanges()) return

    try {
      setIsSaving(true)
      await updateForm(formId, formData)
      toast.success('Изменения сохранены успешно!')
      setOriginalFormData(formData)
    } catch {
      toast.error('Ошибка при сохранении формы')
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, errors, hasChanges, handleSave }
}
