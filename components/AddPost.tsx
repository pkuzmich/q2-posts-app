'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPost } from '@/lib/jsonbin'
import Input from './Input'

export default function AddPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdPostId, setCreatedPostId] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    content: '',
    author: ''
  })
  const router = useRouter()

  // Client-side validation functions
  const validateTitle = (value: string) => {
    if (!value.trim()) {
      return 'Název je povinný'
    }
    if (value.trim().length < 3) {
      return 'Název musí být minimálně 3 znaky dlouhý'
    }
    return ''
  }

  const validateContent = (value: string) => {
    if (!value.trim()) {
      return 'Obsah je povinný'
    }
    if (value.trim().length < 10) {
      return 'Obsah musí být minimálně 10 znaků dlouhý'
    }
    return ''
  }

  const validateAuthor = (value: string) => {
    if (!value.trim()) {
      return 'Autor je povinný'
    }
    return ''
  }

  // Handle input changes with real-time validation
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setTitle(value)
    setValidationErrors((prev) => ({
      ...prev,
      title: validateTitle(value)
    }))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setValidationErrors((prev) => ({
      ...prev,
      content: validateContent(value)
    }))
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setAuthor(value)
    setValidationErrors((prev) => ({
      ...prev,
      author: validateAuthor(value)
    }))
  }

  const clearForm = () => {
    setTitle('')
    setContent('')
    setAuthor('')
    setValidationErrors({
      title: '',
      content: '',
      author: ''
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation before submission
    const titleError = validateTitle(title)
    const contentError = validateContent(content)
    const authorError = validateAuthor(author)

    setValidationErrors({
      title: titleError,
      content: contentError,
      author: authorError
    })

    // Check if there are any validation errors
    if (titleError || contentError || authorError) {
      setError('Opravte prosím výše uvedené chyby ověření.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const newPost = await createPost(title.trim(), content.trim(), author.trim())

      // Clear form and show success message
      clearForm()
      setCreatedPostId(String(newPost.id))
      setSuccess(true)
      setIsSubmitting(false)

      // Redirect after showing success message
      setTimeout(() => {
        router.push(`/posts/${newPost.id}`)
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Nepodařilo se vytvořit článek')
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="add-post">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Článek úspěšně vytvořen!</h2>
          <p className="redirect-info">Přesměrování na článek za chvíli...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="add-post">
      <form onSubmit={handleSubmit} className="add-post__form">
        {error && <div className="error__info">{error}</div>}
        <Input
          id="title"
          label="Titulek"
          value={title}
          onChange={handleTitleChange}
          error={validationErrors.title}
          disabled={isSubmitting}
        />
        <Input
          id="content"
          label="Obsah"
          type="textarea"
          value={content}
          onChange={handleContentChange}
          error={validationErrors.content}
          disabled={isSubmitting}
          rows={8}
        />
        <Input
          id="author"
          label="Autor"
          value={author}
          onChange={handleAuthorChange}
          error={validationErrors.author}
          disabled={isSubmitting}
        />
        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="btn btn--primary">
            {isSubmitting ? 'Odesílám...' : 'Odeslat'}
          </button>
        </div>
      </form>
    </div>
  )
}
