import type { Work } from "./enitity";

export interface Repository {
    getAllWork(): Promise<Work[]>
}