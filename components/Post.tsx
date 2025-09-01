import Link from 'next/link'
import type { Post as PostType } from '@/lib/jsonbin'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  return (
    <div className="border rounded-lg p-4">
      <Link href={`/posts/${post.id}`} className="block">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="mb-2 line-clamp-3">{post.text}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm">Autor: {post.author}</p>
          <p className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </Link>
    </div>
  )
}
