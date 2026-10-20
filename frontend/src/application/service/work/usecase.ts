import type { Work } from "@/domain/work/enitity";

export interface UseCase {
    getAllWork(): Promise<Work[]>
}

