import { Outlet, createFileRoute } from '@tanstack/react-router'
// import { requireNoAuth } from '@/utils'

export const Route = createFileRoute('/_unauthorizedLayout')({
    // beforeLoad: async () => {
    //     try {
    //         await requireNoAuth();
    //     } catch {
    //         throw redirect({
    //             to: '/dashboard',
    //             search: {},
    //         });
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