import { updateProfileSchema } from '@/lib/formValidation'
import { z } from 'zod'

export const validateProfile = (name: string, fullName: string) => {
  const validationErrors = { firstName: '', lastName: '' }

  try {
    updateProfileSchema.parse({ firstName: name, lastName: fullName })
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((issue) => {
        if (issue.path[0] === 'firstName') validationErrors.firstName = issue.message
        if (issue.path[0] === 'lastName') validationErrors.lastName = issue.message
      })
    }
  }
  return validationErrors
}
