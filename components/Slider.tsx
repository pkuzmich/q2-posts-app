'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { findPostById } from '@/lib/jsonbin'

interface PageContent {
  title: string
}

const getPageContent = (pathname: string, postTitle?: string): PageContent => {
  switch (pathname) {
    case '/':
      return {
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }
    case '/posts':
      return {
        title: 'All Posts'
      }
    case '/posts/add':
      return {
        title: 'Přidani članku'
      }
    default:
      if (pathname.startsWith('/posts/')) {
        return {
          title: postTitle || ''
        }
      }
      return {
        title: 'Q2 Posts'
      }
  }
}

export default function Slider() {
  const pathname = usePathname()
  const [postTitle, setPostTitle] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchPostTitle = async () => {
      // Check if we're on a post detail page
      const postIdMatch = pathname.match(/^\/posts\/(\d+)$/)
      if (postIdMatch) {
        try {
          const postId = parseInt(postIdMatch[1])
          const post = await findPostById(postId)
          if (post) {
            setPostTitle(post.title)
          }
        } catch (error) {
          console.error('Failed to fetch post title:', error)
        }
      } else {
        setPostTitle(undefined)
      }
    }

    fetchPostTitle()
  }, [pathname])

  const content = getPageContent(pathname, postTitle)
  return (
    <div className="slider">
      <header className="header">
        <div className="header__container container">
          <div className="header__logo">
            <Link href="/">
              <Image src="/logo.png" alt="Q2 Logo" width={81} height={54} priority />
            </Link>
          </div>

          <nav className="nav">
            <ul className="nav__list">
              <li className="nav__item">
                <Link href="/" className={`nav__link ${pathname === '/' ? 'nav__link--active' : ''}`}>
                  Blog
                </Link>
              </li>
              <li className="nav__item">
                <Link
                  href="/posts/add"
                  className={`nav__link ${pathname === '/posts/add' ? 'nav__link--active' : ''}`}
                >
                  Přidat článek
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div className="slider__content container">
        <h1 className="slider__title">{content.title}</h1>
      </div>
    </div>
  )
}
