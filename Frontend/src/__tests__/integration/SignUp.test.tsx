import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { IFormRegister } from '@/lib/formValidation'
import { SignupForm } from '@/components/shared/form'

jest.mock('@/store/useUserStore', () => ({
  useUserStore: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}))

jest.mock('../../hooks/useImageUpload.tsx', () => ({
  useImageUpload: () => ({
    image: null,
    handleImageUpload: jest.fn(),
    fileInputRef: { current: null },
    handleRemoveImage: jest.fn()
  })
}))

describe('SignupForm', () => {
  const mockRegister = jest.fn()
  const mockPush = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: false
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  it('отображает форму регистрации с полями и кнопкой', () => {
    render(<SignupForm />)

    expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Электронная почта')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Подтвердите пароль')).toBeInTheDocument()
    expect(screen.getByText('Загрузить картинку')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Регистрация' })).toBeInTheDocument()
  })

  it('показывает/скрывает пароль при клике на иконку', async () => {
    render(<SignupForm />)

    const passwordInput = screen.getByPlaceholderText('Пароль') as HTMLInputElement
    const passwordToggle = screen.getAllByTestId('icon')[0]

    const confirmInput = screen.getByPlaceholderText('Подтвердите пароль') as HTMLInputElement
    const confirmToggle = screen.getAllByTestId('icon')[1]

    // Проверка основного пароля
    expect(passwordInput.type).toBe('password')
    await user.click(passwordToggle)
    expect(passwordInput.type).toBe('text')
    await user.click(passwordToggle)
    expect(passwordInput.type).toBe('password')

    // Проверка подтверждения пароля
    expect(confirmInput.type).toBe('password')
    await user.click(confirmToggle)
    expect(confirmInput.type).toBe('text')
    await user.click(confirmToggle)
    expect(confirmInput.type).toBe('password')
  })

  it('валидирует форму перед отправкой', async () => {
    render(<SignupForm />)

    const submitButton = screen.getByTestId('signup-button')
    const firstNameInput = screen.getByPlaceholderText('Имя')
    const lastNameInput = screen.getByPlaceholderText('Фамилия')
    const emailInput = screen.getByPlaceholderText('Электронная почта')
    const passwordInput = screen.getByPlaceholderText('Пароль')
    const confirmInput = screen.getByPlaceholderText('Подтвердите пароль')

    expect(submitButton).toBeDisabled()

    // Заполняем невалидные данные
    await user.type(firstNameInput, 'A')
    await user.type(lastNameInput, 'B')
    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, '123')
    await user.type(confirmInput, '456')

    expect(submitButton).toBeDisabled()

    // Заполняем валидные данные
    await user.clear(firstNameInput)
    await user.clear(lastNameInput)
    await user.clear(emailInput)
    await user.clear(passwordInput)
    await user.clear(confirmInput)

    await user.type(firstNameInput, 'ValidName')
    await user.type(lastNameInput, 'ValidLastName')
    await user.type(emailInput, 'valid@example.com')
    await user.type(passwordInput, 'ValidPassword123!')
    await user.type(confirmInput, 'ValidPassword123!')

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('вызывает register с правильными данными при отправке формы', async () => {
    const TestComponent = () => {
      const formMethods = useForm<IFormRegister>()
      return (
        <FormProvider {...formMethods}>
          <SignupForm />
        </FormProvider>
      )
    }

    render(<TestComponent />)

    const testData = {
      firstName: 'Иван',
      lastName: 'Иванов',
      email: 'test@example.com',
      password: 'ValidPassword123!',
      confirmPassword: 'ValidPassword123!'
    }

    await user.type(screen.getByPlaceholderText('Имя'), testData.firstName)
    await user.type(screen.getByPlaceholderText('Фамилия'), testData.lastName)
    await user.type(screen.getByPlaceholderText('Электронная почта'), testData.email)
    await user.type(screen.getByPlaceholderText('Пароль'), testData.password)
    await user.type(screen.getByPlaceholderText('Подтвердите пароль'), testData.confirmPassword)

    await user.click(screen.getByRole('button', { name: 'Регистрация' }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1)
      expect(mockRegister).toHaveBeenCalledWith({
        firstName: testData.firstName,
        lastName: testData.lastName,
        email: testData.email,
        password: testData.password,
        confirmPassword: testData.confirmPassword
      })
    })
  })

  it('перенаправляет на главную после успешной регистрации', async () => {
    mockRegister.mockResolvedValueOnce({})

    const TestComponent = () => {
      const formMethods = useForm<IFormRegister>()
      return (
        <FormProvider {...formMethods}>
          <SignupForm />
        </FormProvider>
      )
    }

    render(<TestComponent />)

    await user.type(screen.getByPlaceholderText('Имя'), 'Иван')
    await user.type(screen.getByPlaceholderText('Фамилия'), 'Иванов')
    await user.type(screen.getByPlaceholderText('Электронная почта'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Пароль'), 'ValidPassword123!')
    await user.type(screen.getByPlaceholderText('Подтвердите пароль'), 'ValidPassword123!')

    await user.click(screen.getByRole('button', { name: 'Регистрация' }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('показывает индикатор загрузки при отправке формы', async () => {
    ;(useUserStore as unknown as jest.Mock).mockReturnValue({
      register: mockRegister,
      loading: true
    })

    render(<SignupForm />)

    const submitButton = screen.getByTestId('signup-button')
    expect(submitButton).toHaveAttribute('data-loading', 'true')
  })

  it('блокирует кнопку при невалидной форме', async () => {
    render(<SignupForm />)

    const submitButton = screen.getByRole('button', { name: 'Регистрация' })
    await user.type(screen.getByPlaceholderText('Имя'), 'Иван')

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
