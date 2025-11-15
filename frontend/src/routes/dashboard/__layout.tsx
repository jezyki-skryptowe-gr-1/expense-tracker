import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/__layout')({
    component: DashboardLayout,
})

function DashboardLayout() {
    return (
        <div className="min-h-screen">
            <div>
                <Outlet />
            </div>
        </div>
    )
}