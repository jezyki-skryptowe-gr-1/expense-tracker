import { Outlet, createFileRoute } from '@tanstack/react-router'
// import { authApi } from '@/features/auth/api'

export const Route = createFileRoute('/_unauthorizedLayout')({
    // beforeLoad: async ({ context }) => {
    //     const isMaybeLoggedIn = localStorage.getItem('auth_hint') === 'true';
    //
    //     if (!isMaybeLoggedIn) {
    //         return;
    //     }
    //
    //     try {
    //         await context.queryClient.ensureQueryData({
    //             queryKey: ['user'],
    //             queryFn: authApi.getMe,
    //         });
    //         throw redirect({
    //             to: '/dashboard',
    //             search: {
    //                 from: undefined,
    //                 to: undefined,
    //                 search: undefined,
    //                 category: undefined,
    //                 minAmount: undefined,
    //                 maxAmount: undefined
    //             }
    //         });
    //     } catch (e) {
    //         if (e instanceof Error && 'status' in e && e.status === 307) {
    //             throw e;
    //         }
    //         // Not logged in or session expired, stay here
    //     }
    // },
    component: UnauthorizedLayout,
})

function UnauthorizedLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
        </div>
    )
}