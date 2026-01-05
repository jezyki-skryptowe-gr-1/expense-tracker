import MainDashboardView from '@/features/dashboard/views/main'
import { createFileRoute } from '@tanstack/react-router'
// import { dashboardApi } from '@/features/dashboard/api'
import { z } from 'zod'

const dashboardSearchSchema = z.object({
    page: z.number().optional().default(1),
    search: z.string().optional(),
    category: z.string().optional(),
})

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
    validateSearch: (search) => dashboardSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({
        page: search.page,
        search: search.search,
        category: search.category
    }),
    loader: async ({
                       // context, deps
    }) => {
        // const expensesParams = {
        //     page: deps.page || 1,
        //     limit: 5,
        //     search: deps.search,
        //     category: deps.category === 'all' ? undefined : deps.category,
        // }
        //
        // await Promise.all([
        //     context.queryClient.ensureQueryData({
        //         queryKey: ['expenses', expensesParams],
        //         queryFn: () => dashboardApi.getExpenses(expensesParams),
        //     }),
        //     context.queryClient.ensureQueryData({
        //         queryKey: ['categories'],
        //         queryFn: dashboardApi.getCategories,
        //     }),
        //     context.queryClient.ensureQueryData({
        //         queryKey: ['chartData'],
        //         queryFn: dashboardApi.getChartData,
        //     }),
        //     context.queryClient.ensureQueryData({
        //         queryKey: ['summary'],
        //         queryFn: dashboardApi.getSummary,
        //     }),
        // ])
    },
    component: MainDashboardView,
})