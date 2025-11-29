import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api';
import type { LoginFormData, SignupFormData } from '../schemas';

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (data: LoginFormData) => authApi.login(data),
    });
};

export const useSignupMutation = () => {
    return useMutation({
        mutationFn: (data: SignupFormData) => authApi.signup(data),
    });
};

export const useUserQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: authApi.getMe,
        staleTime: 5 * 60 * 1000,
    });
};

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: authApi.logout,
    });
};