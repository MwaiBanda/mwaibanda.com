import type { Article } from '../../../../../domain/article/entity'
import { Link } from 'react-router'
import TagList from '../../../components/tag-list'
import { articlePath } from '../../../../router/article-url'

export default function ArticleCard({ article }: { article: Article }) {
  return <div className="home-content-row pb-4 mb-4 border-b border-neutral-300 dark:border-neutral-800 cursor-pointer">
    <Link to={articlePath(article.name)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-2">
        <h3 className="home-content-title font-medium text-sm">{article.name}</h3>
        {article.publicationDate && <span className="home-date">{article.publicationDate}</span>}
      </div>
      <p className="pb-4 text-[15px] leading-6 font-normal text-neutral-600 dark:text-neutral-400 break-words">{article?.summary}</p>
      <TagList tags={article.tags} />
    </Link>
  </div>
}