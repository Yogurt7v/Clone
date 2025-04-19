import React, { ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/react'
import { FormInput } from '@/components/shared'
import { FormProvider, useForm } from 'react-hook-form'

interface WrapperProps {
  children: ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('FormInput', () => {
  it('Отобразить поле Input и Placeholder', () => {
    render(
      <Wrapper>
        <FormInput name='test' label='Test Label' placeholder='Enter text' type='text' />
      </Wrapper>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter tex/i)).toBeInTheDocument()
  })

  it('Вызови onIconClick когда нажмешь на кнопку', async () => {
    const onIconClick = jest.fn()

    render(
      <Wrapper>
        <FormInput name='password' type='password' icon={<span>🔍</span>} onIconClick={onIconClick} />
      </Wrapper>
    )
    await waitFor(() => expect(screen.getByTestId('icon')).toBeInTheDocument())

    await userEvent.click(screen.getByTestId('icon'))

    expect(onIconClick).toHaveBeenCalledTimes(1)
  })

  it('Очищай поле при клике на кнопку clearButton', async () => {
    render(
      <Wrapper>
        <FormInput name='text' type='text' />
      </Wrapper>
    )
    const input = (await screen.findByRole('textbox')) as HTMLInputElement
    await userEvent.type(input, 'hello')
    expect(input.value).toBe('hello')
  })
})
