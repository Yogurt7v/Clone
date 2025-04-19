'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { QuestionType, SurveyQuestion } from '@/types/question'
// import { surveySchema } from '@/lib/formValidation' // Убираем импорт, т.к. не используем
import { Question } from '../question/Question'
import { arrayMove } from '@dnd-kit/sortable'
import { DragAndDropProvider } from '@/providers/DragAndDropProvider'
import { SortableList } from '../drag-and-drop/SortableList'
import { SortableItem } from '../drag-and-drop/SortableItem'
import { DragEndEvent } from '@dnd-kit/core'
import { useUserStore } from '@/store/useUserStore'
import { createForm } from '@/services/forms'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Text, List, CheckSquare, Type } from 'lucide-react'

export const CreateForm = () => {
  const router = useRouter()
  const { user } = useUserStore()
  const [formTitle, setFormTitle] = useState<string>('Ваша новая форма опроса')
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  // Убираем состояние ошибок
  // const [errors, setErrors] = useState<{ title?: string; questions?: string[] }>({})
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formCreated, setFormCreated] = useState<boolean>(false)
  const lastQuestionRef = useRef<HTMLDivElement>(null)
  const [shouldScroll, setShouldScroll] = useState<boolean>(false)

  const authorId = user?.id

  const addQuestion = (type: QuestionType) => {
    const newQuestion: SurveyQuestion = {
      id: Date.now(),
      question: '',
      type,
      options: type === 'multiple-choice' || type === 'checkbox' ? ['Option 1', 'Option 2'] : []
    }
    setQuestions([...questions, newQuestion])
    setShouldScroll(true)
  }

  useEffect(() => {
    if (shouldScroll && lastQuestionRef.current) {
      lastQuestionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
      setShouldScroll(false)
    }
  }, [shouldScroll])

  const handleChangeFormTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormTitle(e.target.value)
  }

  const handleChangeQuestion = (id: number | undefined, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, question: value } : q)))
  }

  const handleChangeOption = (questionId: number | undefined, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options?.map((opt, idx) => (idx === optionIndex ? value : opt)) } : q
      )
    )
  }

  const handleDeleteQuestion = (id: number | undefined) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formTitle.trim() === '' || questions.length === 0 || questions.some((q) => q.question.trim() === '')) {
      // Просто не отправляем форму, кнопка disabled, но на всякий случай
      return
    }

    if (!authorId) {
      toast.error('Не удалось получить идентификатор пользователя.')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = {
        author: authorId,
        title: formTitle,
        questions: questions.map((q) => ({ ...q, id: Number(q.id) }))
      }

      const createdForm = await createForm(formData)
      const createdFormId = createdForm['Новая форма'].id

      setFormTitle('Новая форма')
      setQuestions([])
      // setErrors({}) // убираем
      setFormCreated(!formCreated)
      toast.success('Форма успешно создана!')
      router.push(`/forms/${createdFormId}`)
    } catch (error) {
      console.error('Error during form creation:', error)
      toast.error('Ошибка при создании формы.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setQuestions((prevQuestions) => {
        const oldIndex = prevQuestions.findIndex((q) => q.id === active.id)
        const newIndex = prevQuestions.findIndex((q) => q.id === over?.id)
        return arrayMove(prevQuestions, oldIndex, newIndex)
      })
    }
  }

  const handleAddOption = (questionId: number | undefined) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] } : q
      )
    )
  }

  const handleDeleteOption = (questionId: number | undefined, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, idx) => idx !== optionIndex)
            }
          : q
      )
    )
  }

  const isFormValid =
    formTitle.trim() !== '' && questions.length > 0 && questions.every((q) => q.question.trim() !== '') && !isSubmitting

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col lg:flex-row gap-2'>
        <div className='lg:flex-1 lg:max-w-4xl mx-auto'>
          <Card className='p-6 sm:p-8 bg-white rounded-xl shadow-lg'>
            <div className='space-y-6'>
              <div className='text-center'>
                <textarea
                  value={formTitle}
                  onChange={handleChangeFormTitle}
                  className='field-sizing-content resize-none overflow-hidden w-full text-center text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors duration-200'
                  placeholder='Введите название формы'
                />
              </div>

              <DragAndDropProvider onDragEnd={handleDragEnd}>
                <SortableList items={questions.map((q) => q.id)}>
                  {questions.map((q, index) => (
                    <SortableItem key={q.id} id={q.id}>
                      <div ref={index === questions.length - 1 ? lastQuestionRef : null}>
                        <Question
                          id={q.id}
                          question={q.question}
                          type={q.type}
                          options={q.options || []}
                          onChangeQuestion={handleChangeQuestion}
                          onDeleteQuestion={handleDeleteQuestion}
                          onChangeOption={handleChangeOption}
                          onAddOption={handleAddOption}
                          onDeleteOption={handleDeleteOption}
                        />
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </DragAndDropProvider>

              <div className='flex justify-center'>
                <Button
                  type='submit'
                  disabled={!isFormValid}
                  loading={isSubmitting}
                  className='px-8 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  onClick={handleSubmit}
                >
                  Опубликовать
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className='w-full  lg:w-56 lg:ml-4 sm:mx-auto sm:w-115 '>
          <div className='sticky top-6'>
            <Card className='p-3 bg-white rounded-xl shadow-lg'>
              <div className='space-y-2'>
                <div className='lg:hidden mb-4'>
                  <h3 className='text-lg font-semibold text-gray-700'>Добавить вопрос</h3>
                </div>
                <Button
                  type='button'
                  onClick={() => addQuestion('text')}
                  className='w-full flex items-center justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 text-sm'
                >
                  <Text className='h-4 w-4' />
                  Короткий текст
                </Button>
                <Button
                  type='button'
                  onClick={() => addQuestion('multiple-choice')}
                  className='w-full flex items-center justify-start gap-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200 text-sm'
                >
                  <List className='h-4 w-4' />
                  Выбор
                </Button>
                <Button
                  type='button'
                  onClick={() => addQuestion('checkbox')}
                  className='w-full flex items-center justify-start gap-2 bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200 text-sm'
                >
                  <CheckSquare className='h-4 w-4' />
                  Флажки
                </Button>
                <Button
                  type='button'
                  onClick={() => addQuestion('textarea')}
                  className='w-full flex items-center justify-start gap-2 bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 text-sm'
                >
                  <Type className='h-4 w-4' />
                  Длинный текст
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
