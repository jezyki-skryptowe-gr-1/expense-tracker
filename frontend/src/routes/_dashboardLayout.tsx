import { Outlet, createFileRoute} from '@tanstack/react-router'
// import { authApi } from '@/features/auth/api'

export const Route = createFileRoute('/_dashboardLayout')({
    // beforeLoad: async ({ context }) => {
    //     const isMaybeLoggedIn = localStorage.getItem('auth_hint') === 'true';
    //
    //     if (!isMaybeLoggedIn) {
    //         throw redirect({
    //             to: '/',
    //         });
    //     }
    //
    //     try {
    //         await context.queryClient.ensureQueryData({
    //             queryKey: ['user'],
    //             queryFn: authApi.getMe,
    //         });
    //     } catch {
    //         throw redirect({
    //             to: '/',
    //         });
    //     }
    // },
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