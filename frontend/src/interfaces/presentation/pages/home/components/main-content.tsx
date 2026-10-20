import type { Article } from "@/domain/article/entity"
import type { Work } from "@/domain/work/enitity"
import SectionHeader from "@/interfaces/presentation/components/section-header"
import { useEffect } from "react"
import ArticleCard from "./article-card"
import WorkCard from "./work-card"

interface MainContentProps {
  show: boolean,
  work?: Work[]
  articles?: Article[]
}

export default function MainContent({ show, work, articles }: MainContentProps) {
  useEffect(() => {
    console.log(work)
  }, [work])
  if (show) {
    return <>
      <SectionHeader title='featured work' style='mt-12' />
      {work?.map((item, i) => {
        return <WorkCard key={`work-${i}`} work={item} />
      })}
      <SectionHeader title='articles' style='mt-12' />
      {articles && articles?.map((article) => {
        return <>{article && <ArticleCard article={article} />}</>
      })}
    </>
  }
  return <></>
}