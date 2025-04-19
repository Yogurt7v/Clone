'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent } from '@dnd-kit/core'
import { FormViewSkeleton } from './FormViewSkeleton'
import { useFormActions } from '@/hooks/useFormActions'
import { useFormData } from '@/hooks/useFormData'
import { FormViewActions } from './FormViewActions'
import { FormViewQuestions } from './FormViewQuestions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/useUserStore'
import { getUserProfile } from '@/services/user'
import { IFetchedProfile } from '@/types/user'
import { Question } from '../question/Question'
import { Button } from '@/components/ui/button'
import { createComment } from '@/services/commets'
import toast from 'react-hot-toast'

export const FormView = () => {
  const params = useParams()
  const pathName = usePathname()
  const router = useRouter()
  const formId = Number(params.id)
  const [profile, setProfile] = useState<IFetchedProfile | null>(null)
  const { user } = useUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { formData, originalFormData, isLoading, setFormData, setOriginalFormData } = useFormData(formId)
  const { isSaving, hasChanges, handleSave } = useFormActions(formData, originalFormData, setOriginalFormData)
  const isAuthor = formData?.author?.id === profile?.id
  console.log('formData:', formData)
  const [answers, setAnswers] = useState<Record<string, { answer?: string; selectedOptions?: string[] }>>({})

  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.id) {
        try {
          const profileData = await getUserProfile(user.id)
          setProfile(profileData)
        } catch (error) {
          console.error(error)
        }
      }
    }
    fetchProfile()
  }, [user])

  const handleAnswerChange = (questionId: number | undefined, value: string | string[]) => {
    if (!questionId) return

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: typeof value === 'string' ? value : undefined,
        selectedOptions: Array.isArray(value) ? value : value ? [value] : []
      }
    }))
  }

  const handleQuestionChange = (id: number | undefined, value: string) => {
    setFormData((prev) => ({
      ...prev!,
      questions: prev!.questions.map((q) => (q.id === id ? { ...q, question: value } : q))
    }))
  }

  const handleOptionChange = (questionId: number | undefined, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev!,
      questions: prev!.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, i) => (i === index ? value : opt))
            }
          : q
      )
    }))
  }

  const handleDeleteQuestion = (id: number | undefined) => {
    setFormData((prev) => ({
      ...prev!,
      questions: prev!.questions.filter((q) => q.id !== id)
    }))
  }

  const handleAddOption = (questionId: number | undefined) => {
    setFormData((prev) => ({
      ...prev!,
      questions: prev!.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), `Новый вариант ${(q.options?.length || 0) + 1}`]
            }
          : q
      )
    }))
  }

  const handleDeleteOption = (questionId: number | undefined, index: number) => {
    setFormData((prev) => ({
      ...prev!,
      questions: prev!.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, i) => i !== index)
            }
          : q
      )
    }))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!formData || active.id === over?.id) return

    setFormData((prev) => ({
      ...prev!,
      questions: arrayMove(
        prev!.questions,
        prev!.questions.findIndex((q) => q.id === active.id),
        prev!.questions.findIndex((q) => q.id === over?.id)
      )
    }))
  }

  const isFormValid = formData?.questions.every((question) => {
    const answerData = answers[question.id]
    if (question.type === 'text') {
      return !!answerData?.answer
    } else {
      return answerData?.selectedOptions && answerData.selectedOptions.length > 0
    }
  })

  const handleSubmitAnswers = async () => {
    if (!formData) return
    setIsSubmitting(true)
    try {
      await Promise.all(
        formData.questions.map(async (question) => {
          const answerData = answers[question.id]
          if (!answerData) return

          await createComment({
            questionId: Number(question.id),
            userId: profile?.id || 1,
            data: {
              answer: answerData.answer,
              selectedOptions: answerData.selectedOptions
            }
          })
        })
      )

      toast.success('Ваши ответы успешно отправлены!')
      if (!profile) {
        router.push('/login')
        return
      }
      setAnswers({})
    } catch (error) {
      console.error('Ошибка при отправке ответов:', error)
      toast.error('Произошла ошибка при отправке ответов')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    const url = `${window.location.origin}/forms/${formId}`
    navigator.clipboard.writeText(url)
    toast.success('Ссылка скопирована в буфер обмена')
  }

  if (isLoading || !formData) {
    return <FormViewSkeleton />
  }
  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10'>
      <div className='flex justify-between'>
        <Button
          variant={'outline'}
          onClick={() => window.history.back()}
          className='mb-4 w-full sm:w-auto px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
          </svg>
          Назад
        </Button>

        <Button
          variant={'outline'}
          onClick={handleShare}
          className='w-full sm:w-auto px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z'
            />
          </svg>
          Поделиться
        </Button>
      </div>

      {isAuthor && (
        <div className='flex justify-center gap-5 mb-10'>
          <Link
            className={`text-lg ${
              pathName === `/forms/${params.id}` ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
            href={`/forms/${params.id}`}
          >
            Вопросы
          </Link>
          <Link
            className={`text-lg ${
              pathName === `/forms/${params.id}/responses` ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'
            }`}
            href={`/forms/${params.id}/responses`}
          >
            Ответы
          </Link>
        </div>
      )}
      <h1 className='text-3xl font-bold mb-6 text-center'>
        <textarea
          value={formData.title}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev!, title: e.target.value }))
          }}
          className='field-sizing-content resize-none overflow-hidden text-center border-b w-full text-md focus:outline-none md:text-3xl font-bold'
          readOnly={!isAuthor}
        />
      </h1>

      {isAuthor ? (
        // Для автора - FormViewQuestions с возможностью редактирования
        <>
          <FormViewQuestions
            questions={formData.questions}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onDeleteQuestion={handleDeleteQuestion}
            onAddOption={handleAddOption}
            onDeleteOption={handleDeleteOption}
            onDragEnd={handleDragEnd}
          />
          <FormViewActions onSave={() => handleSave(formId)} isSaving={isSaving} hasChanges={hasChanges()} />
        </>
      ) : (
        // Для не автора - просто вопросы без возможности редактирования
        <div className='space-y-4'>
          {formData.questions.map((question) => (
            <Question
              key={question.id}
              {...question}
              answer={answers[question.id]?.answer || ''}
              selectedOptions={answers[question.id]?.selectedOptions || []}
              onChangeAnswer={handleAnswerChange}
              readOnlyFull={false}
              readOnly={false}
            />
          ))}
          <div className='flex flex-col items-center gap-4 mt-8 mb-4'>
            <Button
              onClick={handleSubmitAnswers}
              disabled={!isFormValid || isSubmitting}
              className='w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <span className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Отправка...
                </span>
              ) : (
                'Отправить ответы'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
