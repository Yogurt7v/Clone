'use client'
import { getFormById } from '@/services/forms'
import { SingleForm } from '@/types/form'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestView() {
  const params = useParams()
  const [formData, setFormData] = useState<SingleForm | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFormById(Number(params.id))
        setFormData(data)
      } catch (error) {
        console.error('Error fetching form:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params])
  if (loading) return <div className='text-center py-8'>Загрузка...</div>
  if (!formData || !formData.SingleForm) return <div>Форма не найдена</div>

  const { author, title, questions, createdAt } = formData.SingleForm

  return (
    <div className='max-w-4xl mx-auto my-2 p-6 bg-white rounded-lg shadow-md border-2'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>{title}</h1>
        <div className='flex items-center text-gray-600'>
          <Image src={author.avatarUrl} className='w-10 h-10 rounded-full mr-3' alt={'Аватар'} />
          <div>
            <p>
              Автор: {author.firstName} {author.lastName}
            </p>
            <p className='text-sm'>Создано: {new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className='space-y-8'>
        {questions.map((question) => (
          <div key={question.id} className='border-b pb-6 last:border-b-0'>
            <h3 className='text-xl font-semibold mb-4'>{question.question}</h3>
            {question.options?.length}
            {question.options?.length && (
              <div className='mb-4'>
                <p className='text-gray-600 mb-2'>Варианты ответов:</p>
                <ul className='list-disc pl-5'>
                  {question.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
            )}

            {question.comments?.length && (
              <div className='mt-4'>
                <h4 className='font-medium text-lg mb-3'>Ответы ({question.comments.length}):</h4>
                <div className='space-y-4'>
                  {question.comments.map((comment) => (
                    <div key={comment.id} className='bg-gray-50 p-4 rounded-lg'>
                      {comment.answer && <p className='mb-2'>{comment.answer}</p>}
                      {comment.selectedOptions && (
                        <div className='text-sm text-black'>
                          {comment.selectedOptions.map((item) => question.options?.[item])}
                        </div>
                      )}
                      <div className='text-xs text-gray-500 mt-2'>{new Date(comment.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
