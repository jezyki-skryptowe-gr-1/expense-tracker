import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api';
import { useUserQuery } from '@/features/auth/query';
import type {
    AddExpenseRequest,
    UpdateCategoryRequest,
    UpdateExpenseRequest,
} from '../types';

export const useChartDataQuery = () => {
    const { data: user } = useUserQuery();

    return useQuery({
        queryKey: ['chartData', user?.id],
        queryFn: () => dashboardApi.getChartData(),
        enabled: !!user,
    });
};

export const useExpensesQuery = () => {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: () => dashboardApi.getExpenses(),
    });
};

export const useCategoriesQuery = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => dashboardApi.getCategories(),
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (budget: number) => dashboardApi.updateUser(budget),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useAddExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddExpenseRequest) => dashboardApi.addExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['chartData'] });
        },
    });
};

export const useUpdateExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateExpenseRequest) => dashboardApi.updateExpense(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['chartData'] });
        },
    });
};

export const useDeleteExpenseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (expense_id: number) => dashboardApi.deleteExpense(expense_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['chartData'] });
        },
    });
};

export const useAddCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: string) => dashboardApi.addCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateCategoryRequest) => dashboardApi.updateCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useDeleteCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category_id: number) => dashboardApi.deleteCategory(category_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};