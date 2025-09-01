import { ChangeEvent } from 'react'

interface InputProps {
  id: string
  label: string
  type?: 'text' | 'textarea'
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  disabled?: boolean
  rows?: number
  className?: string
}

export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  rows = 4,
  className = ''
}: InputProps) {
  const baseClassName = error ? 'error__border' : 'success-border'
  const inputClassName =
    type === 'textarea'
      ? `form-textarea ${baseClassName} ${className}`.trim()
      : `form-input ${baseClassName} ${className}`.trim()

  return (
    <div>
      <label htmlFor={id} className="block mb-1">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          rows={rows}
          className={inputClassName}
          disabled={disabled}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          onChange={onChange}
          className={inputClassName}
          disabled={disabled}
        />
      )}
      {error && <p className="error__field">{error}</p>}
    </div>
  )
}
