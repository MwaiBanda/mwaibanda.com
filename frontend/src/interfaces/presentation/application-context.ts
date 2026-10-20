import { createContext, useContext } from "react";
import type { Services } from "@/application/services";

export const ApplicationContext = createContext<Services | null>(null);

export function useApplication(): Services {
    const application = useContext(ApplicationContext);
    if (!application) {
        throw new Error("Application services are not available");
    }
    return application;
}
