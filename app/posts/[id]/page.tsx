import Link from 'next/link'
import { findPostById, fetchPosts } from '@/lib/jsonbin'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate static params for all posts (ISR)
export async function generateStaticParams() {
  try {
    const posts = await fetchPosts()
    return posts.map((post) => ({
      id: post.id.toString()
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

// Enable ISR with revalidation every 300 seconds (5 minutes)
export const revalidate = 300

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params
    const post = await findPostById(parseInt(id))

    if (!post) {
      return (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Příspěvek nebyl nalezen</h1>
          <p className="text-gray-500 mb-4">Požadovaný příspěvek nebyl nalezen.</p>
          <Link href="/posts" className="text-blue-600 hover:text-blue-800">
            ← Vrátit se k příspěvkům
          </Link>
        </div>
      )
    }

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Link href="/posts" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Vrátit se k příspěvkům
        </Link>
        <article className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">By: {post.author}</p>
            <p className="text-sm text-gray-500">Created: {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>
          </div>
        </article>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
        <p className="text-red-500 mb-4">
          Nepodařilo se načíst příspěvek: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <Link href="/posts" className="text-blue-600 hover:text-blue-800">
          ← Vrátit se k příspěvkům
        </Link>
      </div>
    )
  }
}
