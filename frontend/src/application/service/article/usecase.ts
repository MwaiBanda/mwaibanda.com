import type { Article } from "../../../domain/article/entity";

export interface UseCase {
    getAllArticles(): Promise<Article[]>
}

