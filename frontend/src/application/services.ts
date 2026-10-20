import type { UseCase as ArticleUseCase } from "./service/article/usecase";
import type { UseCase as WorkUseCase} from "./service/work/usecase";

export interface Services {
    articles: ArticleUseCase;
    work: WorkUseCase;
}