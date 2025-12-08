import axios from "axios";

export const axiosInstance = axios.create({
    baseUrl: import.meta.env.MODE === "development" ? "https://localhost:5000/api" : "/api",
    withCredentials: true,
});