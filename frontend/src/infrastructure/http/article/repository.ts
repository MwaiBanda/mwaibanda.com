import type { Article } from "@/domain/article/entity";
import type { Repository } from "@/domain/article/repository";
import type { AxiosInstance } from "axios";
import { parseArticlesResponse } from '../responses';

export class ArticleRepository implements Repository {
    public constructor(private readonly client: AxiosInstance) {}

    public async getAllArticles(): Promise<Article[]> {
        const { data } = await this.client.get<unknown>("/api/v1/articles");
        return parseArticlesResponse(data);
    }

}