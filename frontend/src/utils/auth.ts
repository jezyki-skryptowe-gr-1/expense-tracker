import { authApi } from '@/features/auth/api';
import { queryClient, router } from '@/main';

export interface User {
    id: number;
    email: string;
    name: string;
}

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        await authApi.getMe();
        return true;
    } catch {
        return false;
    }
};

export const logout = async () => {
    try {
        await authApi.logout();
    } catch (error) {
        console.error('Logout error:', error);
    }

    queryClient.invalidateQueries({ queryKey: ['user'] });
    router.navigate({ to: '/' });
};

export const requireAuth = async () => {
    const auth = await isAuthenticated();
    if (!auth) {
        throw new Error('Unauthorized');
    }
};

export const requireNoAuth = async () => {
    const auth = await isAuthenticated();
    if (auth) {
        throw new Error('Already authenticated');
    }
};