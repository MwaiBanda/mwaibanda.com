import type { Work } from "@/domain/work/enitity";
import type { Repository } from "@/domain/work/repository";
import type { AxiosInstance } from "axios";

export class WorkRepository implements Repository {
    public constructor(private readonly client: AxiosInstance) {}

    public async getAllWork(): Promise<Work[]> {
        return (await this.client.get<Work[]>("/api/v1/work")).data;
    }

}