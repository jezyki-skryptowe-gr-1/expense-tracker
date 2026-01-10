import SignupForm from '@/features/auth/components/signupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauthorizedLayout/signup')({
    component: Signup,
})

function Signup() {
    return (
        <div className="text-center flex items-center justify-center w-full min-h-screen px-2">
            <SignupForm />
        </div>
    )
}