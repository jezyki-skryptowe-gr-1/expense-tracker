import MainDashboardView from '@/features/dashboard/views/main'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { dashboardApi } from '@/features/dashboard/api'

const dashboardSearchSchema = z.object({
    search: z.string().optional(),
    category: z.coerce.number().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
})

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
    validateSearch: (search) => dashboardSearchSchema.parse(search),
    loaderDeps: ({ search }) => ({
        search: search.search,
        category: search.category,
        from: search.from,
        to: search.to,
        minAmount: search.minAmount,
        maxAmount: search.maxAmount
    }),
    loader: async ({ context: { queryClient }, deps }) => {
        const expensesParams = {
            search: deps.search,
            category: deps.category === 'all' ? undefined : deps.category,
            from: deps.from,
            to: deps.to,
            minAmount: deps.minAmount,
            maxAmount: deps.maxAmount
        }

        await Promise.all([
            queryClient.ensureQueryData({
                queryKey: ['expenses', expensesParams],
                queryFn: () => dashboardApi.getExpenses(expensesParams)
            }),
            queryClient.ensureQueryData({
                queryKey: ['categories'],
                queryFn: () => dashboardApi.getCategories()
            }),
            queryClient.ensureQueryData({
                queryKey: ['summary'],
                queryFn: () => dashboardApi.getSummary()
            }),
            queryClient.ensureQueryData({
                queryKey: ['chartData'],
                queryFn: () => dashboardApi.getChartData()
            })
        ])
    },
    component: MainDashboardView,
})