import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from 'lucide-react'
import ActionBar from "../../components/action-buton";
import { Link, useParams } from "react-router";
import { CacheKeys } from "../../../../application/config/constants";
import { useApplication } from "../../application-context";
import './blog.css';
import ArticleContent from './article-content';
import ArticleMetadata from './article-metadata';
import PageLoader from '../../components/page-loader';

export default function Blog() {
    const application = useApplication()
    const { article } = useParams()

    const articles = useQuery({
        queryKey: [CacheKeys.ARTICLES], queryFn: async () => {
            return application.articles.getAllArticles()
        },
    })
    const currentArticle = articles.data?.find((item) => item.name.toLowerCase() === article?.toLowerCase())

    return <main className="blog-page">
      <nav className="blog-nav" aria-label="Article navigation">
        <Link to="/" className="blog-back action-bar-glass"><ArrowLeft size={16} aria-hidden="true" /> Back</Link>
      </nav>
      {articles.isPending ? <PageLoader />
        : articles.isError ? <div className="blog-status" role="alert">
          <p>Couldn't load this article.</p>
          <button className="blog-back" onClick={() => void articles.refetch()}>Try again</button>
        </div>
        : !currentArticle ? <><title>Article not found | Mwai Banda</title><meta name="robots" content="noindex" /><p className="blog-status">Article not found.</p></>
        : <>
            <ArticleMetadata article={currentArticle} />
            <ArticleContent article={currentArticle} />
              <footer className="blog-footer">
                <Link to="/" className="blog-back"><ArrowLeft size={16} aria-hidden="true" /> Back to home</Link>
              </footer>
              </>}
              <div className="blog-dock"><ActionBar /></div>
            </main>
}