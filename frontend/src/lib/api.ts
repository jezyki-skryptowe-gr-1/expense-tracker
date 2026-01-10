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
        // Don't retry if this is already a refresh token request
        const isRefreshRequest = originalRequest.url?.includes('/refresh_token');
        
        if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;
            try {
                await apiClient.put('/v1/refresh_token');
                return apiClient(originalRequest);
            } catch (refreshError) {
                const isMeRequest = originalRequest.url?.includes('/v1/me');
                if (!isMeRequest) {
                    router.navigate({ to: '/' });
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
