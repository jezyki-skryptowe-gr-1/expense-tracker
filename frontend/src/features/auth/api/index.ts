import apiClient from '@/lib/api';
import type { LoginFormData, SignupFormData } from '../schemas';

export const authApi = {
    login: async (data: LoginFormData) => {
        const response = await apiClient.post('/v1/login', data);
        localStorage.setItem('auth_hint', 'true');
        return response.data;
    },
    signup: async (data: SignupFormData) => {
        const response = await apiClient.post('/v1/register', {
            login: data.name,
            password: data.password,
            budget: Number(data.budget)
        });
        return response.data;
    },
    getMe: async () => {
        try {
            const response = await apiClient.post('/v1/me');
            localStorage.setItem('auth_hint', 'true');
            return response.data;
        } catch (error) {
            localStorage.removeItem('auth_hint');
            throw error;
        }
    },
    logout: async () => {
        const response = await apiClient.post('/v1/logout');
        localStorage.removeItem('auth_hint');
        return response.data;
    },
};