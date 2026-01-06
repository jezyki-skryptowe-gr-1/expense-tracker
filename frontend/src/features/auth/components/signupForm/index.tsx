import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormInput from '@/components/formInput'
import { signupSchema, type SignupFormData } from '@/features/auth/schemas'
import { Lock, Mail, User, DollarSign } from 'lucide-react'
import { Link, useRouter } from '@tanstack/react-router'
import { useSignupMutation } from '@/features/auth/query'
import { toast } from 'react-toastify'

const SignupForm = () => {
    const router = useRouter()
    const signupMutation = useSignupMutation()

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            budget: '0'
        }
    })

    const onSubmit = (data: SignupFormData) => {
        signupMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Konto zostało utworzone! Zaloguj się.')
                router.navigate({ to: '/' })
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Błąd rejestracji')
            }
        })
    }

    return (
        <Card className="w-full max-w-md border-border/50 shadow-2xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight">
                    Utwórz konto
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Wprowadź swoje dane, aby założyć nowe konto
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormInput<SignupFormData>
                            name="name"
                            label="Imię i nazwisko"
                            placeholder="Jan Kowalski"
                            icon={User}
                        />

                        <FormInput<SignupFormData>
                            name="email"
                            label="Adres email"
                            placeholder="jan@example.com"
                            icon={Mail}
                        />

                        <FormInput<SignupFormData>
                            name="password"
                            label="Hasło"
                            placeholder="••••••••"
                            icon={Lock}
                            type='password'
                        />

                        <FormInput<SignupFormData>
                            name="confirmPassword"
                            label="Potwierdź hasło"
                            placeholder="••••••••"
                            icon={Lock}
                            type='password'
                        />

                        <FormInput<SignupFormData>
                            name="budget"
                            label="Miesięczny budżet (PLN)"
                            placeholder="0.00"
                            icon={DollarSign}
                            type='number'
                        />

                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all"
                            disabled={signupMutation.isPending}
                        >
                            {signupMutation.isPending ? 'Rejestrowanie...' : 'Zarejestruj się'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-muted-foreground">
                    Masz już konto?{' '}
                    <Link to="/" className="text-primary hover:underline font-medium" viewTransition>
                        Zaloguj się
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default SignupForm