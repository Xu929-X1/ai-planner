import axios, { InternalAxiosRequestConfig } from "axios";

axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    //TODO: Auto add token to request
    config.headers.set("X-Real-URL", config.url || "");
    return config;
});

