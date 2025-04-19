import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { QuestionType } from '@/types/form-data'
import '@testing-library/jest-dom/extend-expect'
import { Question } from '@/components/shared/question/Question'
import { describe, it, expect } from '@jest/globals'

describe('Question Component', () => {
  const mockQuestion = {
    id: 1,
    question: 'Test question',
    type: 'text' as QuestionType
  }

  it('рендерится корректно', () => {
    render(<Question {...mockQuestion} />)
    expect(screen.getByDisplayValue('Test question')).toBeTruthy()
  })

  it('отображает ошибку', () => {
    render(<Question {...mockQuestion} error='Test error' />)
    expect(screen.getByText('Test error')).toBeTruthy()
  })

  it('вызывает onChangeQuestion при изменении вопроса', () => {
    const handleChange = jest.fn()
    render(<Question {...mockQuestion} onChangeQuestion={handleChange} />)

    const input = screen.getByDisplayValue('Test question')
    fireEvent.change(input, { target: { value: 'New question' } })

    expect(handleChange).toHaveBeenCalledWith(1, 'New question')
  })

  it('вызывает onDeleteQuestion при клике на удаление', () => {
    const handleDelete = jest.fn()
    render(<Question {...mockQuestion} onDeleteQuestion={handleDelete} />)

    const deleteButton = screen.getByText('Удалить')
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledWith(1)
  })

  it('отображает варианты для multiple-choice', () => {
    const props = {
      ...mockQuestion,
      type: 'multiple-choice' as QuestionType,
      options: ['Option 1', 'Option 2']
    }
    render(<Question {...props} />)

    expect(screen.getAllByRole('radio').length).toBe(2)
    expect(screen.getByDisplayValue('Option 1')).toBeTruthy()
    expect(screen.getByDisplayValue('Option 2')).toBeTruthy()
  })

  it('отображает варианты для checkbox', () => {
    const props = {
      ...mockQuestion,
      type: 'checkbox' as QuestionType,
      options: ['Check 1', 'Check 2']
    }
    render(<Question {...props} />)

    expect(screen.getAllByRole('checkbox').length).toBe(2)
    expect(screen.getByDisplayValue('Check 1')).toBeTruthy()
    expect(screen.getByDisplayValue('Check 2')).toBeTruthy()
  })

  it('рендерится корректно для textarea', () => {
    render(<Question {...mockQuestion} type='textarea' />)
    expect(screen.getByPlaceholderText('Введите ваш текст...')).toBeTruthy()
  })

  it('вызывает onChangeOption при изменении варианта', () => {
    const handleChange = jest.fn()
    const props = {
      ...mockQuestion,
      type: 'multiple-choice' as QuestionType,
      options: ['Option 1', 'Option 2'],
      onChangeOption: handleChange
    }
    render(<Question {...props} />)

    const input = screen.getAllByRole('textbox')[1]
    fireEvent.change(input, { target: { value: 'New option' } })

    expect(handleChange).toHaveBeenCalledWith(1, 0, 'New option')
  })

  it('вызывает onAddOption при клике на добавление варианта', () => {
    const handleAdd = jest.fn()
    const props = {
      ...mockQuestion,
      type: 'multiple-choice' as QuestionType,
      options: ['Option 1', 'Option 2'],
      onAddOption: handleAdd
    }
    render(<Question {...props} />)

    const addButton = screen.getByText('+ Добавить вариант')
    fireEvent.click(addButton)

    expect(handleAdd).toHaveBeenCalledWith(1)
  })

  it('отображает checkbox корректно', () => {
    const props = {
      ...mockQuestion,
      type: 'checkbox' as QuestionType,
      options: ['Check 1', 'Check 2']
    }
    render(<Question {...props} />)

    expect(screen.getAllByRole('checkbox').length).toBe(2)
  })

  it('вызывает onChangeAnswer при изменении чекбокса', () => {
    const handleChange = jest.fn()
    const props = {
      ...mockQuestion,
      type: 'checkbox' as QuestionType,
      options: ['Check 1', 'Check 2'],
      onChangeAnswer: handleChange
    }
    render(<Question {...props} />)

    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledWith(1, ['Check 1'])
  })

  it('рендерится в режиме только для чтения', () => {
    render(<Question {...mockQuestion} readOnlyFull={true} />)
    expect(screen.getByDisplayValue('Test question')).toHaveAttribute('readonly')
  })

  it('вызывает onDeleteOption при клике на удаление варианта', () => {
    const handleDelete = jest.fn()
    const props = {
      ...mockQuestion,
      type: 'multiple-choice' as QuestionType,
      options: ['Option 1', 'Option 2'],
      onDeleteOption: handleDelete
    }
    render(<Question {...props} />)

    const deleteButton = screen.getAllByRole('button')[1]
    fireEvent.click(deleteButton)

    expect(handleDelete).toHaveBeenCalledWith(1, 1)
  })
})
