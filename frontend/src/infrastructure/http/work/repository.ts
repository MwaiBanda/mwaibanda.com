import type { Work } from "@/domain/work/enitity";
import type { Repository } from "@/domain/work/repository";
import type { AxiosInstance } from "axios";
import { parseWorkResponse } from '../responses';

export class WorkRepository implements Repository {
    public constructor(private readonly client: AxiosInstance) {}

    public async getAllWork(): Promise<Work[]> {
        const { data } = await this.client.get<unknown>("/api/v1/work");
        return parseWorkResponse(data);
    }

}