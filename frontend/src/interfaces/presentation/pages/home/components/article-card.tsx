import type { Article } from '../../../../../domain/article/entity'

export default function ArticleCard({ article }: { article: Article }) {
  return <div className="pb-4 mb-4 border-b border-neutral-300 dark:border-neutral-800 cursor-pointer">
    <a href={`/blog/${article.name}`}>
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-1">
          <span className="font-medium text-sm">{article?.name}</span>
        </div>
        <span className="text-xs text-neutral-500">{article?.publicationDate}</span>
      </div>
      <p className="pb-4 text-neutral-600  dark:text-neutral-400 text-sm leading-relaxed">{article?.summary}</p>
      {article?.tags?.map((tag, i) => {
        return <span className={`${i > 0 ? "ml-2 " : ""}text-xs px-2 py-1 rounded-full bg-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-500 border border-neutral-400 dark:border-neutral-800`}>
          {tag}
        </span>
      })}
    </a>
  </div>
}