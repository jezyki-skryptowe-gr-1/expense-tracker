import apiClient from '@/lib/api';
import type {
    AddCategoryRequest,
    AddExpenseRequest,
    Base, Categories, ChartData, Expense, Summary, UpdateCategoryRequest,
    UpdateExpenseRequest,
    UpdateUserRequest
} from "@/features/dashboard/types";

export const dashboardApi = {
    getSummary: async (): Promise<Summary> => {
        const response = await apiClient.get<Summary>(`/v1/summary`);
        return response.data;
    },

    getChartData: async (): Promise<ChartData> => {
        const response = await apiClient.get<ChartData>(`/v1/charts`);
        return response.data;
    },

    updateUser: async (budget: number): Promise<Base> => {
        const response = await apiClient.put<Base>('/v1/update_user', { budget } as UpdateUserRequest);
        return response.data;
    },

    addExpense: async (data: AddExpenseRequest): Promise<Base> => {
        const response = await apiClient.post<Base>('/v1/add_expense', data);
        return response.data;
    },

    updateExpense: async (data: UpdateExpenseRequest): Promise<Base> => {
        const response = await apiClient.put<Base>('/v1/update_expense', data);
        return response.data;
    },

    deleteExpense: async (expense_id: number): Promise<Base> => {
        const response = await apiClient.delete<Base>('/v1/delete_expense', { data: { expense_id } });
        return response.data;
    },

    getExpenses: async (params?: { search?: string; category?: string; from?: string; to?: string; minAmount?: number; maxAmount?: number }): Promise<Expense[]> => {
        const response = await apiClient.get<Expense[]>('/v1/expenses', { params });
        return response.data;
    },

    addCategory: async (data: AddCategoryRequest): Promise<Base> => {
        const response = await apiClient.post<Base>('/v1/add_category', data);
        return response.data;
    },

    updateCategory: async (data: UpdateCategoryRequest): Promise<Base> => {
        const response = await apiClient.put<Base>('/v1/update_category', data);
        return response.data;
    },

    deleteCategory: async (category_id: number): Promise<Base> => {
        const response = await apiClient.delete<Base>('/v1/delete_category', { data: { category_id } });
        return response.data;
    },

    getCategories: async (): Promise<Categories> => {
        const response = await apiClient.get<Categories>('/v1/categories');
        return response.data;
    },
};