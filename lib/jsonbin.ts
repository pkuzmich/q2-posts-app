// JSONBin.io API configuration and utilities
export const JSONBIN_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_JSONBIN_BASE_URL,
  BIN_ID: process.env.NEXT_PUBLIC_JSONBIN_BIN_ID,
  MASTER_KEY: process.env.NEXT_PUBLIC_JSONBIN_MASTER_KEY,
  ACCESS_KEY: process.env.NEXT_PUBLIC_JSONBIN_ACCESS_KEY
}

export interface Post {
  id: number
  title: string
  text: string
  author: string
  image: string
  createdAt: string
}

export interface JSONBinResponse {
  record: {
    posts: Post[]
  }
  metadata: {
    id: string
    createdAt: string
    private: boolean
  }
}

// Get headers for JSONBin requests
export const getJSONBinHeaders = (method: 'GET' | 'PUT' = 'GET') => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Master-Key': `${JSONBIN_CONFIG.MASTER_KEY}`
  }

  if (method === 'PUT') {
    headers['X-Access-Key'] = `${JSONBIN_CONFIG.ACCESS_KEY}`
  }

  return headers
}

// Fetch posts from JSONBin
export const fetchPosts = async (): Promise<Post[]> => {
  const headers = getJSONBinHeaders('GET')
  console.log('Request headers:', headers)

  const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${JSONBIN_CONFIG.BIN_ID}/latest`, {
    method: 'GET',
    headers,
    cache: 'no-store'
  })

  if (!response.ok) {
    console.error('Response status:', response.status)
    console.error('Response text:', await response.text())
    throw new Error(`Failed to fetch posts: ${response.status}`)
  }

  const data: JSONBinResponse = await response.json()
  return data.record.posts || []
}

// Add a new post to JSONBin
export const createPost = async (title: string, text: string, author: string): Promise<Post> => {
  // First, get current posts
  const currentPosts = await fetchPosts()

  // Create new post with auto-incremented ID
  const postId = Math.max(...currentPosts.map((p) => p.id), 0) + 1
  const newPost: Post = {
    id: postId,
    title,
    text,
    author,
    image: `https://cataas.com/cat?${postId}`,
    createdAt: new Date().toISOString()
  }

  // Add to posts array
  const updatedPosts = [...currentPosts, newPost]

  // Update the bin
  const response = await fetch(`${JSONBIN_CONFIG.BASE_URL}/b/${JSONBIN_CONFIG.BIN_ID}`, {
    method: 'PUT',
    headers: getJSONBinHeaders('PUT'),
    body: JSON.stringify({ posts: updatedPosts })
  })

  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.status}`)
  }

  return newPost
}

// Find a post by ID
export const findPostById = async (id: number): Promise<Post | null> => {
  const posts = await fetchPosts()
  return posts.find((post) => post.id === id) || null
}
