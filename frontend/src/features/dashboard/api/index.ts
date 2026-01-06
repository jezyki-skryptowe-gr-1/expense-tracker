import apiClient from '@/lib/api';
import type {
    AddCategoryRequest,
    AddExpenseRequest,
    Base, Categories, ChartData,
    Expenses, Summary, UpdateCategoryRequest,
    UpdateExpenseRequest,
    UpdateUserRequest
} from "@/features/dashboard/types";

export const dashboardApi = {
    getSummary: async (): Promise<Summary> => {
        const response = await apiClient.get<Summary>(`/api/v1/summary`);
        return response.data;
    },

    getChartData: async (): Promise<ChartData> => {
        const response = await apiClient.get<ChartData>(`/api/v1/charts`);
        return response.data;
    },

    updateUser: async (budget: number): Promise<Base> => {
        const response = await apiClient.put<Base>('/api/v1/update_user', { budget } as UpdateUserRequest);
        return response.data;
    },

    addExpense: async (data: AddExpenseRequest): Promise<Base> => {
        const response = await apiClient.post<Base>('/api/v1/add_expense', data);
        return response.data;
    },

    updateExpense: async (data: UpdateExpenseRequest): Promise<Base> => {
        const response = await apiClient.put<Base>('/api/v1/update_expense', data);
        return response.data;
    },

    deleteExpense: async (expense_id: number): Promise<Base> => {
        const response = await apiClient.delete<Base>('/api/v1/delete_expense', { data: { expense_id } });
        return response.data;
    },

    getExpenses: async (params?: { search?: string; category?: string; from?: string; to?: string; minAmount?: number; maxAmount?: number }): Promise<Expenses> => {
        const response = await apiClient.get<Expenses>('/api/v1/expenses', { params });
        return response.data;
    },

    addCategory: async (category: string): Promise<Base> => {
        const response = await apiClient.post<Base>('/api/v1/add_category', { category } as AddCategoryRequest);
        return response.data;
    },

    updateCategory: async (data: UpdateCategoryRequest): Promise<Base> => {
        const response = await apiClient.put<Base>('/api/v1/update_category', data);
        return response.data;
    },

    deleteCategory: async (category_id: number): Promise<Base> => {
        const response = await apiClient.delete<Base>('/api/v1/delete_category', { data: { category_id } });
        return response.data;
    },

    getCategories: async (): Promise<Categories> => {
        const response = await apiClient.get<Categories>('/api/v1/categories');
        return response.data;
    },
};