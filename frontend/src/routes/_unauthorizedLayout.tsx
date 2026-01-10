import {Outlet, createFileRoute, redirect, isRedirect} from '@tanstack/react-router'
import { authApi } from '@/features/auth/api'

export const Route = createFileRoute('/_unauthorizedLayout')({
    beforeLoad: async ({ context }) => {
        try {
            const user = await context.queryClient.ensureQueryData({
                queryKey: ['user'],
                queryFn: authApi.getMe,
            });

            if (user && user.login) {
                throw redirect({
                    viewTransition: true,
                    to: '/dashboard',
                    search: {
                        from: undefined,
                        to: undefined,
                        search: undefined,
                        category: undefined,
                        minAmount: undefined,
                        maxAmount: undefined
                    }
                });
            }
        } catch (e) {
            if (isRedirect(e)) {
                throw e;
            }
        }
    },
    component: UnauthorizedLayout,
})

function UnauthorizedLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    )
}