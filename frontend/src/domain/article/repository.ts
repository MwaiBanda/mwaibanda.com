import type { Article } from "./entity";

export interface Repository {
    getAllArticles(): Promise<Article[]>
}