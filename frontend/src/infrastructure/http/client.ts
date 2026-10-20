import axios from "axios";

export const httpClient = axios.create();

httpClient.interceptors.request.use((config) => {
    // config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
});

