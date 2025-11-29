import apiClient from '@/lib/api';

export const dashboardApi = {
    getChartData: async () => {
        const response = await apiClient.get(`/charts`);
        return response.data;
    },
};