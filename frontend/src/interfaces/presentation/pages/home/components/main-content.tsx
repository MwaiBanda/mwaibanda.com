import type { Article } from "@/domain/article/entity"
import type { Work } from "@/domain/work/enitity"
import SectionHeader from "@/interfaces/presentation/components/section-header"
import type { UseQueryResult } from '@tanstack/react-query'
import ArticleCard from "./article-card"
import WorkCard from "./work-card"

interface MainContentProps {
  show: boolean,
  work: UseQueryResult<Work[]>
  articles: UseQueryResult<Article[]>
}

export default function MainContent({ show, work, articles }: MainContentProps) {
  if (show) {
    return <>
      <section className="home-reveal" aria-label="Featured work">
      <SectionHeader title='featured work' style='mt-12' />
      {work.isPending && <p role="status" className="home-query-state">Loading work...</p>}
      {work.isError && <p role="alert" className="home-query-state">Couldn't load work. <button type="button" onClick={() => void work.refetch()} disabled={work.isFetching} className="home-retry">{work.isFetching ? 'Retrying...' : 'Try again'}</button></p>}
      {work.isSuccess && work.data.length === 0 && <p className="home-query-state">No featured work yet.</p>}
      {work.data?.map((item) => <WorkCard key={item.link || item.name} work={item} />)}
      </section>
      <section className="home-reveal home-reveal-later" aria-label="Articles">
      <SectionHeader title='articles' style='mt-12' />
      {articles.isPending && <p role="status" className="home-query-state">Loading articles...</p>}
      {articles.isError && <p role="alert" className="home-query-state">Couldn't load articles. <button type="button" onClick={() => void articles.refetch()} disabled={articles.isFetching} className="home-retry">{articles.isFetching ? 'Retrying...' : 'Try again'}</button></p>}
      {articles.isSuccess && articles.data.length === 0 && <p className="home-query-state">No articles yet.</p>}
      {articles.data?.map((article) => <ArticleCard key={article.name} article={article} />)}
      </section>
    </>
  }
  return <></>
}