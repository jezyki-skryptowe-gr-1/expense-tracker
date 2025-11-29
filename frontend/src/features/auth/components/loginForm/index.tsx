import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
} from '@/components/ui/form'
import FormInput from '@/components/formInput'
import { loginSchema, type LoginFormData } from '@/features/auth/schemas'
import { Lock, Mail } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { useLoginMutation } from '@/features/auth/query'
import { toast } from 'react-toastify'
// import apiClient from '@/lib/api'

const LoginForm = () => {
    const router = useRouter()
    const loginMutation = useLoginMutation()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'test@test.com',
            password: 'test1234'
        }
    })

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data, {
            onSuccess: async () => {
                try {
                    // await apiClient.get('/auth/me');
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                }
                router.navigate({ to: '/dashboard' })
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Błąd logowania')
            }
        })
    }

    return (
        <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight">
                    Zaloguj się
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Wprowadź swoje dane, aby zalogować się do konta
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput<LoginFormData>
                            name="email"
                            label="Adres email"
                            placeholder="jan@example.com"
                            icon={Mail}
                        />

                        <FormInput<LoginFormData>
                            name="password"
                            label="Hasło"
                            placeholder="••••••••"
                            icon={Lock}
                            type='password'
                        />

                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? 'Logowanie...' : 'Zaloguj się'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    Nie masz konta?{' '}
                    <Link to="/signup" className="text-primary hover:underline font-medium" viewTransition>
                        Zarejestruj się
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default LoginForm