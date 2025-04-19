import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useFormData } from '@/hooks/useFormData'
import { useParams, useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { FormResponseView } from '@/components/shared/form-response/FormResponseView'

jest.mock('@/hooks/useFormData')
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/forms/1/response/1')
}))
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn().mockReturnValue({}),
    book_new: jest.fn().mockReturnValue({}),
    book_append_sheet: jest.fn()
  },
  writeFile: jest.fn()
}))

const mockFormData = {
  id: 1,
  title: 'Test Form',
  questions: [
    {
      id: 1,
      question: 'Question 1',
      type: 'text',
      comments: [{ answer: 'Answer 1' }]
    },
    {
      id: 2,
      question: 'Question 2',
      type: 'multiple-choice',
      options: ['Option 1', 'Option 2'],
      comments: [{ selectedOptions: ['Option 1'] }]
    }
  ]
}

describe('FormResponseView', () => {
  beforeEach(() => {
    ;(useParams as jest.Mock).mockReturnValue({ id: '1', responseId: '1' })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    })
    ;(useFormData as jest.Mock).mockReturnValue({
      formData: mockFormData,
      isLoading: false
    })
  })

  it('отображает заголовок формы и вопросы', () => {
    render(<FormResponseView />)
    expect(screen.getByText('Test Form')).toBeInTheDocument()
    expect(screen.getByText('Question 1')).toBeInTheDocument()
    expect(screen.getByText('Question 2')).toBeInTheDocument()
  })

  it('отображает ответы на каждый вопрос', () => {
    render(<FormResponseView />)
    expect(screen.getByDisplayValue('Answer 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
  })

  it('переходит обратно к форме при нажатии кнопки "Назад к форме"', async () => {
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })

    render(<FormResponseView />)
    fireEvent.click(screen.getByText('Назад к форме'))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/forms/1')
    })
  })

  it('загружает ответы в виде файла Excel при нажатии кнопки "Скачать ответы (Excel)"', () => {
    render(<FormResponseView />)
    fireEvent.click(screen.getByText('Скачать ответы (Excel)'))

    expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(
      [
        { Вопрос: 'Question 1', Ответ: 'Answer 1' },
        { Вопрос: 'Question 2', Ответ: 'Option 1' }
      ],
      { header: ['Вопрос', 'Ответ'] }
    )
    expect(XLSX.utils.book_new).toHaveBeenCalled()
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
    expect(XLSX.writeFile).toHaveBeenCalledWith({}, 'Test Form-responses.xlsx')
  })

  it('отображает сообщение о загрузке во время загрузки данных формы', () => {
    ;(useFormData as jest.Mock).mockReturnValue({
      formData: null,
      isLoading: true
    })
    render(<FormResponseView />)
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
  })

  it('не отображает форму, если данные формы равны null', () => {
    ;(useFormData as jest.Mock).mockReturnValue({
      formData: null,
      isLoading: false
    })
    render(<FormResponseView />)
    expect(screen.queryByText('Test Form')).toBeNull()
  })
})
