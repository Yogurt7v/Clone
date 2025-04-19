import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { useUserStore } from '@/store/useUserStore'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { CreateForm } from '@/components/shared/create-form'
import * as formsModule from '@/services/forms' // Импорт модуля для мокирования

jest.mock('@/store/useUserStore')
jest.mock('react-hot-toast')
jest.mock('next/navigation')
jest.mock('@/services/forms', () => ({
  createForm: jest.fn()
}))

const mockUser = {
  id: 'user-123',
  name: 'Test User'
}

const mockRouter = {
  push: jest.fn()
}

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn()
})

beforeEach(() => {
  ;(useUserStore as unknown as jest.Mock).mockReturnValue({
    user: mockUser
  })
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  ;(toast.error as jest.Mock).mockImplementation(() => {})
  ;(toast.success as jest.Mock).mockImplementation(() => {})
  jest.clearAllMocks()
})

describe('CreateForm Component', () => {
  it('рендерится корректно с начальным состоянием', () => {
    render(<CreateForm />)

    expect(screen.getByDisplayValue('Ваша новая форма опроса')).toBeInTheDocument()
    expect(screen.getByText('Опубликовать')).toBeInTheDocument()
    expect(screen.getByText('Короткий текст')).toBeInTheDocument()
    expect(screen.getByText('Выбор')).toBeInTheDocument()
    expect(screen.getByText('Флажки')).toBeInTheDocument()
    expect(screen.getByText('Длинный текст')).toBeInTheDocument()
  })

  it('позволяет изменить заголовок формы', () => {
    render(<CreateForm />)

    const titleInput = screen.getByDisplayValue('Ваша новая форма опроса')
    fireEvent.change(titleInput, { target: { value: 'Новый заголовок' } })

    expect(titleInput).toHaveValue('Новый заголовок')
  })

  it('добавляет вопрос типа "text" при клике на кнопку', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Короткий текст'))

    expect(screen.getByPlaceholderText('Введите ответ')).toBeInTheDocument()
  })

  it('добавляет вопрос типа "multiple-choice" при клике на кнопку', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Выбор'))

    expect(screen.getAllByRole('radio').length).toBe(2)
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument()
  })

  it('добавляет вопрос типа "checkbox" при клике на кнопку', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Флажки'))

    expect(screen.getAllByRole('checkbox').length).toBe(2)
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument()
  })

  it('добавляет вопрос типа "textarea" при клике на кнопку', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Длинный текст'))

    expect(screen.getByPlaceholderText('Введите ваш текст...')).toBeInTheDocument()
  })

  it('удаляет вопрос при клике на кнопку удаления', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Короткий текст'))
    expect(screen.getByPlaceholderText('Введите ответ')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Удалить'))
    expect(screen.queryByPlaceholderText('Введите ответ')).not.toBeInTheDocument()
  })

  it('добавляет новый вариант в вопрос с выбором', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Выбор'))

    fireEvent.click(screen.getByText('+ Добавить вариант'))

    expect(screen.getAllByRole('radio').length).toBe(3)
    expect(screen.getByDisplayValue('Option 3')).toBeInTheDocument()
  })

  it('удаляет вариант из вопроса с выбором', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Выбор'))

    const deleteButtons = screen.getAllByText('×')
    fireEvent.click(deleteButtons[0])

    expect(screen.getAllByRole('radio').length).toBe(1)
    expect(screen.queryByDisplayValue('Option 1')).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument()
  })

  it('блокирует кнопку отправки при пустом заголовке формы', () => {
    render(<CreateForm />)

    const titleInput = screen.getByDisplayValue('Ваша новая форма опроса')
    fireEvent.change(titleInput, { target: { value: '' } })

    expect(screen.getByText('Опубликовать')).toBeDisabled()
  })

  it('блокирует кнопку отправки при пустом вопросе', () => {
    render(<CreateForm />)

    fireEvent.click(screen.getByText('Короткий текст'))

    const questionInput = screen.getByPlaceholderText('Введите ваш вопрос')
    fireEvent.change(questionInput, { target: { value: '' } })

    expect(screen.getByText('Опубликовать')).toBeDisabled()
  })

  it('отправляет форму при валидных данных', async () => {
    const mockCreateForm = jest.mocked(formsModule.createForm)
    mockCreateForm.mockResolvedValueOnce({
      'Новая форма': { id: 'form-123' }
    })

    render(<CreateForm />)

    const titleInput = screen.getByDisplayValue('Ваша новая форма опроса')
    fireEvent.change(titleInput, { target: { value: 'Тестовая форма' } })

    fireEvent.click(screen.getByText('Короткий текст'))

    const questionInput = screen.getByPlaceholderText('Введите ваш вопрос')
    fireEvent.change(questionInput, { target: { value: 'Тестовый вопрос' } })

    fireEvent.click(screen.getByText('Опубликовать'))

    await waitFor(() => {
      expect(mockCreateForm).toHaveBeenCalledWith({
        author: 'user-123',
        title: 'Тестовая форма',
        questions: [
          {
            id: expect.any(Number),
            question: 'Тестовый вопрос',
            type: 'text',
            options: []
          }
        ]
      })

      expect(toast.success).toHaveBeenCalledWith('Форма успешно создана!')
      expect(mockRouter.push).toHaveBeenCalledWith('/forms/form-123')
    })
  })

  it('обрабатывает ошибку при создании формы', async () => {
    const mockCreateForm = jest.mocked(formsModule.createForm)
    mockCreateForm.mockRejectedValueOnce(new Error('Ошибка создания'))

    render(<CreateForm />)

    const titleInput = screen.getByDisplayValue('Ваша новая форма опроса')
    fireEvent.change(titleInput, { target: { value: 'Тестовая форма' } })

    fireEvent.click(screen.getByText('Короткий текст'))

    const questionInput = screen.getByPlaceholderText('Введите ваш вопрос')
    fireEvent.change(questionInput, { target: { value: 'Тестовый вопрос' } })

    fireEvent.click(screen.getByText('Опубликовать'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Ошибка при создании формы.')
    })
  })

  it('показывает ошибку при отсутствии пользователя', async () => {
    ;(useUserStore as unknown as jest.Mock).mockReturnValue({
      user: null
    })

    render(<CreateForm />)

    const titleInput = screen.getByDisplayValue('Ваша новая форма опроса')
    fireEvent.change(titleInput, { target: { value: 'Тестовая форма' } })

    fireEvent.click(screen.getByText('Короткий текст'))

    const questionInput = screen.getByPlaceholderText('Введите ваш вопрос')
    fireEvent.change(questionInput, { target: { value: 'Тестовый вопрос' } })

    fireEvent.click(screen.getByText('Опубликовать'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Не удалось получить идентификатор пользователя.')
    })
  })
})
