'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost } from '@/lib/jsonbin'

export default function PostAddPage() {
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
    <div className="p-4 max-w-2xl mx-auto">
      <Link href="/posts" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Vrátit se k příspěvkům
      </Link>

      <h1 className="text-2xl font-bold mb-6">Přidat nový příspěvek</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            ✅ Příspěvek vytvořen úspěšně! Přesměrování...
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Název
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Zadejte název ( minimálně 3 znaky dlouhý)"
            disabled={isSubmitting}
          />
          {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Autor
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={handleAuthorChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.author ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Zadejte autora"
            disabled={isSubmitting}
          />
          {validationErrors.author && <p className="text-red-500 text-sm mt-1">{validationErrors.author}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Obsah
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={8}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Zadejte obsah ( minimálně 10 znaků dlouhý)"
            disabled={isSubmitting}
          />
          {validationErrors.content && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.content}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>

          <Link
            href="/posts"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Zpět
          </Link>
        </div>
      </form>
    </div>
  )
}
