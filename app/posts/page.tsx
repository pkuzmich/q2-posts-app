import Link from 'next/link'
import Posts from '@/components/Posts'

const PostsPage = () => {
  return (
    <>
      <Posts />
      <Link href="/posts/add">Add Post</Link>
    </>
  )
}

export default PostsPage
