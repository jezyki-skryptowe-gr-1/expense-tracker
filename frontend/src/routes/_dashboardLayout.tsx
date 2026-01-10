import {Outlet, createFileRoute, redirect, isRedirect} from '@tanstack/react-router'
import { authApi } from '@/features/auth/api'

export const Route = createFileRoute('/_dashboardLayout')({
    beforeLoad: async ({ context }) => {
        try {
            const user = await context.queryClient.ensureQueryData({
                queryKey: ['user'],
                queryFn: authApi.getMe,
            });

            if (!user || !user.login) {
                throw redirect({
                    viewTransition: true,
                    to: '/',
                });
            }
        } catch (e) {
            if (isRedirect(e)) {
                throw e;
            }
            throw redirect({
                viewTransition: true,
                to: '/',
            });
        }
    },
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