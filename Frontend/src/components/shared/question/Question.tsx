'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { QuestionType } from '@/types/form-data'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { VictoryPie, VictoryTheme } from 'victory'

interface QuestionProps {
  id?: number | undefined
  question: string
  type: QuestionType
  options?: string[]
  answer?: string | string[]
  selectedOptions?: string[]
  error?: string
  readOnly?: boolean
  readOnlyFull?: boolean
  onChangeQuestion?: (id: number | undefined, value: string) => void
  onChangeOption?: (questionId: number | undefined, optionIndex: number, value: string) => void
  onDeleteQuestion?: (id: number | undefined) => void
  onAddOption?: (questionId: number | undefined) => void
  onDeleteOption?: (questionId: number | undefined, optionIndex: number) => void
  onChangeAnswer?: (questionId: number | undefined, value: string | string[]) => void
}

export const Question: FC<QuestionProps> = ({
  id,
  question,
  type,
  options = [],
  answer,
  selectedOptions,
  error,
  readOnly = false,
  readOnlyFull = false,
  onChangeQuestion,
  onChangeOption,
  onDeleteQuestion,
  onAddOption,
  onDeleteOption,
  onChangeAnswer
}) => {
  const pathname = usePathname()
  const isResponse = pathname ? pathname.includes('response') : false

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeQuestion?.(id, e.target.value)
  }

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    onChangeOption?.(id, index, e.target.value)
  }

  const handleAnswerChange = (value: string | string[]) => {
    onChangeAnswer?.(id, value)
  }

  return (
    <div className='border p-4 rounded-md shadow-md mb-4 bg-gray-50'>
      <div className='flex justify-between  mb-6 relative'>
        <Textarea
          value={question}
          onChange={handleQuestionChange}
          className={`text-base resize-none min-h-[40px] md:text-xl font-semibold w-full border outline-none focus:border-blue-600 focus:border-2 ${
            error && 'border-red-400'
          } ${readOnlyFull && 'border-none'}`}
          placeholder='Введите ваш вопрос'
          readOnly={readOnlyFull}
        />
        {!readOnlyFull && onDeleteQuestion && (
          <Button variant='link' className='cursor-pointer text-red-500' onClick={() => onDeleteQuestion(id)}>
            Удалить
          </Button>
        )}
        {error && <p className='text-[12px] text-red-500 md:text-sm absolute left-0 bottom-[-18px]'>{error}</p>}
      </div>

      {type === 'text' && (
        <Input
          value={(answer as string) || ''}
          onChange={(e) => {
            console.log('e:', e.target.value)
            handleAnswerChange(e.target.value)
          }}
          className='text-md md:text-lg w-full p-2 border rounded-md'
          placeholder='Введите ответ'
          readOnly={readOnly}
        />
      )}

      {type === 'textarea' && (
        <Textarea
          value={(answer as string) || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
          className='text-md md:text-lg focus:border-blue-600 focus:border-2'
          placeholder='Введите ваш текст...'
          readOnly={readOnly}
        />
      )}
      {type === 'multiple-choice' && (
        <RadioGroup
          value={(Array.isArray(selectedOptions) && selectedOptions[0]) || ''}
          onValueChange={(value) => handleAnswerChange(value)}
          disabled={readOnly}
        >
          {options.map((option, index) => (
            <div key={index} className='flex items-center mb-2 gap-2'>
              <RadioGroupItem value={option} id={`${id}-option-${index}`} />
              <Input
                value={option}
                onChange={(e) => handleOptionChange(e, index)}
                className='text-sm md:text-md w-full p-2 border-none outline-none'
                placeholder={`Вариант ${index + 1}`}
                readOnly={readOnlyFull}
              />
              {!readOnlyFull && onDeleteOption && (
                <Button
                  type='button'
                  variant='ghost'
                  className='text-red-500 h-8 w-8 p-2'
                  onClick={() => onDeleteOption(id, index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
          {!readOnlyFull && onAddOption && (
            <div onClick={(e) => e.stopPropagation()}>
              <Button
                type='button'
                variant='outline'
                className='mt-2 hover:bg-black hover:text-white transition-colors duration-200'
                onClick={(e) => {
                  e.preventDefault()
                  onAddOption(id)
                }}
              >
                + Добавить вариант
              </Button>
            </div>
          )}
        </RadioGroup>
      )}

      {type === 'checkbox' && (
        <>
          {isResponse && selectedOptions && (
            <VictoryPie
              padAngle={2}
              innerRadius={40}
              data={options
                .map((option) => ({
                  x: option,
                  y: selectedOptions.length
                }))
                .filter((item) => item.y > 0)}
              colorScale={options.map((option) =>
                selectedOptions.includes(option) ? `#${Math.floor(Math.random() * 16777215).toString(16)}` : '#FFFFFF'
              )}
              theme={VictoryTheme.clean}
            />
          )}
          <div>
            {options.map((option, index) => (
              <div key={index} className='flex items-center mb-2 gap-2'>
                <Checkbox
                  id={`${id}-option-${index}`}
                  checked={Array.isArray(selectedOptions) && selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    const newOptions = Array.isArray(selectedOptions) ? [...selectedOptions] : []
                    if (checked) {
                      newOptions.push(option)
                    } else {
                      const index = newOptions.indexOf(option)
                      if (index > -1) newOptions.splice(index, 1)
                    }
                    handleAnswerChange(newOptions)
                  }}
                  disabled={readOnlyFull}
                />
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(e, index)}
                  className='text-sm md:text-md w-full p-2 border-none outline-none'
                  placeholder={`Вариант ${index + 1}`}
                  readOnly={readOnlyFull}
                />
                {!readOnlyFull && onDeleteOption && (
                  <Button
                    variant='ghost'
                    className='text-red-500 h-8 w-8 p-2'
                    onClick={() => onDeleteOption(id, index)}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            {!readOnlyFull && onAddOption && (
              <div onClick={(e) => e.stopPropagation()}>
                <Button
                  type='button'
                  variant='outline'
                  className='mt-2 hover:bg-black hover:text-white transition-colors duration-200'
                  onClick={(e) => {
                    e.preventDefault()
                    onAddOption(id)
                  }}
                >
                  + Добавить вариант
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
