import Link from 'next/link'

interface Post {
  id: number
  title: string
}

const Posts = async () => {
  const posts = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10').then((res) => res.json())

  return (
    <>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Posts
