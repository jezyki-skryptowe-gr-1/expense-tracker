import { router } from '@/main';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, { withCredentials: true });

                return axiosInstance(error.config);
            } catch (refreshError) {
                console.error('Token refresh failed', refreshError);
                router.navigate({ to: '/' })
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;