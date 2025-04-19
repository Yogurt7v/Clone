import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/shared/form'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

jest.mock('@/store/useUserStore', () => ({
  useUserStore: jest.fn()
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}))

describe('LoginForm', () => {
  const mockLogin = jest.fn()
  const mockPush = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: false
    })
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  it('отображает форму логина с полями и кнопкой', () => {
    render(<LoginForm />)

    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите ваш email')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Введите ваш пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('показывает/скрывает пароль при клике на иконку', async () => {
    render(<LoginForm />)

    const passwordInput = screen.getByPlaceholderText('Введите ваш пароль') as HTMLInputElement
    const toggleButton = screen.getByTestId('icon')

    expect(passwordInput.type).toBe('password')

    await user.click(toggleButton)
    expect(passwordInput.type).toBe('text')

    await user.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  it('валидирует форму перед отправкой', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Войти' })
    const emailInput = screen.getByPlaceholderText('Введите ваш email')
    const passwordInput = screen.getByPlaceholderText('Введите ваш пароль')

    expect(submitButton).toBeDisabled()

    await user.type(emailInput, 'invalid-email')
    await user.type(passwordInput, '123')
    expect(submitButton).toBeDisabled()

    await user.clear(emailInput)
    await user.clear(passwordInput)
    await user.type(emailInput, 'valid@example.com')
    await user.type(passwordInput, 'validPassword123')

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('вызывает login с правильными данными при отправке формы', async () => {
    const TestComponent = () => {
      const formMethods = useForm()
      return (
        <FormProvider {...formMethods}>
          <LoginForm />
        </FormProvider>
      )
    }

    render(<TestComponent />)

    const testData = {
      email: 'test@example.com',
      password: 'testPassword123'
    }

    await user.type(screen.getByPlaceholderText('Введите ваш email'), testData.email)
    await user.type(screen.getByPlaceholderText('Введите ваш пароль'), testData.password)
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1)
      expect(mockLogin).toHaveBeenCalledWith(testData)
    })
  })

  it('перенаправляет на главную после успешного входа', async () => {
    mockLogin.mockResolvedValueOnce({})

    const TestComponent = () => {
      const formMethods = useForm()
      return (
        <FormProvider {...formMethods}>
          <LoginForm />
        </FormProvider>
      )
    }

    render(<TestComponent />)

    await user.type(screen.getByPlaceholderText('Введите ваш email'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Введите ваш пароль'), 'testPassword123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('показывает индикатор загрузки при отправке формы', async () => {
    ;(useUserStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
      loading: true
    })

    render(<LoginForm />)

    const submitButton = screen.getByTestId('login-button')
    expect(submitButton).toHaveAttribute('data-loading', 'true')
  })

  it('блокирует кнопку при невалидной форме', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /войти/i })
    await user.type(screen.getByPlaceholderText('Введите ваш email'), 'test@example.com')

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    })
  })
})
