export interface Base {
    status: string;
}

export interface Category {
    category_id: number;
    name: string;
    color?: string;
}

export interface Categories {
    categories: Category[];
}

export interface Expense {
    expense_id: number;
    category: string;
    amount: number;
    date?: string;
    description?: string;
}

export interface PaginatedExpenses {
    expenses: Expense[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export type Expenses = PaginatedExpenses;

export interface Summary {
    totalBalance: number;
    monthlyExpenses: number;
    budgetRemaining: number;
    percentageUsed: number;
}

export interface ChartData {
    barChartData: {
        month: string;
        expenses: number;
    }[];
    categoryData: {
        name: string;
        value: number;
        color: string;
    }[];
}

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
