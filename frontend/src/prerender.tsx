import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ArrowLeft } from 'lucide-react'
import { StaticRouter } from 'react-router'
import type { Article } from './domain/article/entity'
import type { Work } from './domain/work/enitity'
import ArticleContent from './interfaces/presentation/pages/blog/article-content'
import ArticleMetadata from './interfaces/presentation/pages/blog/article-metadata'
import ArticleCard from './interfaces/presentation/pages/home/components/article-card'
import WorkCard from './interfaces/presentation/pages/home/components/work-card'
import IntroCopy from './interfaces/presentation/pages/home/components/intro-copy'

export { parseArticlesResponse, parseWorkResponse } from './infrastructure/http/responses'
export { articlePath, siteOrigin } from './interfaces/router/article-url'

export function renderArticle(article: Article) {
  return renderToStaticMarkup(<main className="blog-page">
    <nav className="blog-nav" aria-label="Article navigation">
      <a href="/" className="blog-back action-bar-glass"><ArrowLeft size={16} aria-hidden="true" /> Back</a>
    </nav>
    <ArticleContent article={article} />
    <footer className="blog-footer"><a href="/" className="blog-back">Back to home</a></footer>
  </main>)
}

export function renderMetadata(article: Article) {
  return renderToStaticMarkup(<ArticleMetadata article={article} />)
}

export function renderHome(articles: Article[], work: Work[]) {
  return renderToStaticMarkup(<StaticRouter location="/"><main className="home-page px-6 py-12">
    <div className="mx-auto max-w-[600px]">
      <h1 className="home-name">Mwai Banda</h1>
      <h2 className="home-role mb-8">Software Engineer</h2>
      <div className="home-intro mb-8"><IntroCopy /></div>
      <section aria-label="Featured work"><h2 className="mb-4">featured work</h2>{work.map(project => <WorkCard key={project.name} work={project} />)}</section>
      <section aria-label="Articles"><h2 className="mb-4">articles</h2>{articles.map(article => <ArticleCard key={article.name} article={article} />)}</section>
    </div>
  </main></StaticRouter>)
}

export function renderSitemap(urls: string[]) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + renderToStaticMarkup(
    createElement('urlset', { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
      urls.map(url => createElement('url', { key: url }, createElement('loc', null, url)))),
  )
}