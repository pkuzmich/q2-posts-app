import Posts from '@/components/Posts'

export default function Home() {
  return (
    <section className="blog">
      <div className="blog__container">
        <div className="blog__header">
          <h2 className="blog__title">Nejnovější</h2>
        </div>
        <Posts />
      </div>
    </section>
  )
}
