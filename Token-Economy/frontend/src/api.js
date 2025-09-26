import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
    // Skip token for login/register
    if (!config.url.includes("/api/token/") && !config.url.includes("/api/user/register/")) {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;