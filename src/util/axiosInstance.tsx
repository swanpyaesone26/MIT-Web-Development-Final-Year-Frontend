// axiosInstance.tsx
import { useAuthStore } from "@/store/user-store";
import AppConfig from "./config";
import type { AxiosInstance } from "axios";
import axios from "axios";

const base_url = AppConfig.BASE_URL;

// Main API instance
const API: AxiosInstance = axios.create({
    baseURL: base_url,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Separate instance for refresh token requests
const refreshAPI = axios.create({
    baseURL: base_url,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add Authorization header to all requests
API.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token || localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling 401 and refreshing token
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only retry once
        if (
            error.response?.status === 401 &&
            error.response.data?.code === "token_not_valid" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) return Promise.reject(error);

            try {
                // Call refresh endpoint using separate instance
                const res = await refreshAPI.post("/auth/refresh/", { refreshToken });

                const newAccessToken = res.data.data.accessToken;
                if (!newAccessToken) throw new Error("Refresh failed");

                // Save new access token
                localStorage.setItem("accessToken", newAccessToken);
                useAuthStore.getState().setToken(newAccessToken);

                // Retry original request with new token
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            } catch (err) {
                console.error("Refresh token failed", err);
                // Optional: log out user if refresh fails
                useAuthStore.getState().logOut();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default API;