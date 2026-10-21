import type { Article } from '../../../../domain/article/entity'
import { articlePath, siteOrigin } from '../../../router/article-url'

export default function ArticleMetadata({ article }: { article?: Article }) {
  const title = article ? `${article.name} | Mwai Banda` : 'Mwai Banda - Android | iOS | Roku | Web'
  const description = article?.summary ?? 'Mwai Banda, software engineer designing and building end-to-end experiences for Android, iOS, iPadOS, Roku & Web.'
  const url = siteOrigin + (article ? articlePath(article.name) : '/')
  const image = article?.image ? new URL(article.image, siteOrigin).href : undefined

  return <>
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={url} />
    <meta property="og:type" content={article ? 'article' : 'website'} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    {image && <meta property="og:image" content={image} />}
    <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {image && <meta name="twitter:image" content={image} />}
  </>
}