import {Outlet, createFileRoute, redirect, isRedirect} from '@tanstack/react-router'
import { authApi } from '@/features/auth/api'

export const Route = createFileRoute('/_unauthorizedLayout')({
    beforeLoad: async ({ context }) => {
        try {
            const user = await context.queryClient.fetchQuery({
                queryKey: ['user'],
                queryFn: authApi.getMe,
                staleTime: 0,
            });

            if (user && user.login) {
                throw redirect({
                    viewTransition: true,
                    to: '/dashboard',
                });
            }
        } catch (e) {
            if (isRedirect(e)) {
                throw e;
            }
            // Jeśli wystąpił błąd (np. 401), pozwalamy użytkownikowi pozostać na stronie layoutu unauthorized
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