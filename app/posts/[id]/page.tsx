interface PostPageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div>
      <h1>Detail Post {params.id}</h1>
    </div>
  )
}
