import axios from 'axios';
import { router } from '@/main';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/refresh_token`, {}, { withCredentials: true });
                return apiClient(originalRequest);
            } catch (refreshError) {
                router.navigate({ to: '/' });
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
