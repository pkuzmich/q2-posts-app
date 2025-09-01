import PostComponent from '@/components/Posts'

// Enable ISR with revalidation every 60 seconds
export const revalidate = 60

export default async function PostsPage() {
  return <PostComponent />
}
