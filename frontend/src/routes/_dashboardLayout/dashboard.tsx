import MainDashboardView from '@/features/dashboard/views/main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/dashboard')({
    component: MainDashboardView,
})