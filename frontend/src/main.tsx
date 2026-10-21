import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './interfaces/router/router.tsx'
import type { Services } from './application/services.ts'
import { Service as ArticleService } from './application/service/article/service.ts'
import { ArticleRepository } from './infrastructure/http/article/repository.ts'
import { httpClient } from './infrastructure/http/client.ts'
import { Service as WorkService} from './application/service/work/service.ts'
import { WorkRepository } from './infrastructure/http/work/repository.ts'
import { ApplicationContext } from './interfaces/presentation/application-context.ts'
import { queryClient } from './infrastructure/query/react-query.ts'
import { CacheKeys } from './application/config/constants.ts'
import { parseArticlesResponse, parseWorkResponse } from './infrastructure/http/responses.ts'

const snapshot = document.getElementById('prerender-content')
if (snapshot?.textContent) {
  try {
    const payload: unknown = JSON.parse(snapshot.textContent)
    if (typeof payload === 'object' && payload !== null && 'articles' in payload && 'work' in payload) {
      const articles = parseArticlesResponse(payload.articles)
      const work = parseWorkResponse(payload.work)
      queryClient.setQueryData([CacheKeys.ARTICLES], articles)
      queryClient.setQueryData([CacheKeys.WORK], work)
    }
  } catch {
    console.warn('Discarding invalid prerendered content')
  }
}

const application: Services = {
  articles: new ArticleService(new ArticleRepository(httpClient)),
  work: new WorkService(new WorkRepository(httpClient))
}
document.head.querySelectorAll('title, meta[name="description"], meta[name="robots"], meta[name^="twitter:"], meta[property^="og:"], link[rel="canonical"]').forEach(element => element.remove())
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationContext.Provider value={application}>
      <Router />
    </ApplicationContext.Provider>
  </StrictMode>,
)
