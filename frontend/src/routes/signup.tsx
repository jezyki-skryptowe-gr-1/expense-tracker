import SignupForm from '@/features/components/signupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({
    component: Signup,
})

function Signup() {
    return (
        <div className="text-center flex items-center justify-center w-full min-h-screen">
            <SignupForm />
        </div>
    )
}