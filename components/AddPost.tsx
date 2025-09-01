'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost } from '@/lib/jsonbin'

export default function AddPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    setValidationErrors((prev) => ({
      ...prev,
      title: validateTitle(value)
    }))
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setContent(value)
    setValidationErrors((prev) => ({
      ...prev,
      content: validateContent(value)
    }))
  }

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAuthor(value)
    setValidationErrors((prev) => ({
      ...prev,
      author: validateAuthor(value)
    }))
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
    setSuccess(false)

    try {
      const newPost = await createPost(title.trim(), content.trim(), author.trim())

      console.log('Příspěvek vytvořen úspěšně:', newPost)

      // Show success status briefly before redirecting
      setSuccess(true)
      setIsSubmitting(false)

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(`/posts/${newPost.id}`)
      }, 1500)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Nepodařilo se vytvořit příspěvek')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="add-post">
      <form onSubmit={handleSubmit} className="add-post__form">
        {error && <div className="error-message">{error}</div>}

        {success && <div className="success">✅ Příspěvek vytvořen úspěšně! Přesměrování...</div>}

        <div>
          <label htmlFor="title" className="block mb-1">
            Titulek
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={`form-input ${validationErrors.title ? 'error-border' : 'success-border'}`}
            disabled={isSubmitting}
          />
          {validationErrors.title && <p className="error-field">{validationErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block mb-1">
            Obsah
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={8}
            className={`form-textarea ${validationErrors.content ? 'error-border' : 'success-border'}`}
            disabled={isSubmitting}
          />
          {validationErrors.content && <p className="error-field">{validationErrors.content}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block mb-1">
            Autor
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleAuthorChange}
            className={`form-input ${validationErrors.author ? 'error-border' : 'success-border'}`}
            disabled={isSubmitting}
          />
          {validationErrors.author && <p className="error-field">{validationErrors.author}</p>}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isSubmitting} className="add-post__btn">
            {isSubmitting ? 'Odesílám...' : 'Odeslat'}
          </button>
        </div>
      </form>
    </div>
  )
}
