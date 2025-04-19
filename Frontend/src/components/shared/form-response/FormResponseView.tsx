'use client'

import { useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Question } from '../question/Question'
import * as XLSX from 'xlsx'
import { useFormData } from '@/hooks/useFormData'

export const FormResponseView = () => {
  const router = useRouter()
  const params = useParams()
  const formId = Number(params.id)

  const { formData } = useFormData(formId)

  const formRef = useRef<HTMLDivElement>(null)

  const getAnswersForQuestion = (questionId: number) => {
    if (!formData) return { answer: '', selectedOptions: [] }

    const question = formData.questions.find((q) => q.id === questionId)
    if (!question || !question.comments || question.comments.length === 0) {
      return { answer: '', selectedOptions: [] }
    }

    const comment = question.comments[Number(params.responseId) - 1]
    return {
      answer: comment.answer || '',
      selectedOptions: comment.selectedOptions || []
    }
  }

  const handleDownloadExcel = () => {
    if (!formData) return

    const headers = ['Вопрос', 'Ответ']
    const excelData = formData.questions.map((question) => {
      const answers = getAnswersForQuestion(question.id)
      const displayAnswer =
        answers.answer || (answers.selectedOptions.length > 0 ? answers.selectedOptions.join(', ') : '')

      return {
        Вопрос: question.question,
        Ответ: displayAnswer
      }
    })

    const ws = XLSX.utils.json_to_sheet(excelData, { header: headers })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ответы')

    XLSX.writeFile(wb, `${formData.title}-responses.xlsx`)
  }

  if (!formData) return <div>Загрузка...</div>

  return (
    <div ref={formRef} className='max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 mb-10'>
      <h1 className='text-3xl font-bold mb-6 text-center'>{formData.title}</h1>

      {formData.questions.map((question) => {
        const answers = getAnswersForQuestion(question.id)
        return (
          <Question
            key={question.id}
            id={question.id}
            question={question.question}
            type={question.type}
            options={question.options}
            answer={answers.answer}
            selectedOptions={answers.selectedOptions}
            readOnlyFull={true}
          />
        )
      })}

      <div className='mt-6 flex justify-center gap-5'>
        <Button variant='outline' onClick={() => router.push(`/forms/${params.id}`)}>
          Назад к форме
        </Button>
        <Button variant='outline' onClick={handleDownloadExcel}>
          Скачать ответы (Excel)
        </Button>
      </div>
    </div>
  )
}
