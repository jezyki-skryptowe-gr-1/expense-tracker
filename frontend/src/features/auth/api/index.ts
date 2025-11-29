import apiClient from '@/lib/api';
import type { LoginFormData, SignupFormData } from '../schemas';

export const authApi = {
    login: async (data: LoginFormData) => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },
    signup: async (data: SignupFormData) => {
        const response = await apiClient.post('/auth/signup', data);
        return response.data;
    },
    getMe: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    },
};