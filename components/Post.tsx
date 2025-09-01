import Link from 'next/link'
import type { Post as PostType } from '@/lib/jsonbin'
import Image from 'next/image'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  return (
    <div className="post">
      <Link href={`/posts/${post.id}`} className="flex flex-col h-full">
        <Image src="/placeholder.jpg" alt={post.title} width={310} height={280} />
        <div className="flex-grow flex flex-col pt-4">
          <div className="mb-6 flex justify-between items-center">
            <p className="mb-0">{post.author}</p>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
          <h3 className="mb-6">{post.title}</h3>
          <p className="line-clamp-3 mt-auto">{post.text}</p>
        </div>
      </Link>
    </div>
  )
}
