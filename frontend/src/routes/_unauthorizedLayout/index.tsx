import LoginView from '@/features/auth/views/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthorizedLayout/')({
    component: LoginView,
})