import axios, { AxiosInstance } from "axios";
import AppConfig, { AppSecureStore } from "@/config";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: AppConfig.PULSE_API,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            const token = await AppSecureStore.get("token");

            if (token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Failed to set Authorization header:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
