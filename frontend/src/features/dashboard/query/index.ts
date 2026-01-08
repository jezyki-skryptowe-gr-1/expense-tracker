import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardApi } from '../api';

import type {
    AddCategoryRequest,
    AddExpenseRequest,
    UpdateCategoryRequest,
    UpdateExpenseRequest,
} from '../types';

export const useChartDataQuery = () => {
    return useQuery({
        queryKey: ['chartData'],
        queryFn: () => dashboardApi.getChartData(),
    });
};

export const useSummaryQuery = () => {
    return useQuery({
        queryKey: ['summary'],
        queryFn: () => dashboardApi.getSummary(),
    });
};

export const useExpensesQuery = (params: { 
    search?: string; 
    category?: string;
    from?: string;
    to?: string;
    minAmount?: number;
    maxAmount?: number;
}) => {
    return useQuery({
        queryKey: ['expenses', params],
        queryFn: () => dashboardApi.getExpenses(params),
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
            queryClient.invalidateQueries({ queryKey: ['summary'] });
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
            queryClient.invalidateQueries({ queryKey: ['summary'] });
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
            queryClient.invalidateQueries({ queryKey: ['summary'] });
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
            queryClient.invalidateQueries({ queryKey: ['summary'] });
        },
    });
};

export const useAddCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddCategoryRequest) => dashboardApi.addCategory(data),
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