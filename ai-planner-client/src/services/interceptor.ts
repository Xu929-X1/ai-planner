import axios, { InternalAxiosRequestConfig } from "axios";

axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    //TODO: Auto add token to request
    return config;
});

