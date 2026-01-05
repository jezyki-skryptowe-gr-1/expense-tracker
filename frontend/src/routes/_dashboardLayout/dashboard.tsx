import MainDashboardView from '@/features/dashboard/views/main'
import { createFileRoute } from '@tanstack/react-router'
import { dashboardApi } from '@/features/dashboard/api'

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
    loader: async ({ context }) => {
        await Promise.all([
            context.queryClient.ensureQueryData({
                queryKey: ['expenses'],
                queryFn: dashboardApi.getExpenses,
            }),
            context.queryClient.ensureQueryData({
                queryKey: ['categories'],
                queryFn: dashboardApi.getCategories,
            }),
            context.queryClient.ensureQueryData({
                queryKey: ['chartData'],
                queryFn: dashboardApi.getChartData,
            }),
            context.queryClient.ensureQueryData({
                queryKey: ['summary'],
                queryFn: dashboardApi.getSummary,
            }),
        ])
    },
    component: MainDashboardView,
})