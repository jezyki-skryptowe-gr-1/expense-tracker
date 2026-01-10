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
    transaction_id: number;
    category_id: number;
    amount: number;
    transaction_date?: string;
    notes?: string;
}

export interface Summary {
    totalBalance: number;
    monthlyExpenses: number;
    budgetRemaining: number;
    percentageUsed: number;
}

export interface ChartData {
    barChartData: {
        month: string;
        expenses: {
            amount: number;
            category: string;
            date: string;
            description: string;
            expense_id: number;
        }[];
    }[];
    categoryData: {
        category_id: number;
        color: string;
        name: string;
    }[];
}

export interface UpdateUserRequest {
    budget: number;
}

export interface AddExpenseRequest {
    category_id: number;
    amount: number;
    description?: string;
    date?: string;
}

export interface UpdateExpenseRequest extends AddExpenseRequest {
    transaction_id: number;
}

export interface AddCategoryRequest {
    category: string;
    color?: string;
}

export interface UpdateCategoryRequest {
    category_id: number;
    category: string;
    color?: string;
}
