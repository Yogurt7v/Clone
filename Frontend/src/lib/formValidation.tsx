import { z } from 'zod'

export const passwordSchema = z.string().min(4, { message: 'Введите минимум 4 символа' })

export const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректную почту' }),
  password: passwordSchema
})
export const profileSchema = z.object({
  name: z.string().min(2, { message: 'Введите имя' }),
  fullName: z.string().min(2, { message: 'Введите фамилию' }),
  email: z.string().email({ message: 'Введите корректную почту' })
})

export const registerSchema = loginSchema
  .merge(
    z.object({
      firstName: z.string().min(2, { message: 'Введите имя' }),
      lastName: z.string().min(2, { message: 'Введите фамилию' }),
      confirmPassword: passwordSchema
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword']
  })

export const questionSchema = z.object({
  id: z.string(), // Добавьте id в схему
  question: z.string().min(1, 'Вопрос не может быть пустым'),
  type: z.string(),
  options: z.array(z.string()).optional()
})

export const surveySchema = z.object({
  title: z.string().min(1, 'Название формы не может быть пустым'),
  questions: z.array(questionSchema).min(1, 'Добавьте хотя бы один вопрос')
})
// export const questionSchema = z.object({
//     question: z.string().min(1, 'Вопрос не может быть пустым'),
//     type: z.string(),
//     options: z.array(z.string()).optional()
// })

// export const surveySchema = z.object({
//     title: z.string().min(1, 'Название формы обязательно для заполнения'),
//     questions: z.array(questionSchema)
// })

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'Имя должно быть заполнено'),
  lastName: z.string().min(1, 'Фамилия должна быть заполнена')
})

export type IFormRegister = z.infer<typeof registerSchema>
export type IFormLogin = z.infer<typeof loginSchema>
export type IProfile = z.infer<typeof profileSchema>
