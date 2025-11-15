import { z } from 'zod'

export const signupSchema = z.object({
    name: z.string().min(1, 'Imię i nazwisko jest wymagane'),
    email: z.string().email('Nieprawidłowy adres email'),
    password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
    confirmPassword: z.string().min(8, 'Potwierdzenie hasła jest wymagane'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
})

export type SignupFormData = z.infer<typeof signupSchema>

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email jest wymagany' })
        .email({ message: 'Nieprawidłowy format email' }),
    password: z
        .string()
        .min(8, { message: 'Hasło musi mieć minimum 8 znaków' })
})

export type LoginFormData = z.infer<typeof loginSchema>