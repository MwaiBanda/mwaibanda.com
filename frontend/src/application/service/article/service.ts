import type { UseCase } from "./usecase";
import type { Article } from "../../../domain/article/entity";
import type { Repository } from "../../../domain/article/repository";

export class Service implements UseCase {
    public constructor(private readonly repository: Repository) {}

    public async getAllArticles(): Promise<Article[]> {
        return this.repository.getAllArticles();
    }
}
