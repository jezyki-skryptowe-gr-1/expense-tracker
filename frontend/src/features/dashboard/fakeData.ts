import { Utensils, Home, Car, ShoppingBag, type LucideIcon } from "lucide-react"

export interface Transaction {
    id: number
    description: string
    amount: number
    date: string
    category: string
    icon: LucideIcon
}

export const barChartData = [
    { month: "Jan", expenses: 2400 },
    { month: "Feb", expenses: 1398 },
    { month: "Mar", expenses: 9800 },
    { month: "Apr", expenses: 3908 },
    { month: "May", expenses: 4800 },
    { month: "Jun", expenses: 3800 },
]

export const categoryData = [
    { name: "Food", value: 2400, color: "#3b82f6" },
    { name: "Transport", value: 1398, color: "#ef4444" },
    { name: "Home", value: 9800, color: "#22c55e" },
    { name: "Entertainment", value: 3908, color: "#f59e0b" },
    { name: "Other", value: 4800, color: "#a855f7" },
]

export const allTransactions: Transaction[] = [
    { id: 1, description: "Grocery shopping", amount: -125.5, date: "2024-01-15", category: "Food", icon: Utensils },
    { id: 2, description: "Rent", amount: -1200.0, date: "2024-01-14", category: "Home", icon: Home },
    { id: 3, description: "Fuel - Orlen", amount: -280.0, date: "2024-01-13", category: "Transport", icon: Car },
    { id: 4, description: "Online shopping", amount: -349.99, date: "2024-01-12", category: "Shopping", icon: ShoppingBag },
    { id: 5, description: "Restaurant - Pizza Hut", amount: -89.5, date: "2024-01-11", category: "Food", icon: Utensils },
    { id: 6, description: "Kaufland shopping", amount: -156.3, date: "2024-01-10", category: "Food", icon: Utensils },
    { id: 7, description: "Uber", amount: -45.0, date: "2024-01-09", category: "Transport", icon: Car },
    { id: 8, description: "Netflix", amount: -49.99, date: "2024-01-08", category: "Shopping", icon: ShoppingBag },
    { id: 9, description: "Electricity bill", amount: -320.0, date: "2024-01-07", category: "Home", icon: Home },
    { id: 10, description: "McDonald's", amount: -38.5, date: "2024-01-06", category: "Food", icon: Utensils },
    { id: 11, description: "Fuel BP", amount: -290.0, date: "2024-01-05", category: "Transport", icon: Car },
    { id: 12, description: "Lidl shopping", amount: -98.7, date: "2024-01-04", category: "Food", icon: Utensils },
]