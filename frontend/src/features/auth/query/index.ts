import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api';
import type { LoginFormData, SignupFormData } from '../schemas';

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: LoginFormData) => authApi.login(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useSignupMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SignupFormData) => authApi.signup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useUserQuery = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: authApi.getMe,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.removeQueries();
        },
    });
};