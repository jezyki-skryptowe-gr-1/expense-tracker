import { z } from 'zod';

export const BaseSchema = z.object({
    status: z.string(),
});

export type Base = z.infer<typeof BaseSchema>;

export const CategorySchema = z.object({
    category_id: z.number(),
    name: z.string(),
    color: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CategoriesSchema = z.object({
    categories: z.array(CategorySchema),
});

export type Categories = z.infer<typeof CategoriesSchema>;

export const ExpenseSchema = z.object({
    expense_id: z.number(),
    category: z.string(),
    amount: z.number(),
    date: z.string().optional(),
    description: z.string().optional(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

export const ExpensesSchema = z.array(ExpenseSchema);

export type Expenses = z.infer<typeof ExpensesSchema>;

export interface UpdateUserRequest {
    budget: number;
}

export interface AddExpenseRequest {
    category: string;
    amount: number;
    description?: string;
    date?: string;
}

export interface UpdateExpenseRequest extends AddExpenseRequest {
    expense_id: number;
}

export interface AddCategoryRequest {
    category: string;
    color?: string;
}

export interface UpdateCategoryRequest {
    category_id: number;
    category: string;
}
