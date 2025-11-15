import LoginForm from '@/features/components/loginForm'
import SignupForm from '@/features/components/signupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: App,
})

function App() {
    return (
        <div className="text-center flex items-center justify-center w-full min-h-screen">
            {/* <SignupForm /> */}
            <LoginForm />
        </div>
    )
}
