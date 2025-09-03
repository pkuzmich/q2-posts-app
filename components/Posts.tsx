import { fetchPosts, type Post } from '@/lib/jsonbin'
import PostItem from './PostItem'

const Posts = async () => {
  try {
    const posts = await fetchPosts()

    // Sort posts by createdAt date, most recent first
    const sortedPosts = posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
      <div className="posts">
        {sortedPosts.length === 0 ? (
          <p className="text-gray-500">Žádné příspěvky nejsou k dispozici. Vytvořte svůj první příspěvek!</p>
        ) : (
          sortedPosts.map((post: Post) => <PostItem post={post} key={post.id} />)
        )}
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return (
      <div className="error">
        <p className="error__info">Nepodařilo se načíst příspěvky</p>
        <p className="mt-2">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    )
  }
}

export default Posts
