import React from 'react'


export const useFormField = (initialValue: string) => {

  const [value, setValue] = React.useState(initialValue)
  const [isTouched, setIsTouched] = React.useState(false)


  // Обработчик изменения полей
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setIsTouched(true)
  }

  return {handleChange, value, setValue, isTouched, setIsTouched}
}