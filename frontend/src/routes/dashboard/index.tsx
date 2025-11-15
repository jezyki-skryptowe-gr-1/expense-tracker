import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
    component: DashboardIndex,
})

function DashboardIndex() {
    return (
        <div className="px-4 py-6 sm:px-0">
            Dashboard page content
        </div>
    )
}