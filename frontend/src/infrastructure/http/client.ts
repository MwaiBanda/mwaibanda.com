import axios from "axios";

export const httpClient = axios.create({ timeout: 10000 });

httpClient.interceptors.request.use((config) => {
    // config.headers.Authorization = `Bearer ${API_KEY}`;
    return config;
});

