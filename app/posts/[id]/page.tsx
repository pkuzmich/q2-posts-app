import { findPostById, fetchPosts } from '@/lib/jsonbin'
import ScrollToTop from '@/components/ScrollToTop'

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
        </div>
      )
    }

    return (
      <div className="container">
        <ScrollToTop />
        <article className="post flex">
          <p className="flex-shrink-0 post__author">{post.author}</p>
          <div className="max-w-none">
            <p>{post.text}</p>
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
      </div>
    )
  }
}
