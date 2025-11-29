import { z } from 'zod'

export const addCategorySchema = z.object({
    name: z.string().min(1, 'Nazwa kategorii jest wymagana').max(50, 'Nazwa kategorii może mieć maksymalnie 50 znaków'),
    color: z.string().min(1, 'Kolor jest wymagany'),
})

export type AddCategoryFormData = z.infer<typeof addCategorySchema>

export const addExpenseSchema = z.object({
    description: z.string().min(1, 'Opis jest wymagany').max(200, 'Opis może mieć maksymalnie 200 znaków'),
    amount: z.string().min(1, 'Kwota jest wymagana').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Kwota musi być liczbą większą od zera',
    }),
    category: z.string().min(1, 'Kategoria jest wymagana'),
    date: z.date({
        message: 'Data jest wymagana',
    }),
})

export type AddExpenseFormData = z.infer<typeof addExpenseSchema>
