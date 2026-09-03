import axios from "axios";

const API = axios.create({
    baseURL: "/api",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;

        const isAuthFailure =
            status === 401 ||
            (status === 403 && code === "TOKEN_INVALID");

        if (isAuthFailure) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.dispatchEvent(new Event("auth-expired"));
        }

        return Promise.reject(error);
    }
);

export default API;