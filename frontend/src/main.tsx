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

const application: Services = {
  articles: new ArticleService(new ArticleRepository(httpClient)),
  work: new WorkService(new WorkRepository(httpClient))
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationContext.Provider value={application}>
      <Router />
    </ApplicationContext.Provider>
  </StrictMode>,
)
