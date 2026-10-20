import type { UseCase } from "./usecase";
import type { Repository } from "@/domain/work/repository";
import type { Work } from "@/domain/work/enitity";

export class Service implements UseCase {
        public constructor(private readonly repository: Repository) {}

    getAllWork(): Promise<Work[]> {
        return this.repository.getAllWork();
    }
}
