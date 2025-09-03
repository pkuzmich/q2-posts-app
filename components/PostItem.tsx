import Link from 'next/link'
import type { Post as PostType } from '@/lib/jsonbin'
import Image from 'next/image'

interface PostProps {
  post: PostType
}

export default function Post({ post }: PostProps) {
  const { id, title, image, text, author, createdAt } = post

  const imageUrl = image || `/placeholder.jpg`

  return (
    <div className="post-item">
      <Link href={`/posts/${id}`} className="flex flex-col h-full">
        <Image
          src={imageUrl}
          alt={title}
          width={310}
          height={280}
          className="object-cover post-item__image"
        />
        <div className="flex-grow flex flex-col pt-4">
          <div className="mb-6 flex justify-between items-center">
            <p className="mb-0">{author}</p>
            <p>{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          <h3 className="mb-5">{title}</h3>
          <p className="line-clamp-3 mt-auto">{text}</p>
        </div>
      </Link>
    </div>
  )
}
