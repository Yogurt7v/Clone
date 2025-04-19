'use client'

import React, { useEffect, useState } from 'react'
import { Container, Title } from '@/components/shared'
import { ClickItem } from '@/components/shared/form-click/ClickItem'
import { useParams } from 'next/navigation'
import { getFormById } from '@/services/forms'
import { FormTypeById } from '@/types/form'
import { Skeleton } from '@/components/ui/skeleton'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { VictoryPie, VictoryTheme, VictoryBar, VictoryLabel } from 'victory'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const FormClick = () => {
  const params = useParams()
  const [responses, setResponses] = useState<FormTypeById | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchOrder, setSearchOrder] = useState('ASC')
  const [showStatistics, setShowStatistics] = useState(false)
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const formId = Number(params.id)

  useEffect(() => {
    const fetchDataResponses = async () => {
      try {
        setIsLoading(true)
        const res = await getFormById(formId)
        setResponses(res)
      } catch (error) {
        console.error('Ошибка при загрузке откликов:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDataResponses()
  }, [formId])

  const comments = responses?.SingleForm?.questions?.[0]?.comments || []

  useEffect(() => {}, [sortOrder])

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  const handleDownloadExcel = () => {
    if (!responses?.SingleForm || !responses?.SingleForm.questions) return

    const headers: string[] = ['Вопрос']
    const excelData: Array<{ [key: string]: string }> = []

    responses.SingleForm.questions.forEach((question) => {
      const row: { [key: string]: string } = { Вопрос: question.question }

      question.comments?.forEach((comment, index) => {
        const columnName = `Отклик ${index + 1} (${comment.author.firstName} ${comment.author.lastName})`
        headers[index + 1] = columnName

        const displayAnswer =
          comment.answer ||
          (Array.isArray(comment.selectedOptions) && comment.selectedOptions.length > 0
            ? comment.selectedOptions.join(', ')
            : '')

        row[columnName] = displayAnswer
      })

      excelData.push(row)
    })

    const ws = XLSX.utils.json_to_sheet(excelData, { header: headers })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ответы')

    XLSX.writeFile(wb, `responses.xlsx`)
  }

  const getStatisticsData = () => {
    if (!responses?.SingleForm?.questions) return []

    return responses.SingleForm.questions
      .map((question) => {
        if (!['checkbox', 'multiple-choice'].includes(question.type)) return null

        const stats: { [key: string]: number } = {}

        question.comments?.forEach((comment) => {
          const options = comment.selectedOptions || []
          options.forEach((option) => {
            stats[option] = (stats[option] || 0) + 1
          })
        })

        return {
          question: question.question,
          type: question.type,
          data: Object.entries(stats).map(([x, y]) => ({ x, y })),
          options: question.options
        }
      })
      .filter(Boolean)
  }

  const statisticsData = getStatisticsData()

  if (isLoading) {
    return (
      <Container>
        <Title text={`Отклик на формы № ${params.id}`} className={'text-center mb-10 mt-10'} />
        <div className={'flex flex-col gap-2'}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className='h-20 w-full rounded-lg' />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Title text={`Отклик на форму № ${params.id}`} className={'text-center mb-10 mt-10'} />

      {comments.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-gray-500 text-lg'>Откликов пока нет</p>
        </div>
      ) : (
        <>
          <div className={'justify-end gap-5 flex-col sm:flex sm:flex-row'}>
            <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Сортировка по дате' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Сначала новые</SelectItem>
                <SelectItem value='oldest'>Сначала старые</SelectItem>
              </SelectContent>
            </Select>
            {/* <div className={'mb-10 flex flex-col gap-2 sm:flex-row'}>
              <Date name={'От'} className={'sm:w-[100px] justify-start text-left font-normal'} />
              <Date name={'До'} className={'sm:w-[100px] justify-start text-left font-normal'} />
            </div> */}
          </div>

          {/* Кнопки управления */}
          <div className='flex gap-4 justify-center mb-8'>
            <Button variant='outline' onClick={handleDownloadExcel}>
              Скачать все ответы (Excel)
            </Button>
            <Button variant='outline' onClick={() => setShowStatistics(!showStatistics)}>
              {showStatistics ? 'Скрыть статистику' : 'Показать статистику'}
            </Button>
          </div>

          {showStatistics && (
            <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
              {statisticsData.map((stats, index) => {
                if (!stats) return null

                return (
                  <div key={index} className='bg-white p-4 rounded-lg shadow-md'>
                    <h3 className='text-lg font-semibold mb-4'>{stats.question}</h3>
                    {stats.data.length > 0 ? (
                      <div className='h-100 flex flex-col items-center'>
                        {stats.type === 'checkbox' ? (
                          <VictoryPie
                            data={stats.data}
                            theme={VictoryTheme.material}
                            colorScale='qualitative'
                            innerRadius={20}
                            labelRadius={80}
                            labels={({ datum }) => `${datum.x} (${datum.y})`}
                            labelComponent={<VictoryLabel angle={0} style={{ fontSize: 20, fontWeight: 'bold' }} />}
                          />
                        ) : (
                          <VictoryBar
                            data={stats.data}
                            style={{ data: { fill: '#4f46e5' } }}
                            theme={VictoryTheme.material}
                            labels={({ datum }) => `${datum.x} (${datum.y})`}
                            labelComponent={<VictoryLabel dy={-10} style={{ fontSize: 20, fontWeight: 'bold' }} />}
                          />
                        )}
                      </div>
                    ) : (
                      <p className='text-gray-500 text-center'>Нет данных для отображения</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className={'flex flex-col gap-2'}>
            {sortedComments.map((comment, index) => (
              <ClickItem key={comment.id} id={index + 1} updatedAt={comment.updatedAt} comment={comment} />
            ))}
          </div>
        </>
      )}
    </Container>
  )
}
