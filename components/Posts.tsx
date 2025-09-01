import { fetchPosts, type Post } from '@/lib/jsonbin'
import PostComponent from './Post'
import Link from 'next/link'

const Posts = async () => {
  try {
    const posts = await fetchPosts()
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Příspěvky</h1>
          <Link
            href="/posts/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Přidat příspěvek
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="text-gray-500">Žádné příspěvky nejsou k dispozici. Vytvořte svůj první příspěvek!</p>
        ) : (
          <div className="space-y-4 grid grid-cols-1 gap-4">
            {posts.map((post: Post) => (
              <PostComponent post={post} key={post.id} />
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Příspěvky</h1>
        <p className="text-red-500">Nepodařilo se načíst příspěvky</p>
        <p className="text-sm text-gray-600 mt-2">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }
}

export default Posts
