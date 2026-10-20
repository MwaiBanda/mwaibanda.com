import type { Article } from "@/domain/article/entity";
import type { Repository } from "@/domain/article/repository";
import type { AxiosInstance } from "axios";

export class ArticleRepository implements Repository {
    public constructor(private readonly client: AxiosInstance) {}

    public async getAllArticles(): Promise<Article[]> {
        return (await this.client.get<Article[]>("/api/v1/articles")).data;
    }

}