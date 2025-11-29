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
    { month: "Sty", wydatki: 2400 },
    { month: "Lut", wydatki: 1398 },
    { month: "Mar", wydatki: 9800 },
    { month: "Kwi", wydatki: 3908 },
    { month: "Maj", wydatki: 4800 },
    { month: "Cze", wydatki: 3800 },
]

export const categoryData = [
    { name: "Jedzenie", value: 2400, color: "hsl(var(--chart-1))" },
    { name: "Transport", value: 1398, color: "hsl(var(--chart-2))" },
    { name: "Dom", value: 9800, color: "hsl(var(--chart-3))" },
    { name: "Rozrywka", value: 3908, color: "hsl(var(--chart-4))" },
    { name: "Inne", value: 4800, color: "hsl(var(--chart-5))" },
]

export const allTransactions: Transaction[] = [
    { id: 1, description: "Zakupy spożywcze - Biedronka", amount: -125.5, date: "2024-01-15", category: "Jedzenie", icon: Utensils },
    { id: 2, description: "Opłata za mieszkanie", amount: -1200.0, date: "2024-01-14", category: "Dom", icon: Home },
    { id: 3, description: "Tankowanie - Orlen", amount: -280.0, date: "2024-01-13", category: "Transport", icon: Car },
    { id: 4, description: "Zakupy online - Allegro", amount: -349.99, date: "2024-01-12", category: "Zakupy", icon: ShoppingBag },
    { id: 5, description: "Restaurant - Pizza Hut", amount: -89.5, date: "2024-01-11", category: "Jedzenie", icon: Utensils },
    { id: 6, description: "Zakupy w Kaufland", amount: -156.3, date: "2024-01-10", category: "Jedzenie", icon: Utensils },
    { id: 7, description: "Uber", amount: -45.0, date: "2024-01-09", category: "Transport", icon: Car },
    { id: 8, description: "Netflix", amount: -49.99, date: "2024-01-08", category: "Zakupy", icon: ShoppingBag },
    { id: 9, description: "Prąd", amount: -320.0, date: "2024-01-07", category: "Dom", icon: Home },
    { id: 10, description: "McDonald's", amount: -38.5, date: "2024-01-06", category: "Jedzenie", icon: Utensils },
    { id: 11, description: "Paliwo BP", amount: -290.0, date: "2024-01-05", category: "Transport", icon: Car },
    { id: 12, description: "Lidl", amount: -98.7, date: "2024-01-04", category: "Jedzenie", icon: Utensils },
]