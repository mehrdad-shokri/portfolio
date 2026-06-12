import {useState} from 'react'

interface FormInputReturn {
  value: string
  error: string | null | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onInvalid: (event: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function useFormInput(initialValue = ''): FormInputReturn {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null | undefined>()
  const [isDirty, setIsDirty] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.target.value)
    setIsDirty(true)
    if (error && event.target.checkValidity()) setError(null)
  }

  const handleInvalid = (event: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault()
    setError((event.target as HTMLInputElement | HTMLTextAreaElement).validationMessage)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isDirty) event.target.checkValidity()
  }

  return {value, error, onChange: handleChange, onBlur: handleBlur, onInvalid: handleInvalid}
}
