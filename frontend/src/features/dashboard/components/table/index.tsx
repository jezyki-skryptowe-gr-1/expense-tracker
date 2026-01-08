"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormInput from "@/components/formInput"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Search, X, DollarSign, Filter} from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCategoriesQuery, useExpensesQuery } from "../../query"
import { Skeleton } from "@/components/ui/skeleton"
import { format, startOfMonth } from "date-fns"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"

interface FilterFormValues {
    search: string
    category: string
    from: string
    to: string
    minAmount: number | undefined
    maxAmount: number | undefined
}

export function TransactionsTable() {
    const search = useSearch({ from: '/_dashboardLayout/dashboard' })
    const navigate = useNavigate()

    const searchQuery = search.search || ""
    const selectedCategory = search.category || "all"
    const dateFrom = search.from || format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const dateTo = search.to || format(new Date(), 'yyyy-MM-dd')
    const minAmount = search.minAmount
    const maxAmount = search.maxAmount

    const form = useForm<FilterFormValues>({
        defaultValues: {
            search: searchQuery,
            category: selectedCategory,
            from: dateFrom,
            to: dateTo,
            minAmount: minAmount,
            maxAmount: maxAmount,
        }
    })

    useEffect(() => {
        form.reset({
            search: searchQuery,
            category: selectedCategory,
            from: dateFrom,
            to: dateTo,
            minAmount: minAmount,
            maxAmount: maxAmount,
        })
    }, [searchQuery, selectedCategory, dateFrom, dateTo, minAmount, maxAmount, form])

    const { data: expensesData, isLoading: expensesLoading, isFetching: expensesFetching } = useExpensesQuery({
        search: searchQuery,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        from: dateFrom,
        to: dateTo,
        minAmount,
        maxAmount
    })

    const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesQuery()

    const categories = categoriesData?.categories || []

    const handleSearch = (data: FilterFormValues) => {
        navigate({
            to: '/dashboard',
            search: (prev: any) => ({
                ...prev,
                search: data.search === "" ? undefined : data.search,
                category: data.category === "all" ? undefined : data.category,
                from: data.from,
                to: data.to,
                minAmount: data.minAmount === undefined || data.minAmount === ("" as any) ? undefined : Number(data.minAmount),
                maxAmount: data.maxAmount === undefined || data.maxAmount === ("" as any) ? undefined : Number(data.maxAmount),
            })
        })
    }

    const clearFilters = () => {
        navigate({
            to: '/dashboard',
            search: (prev: any) => ({
                ...prev,
                search: undefined,
                category: undefined,
                from: undefined,
                to: undefined,
                minAmount: undefined,
                maxAmount: undefined,
            })
        })
    }

    const hasActiveFilters = !!searchQuery || selectedCategory !== "all" || minAmount !== undefined || maxAmount !== undefined
    const isPending = expensesLoading || expensesFetching

    return (
        <Card className="border-border/50">
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ostatnie Transakcje</CardTitle>
                            <CardDescription>Historia Twoich wydatków</CardDescription>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground" disabled={isPending}>
                                <X className="mr-2 size-4" />
                                Wyczyść filtry
                            </Button>
                        )}
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSearch)} className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <FormInput<FilterFormValues>
                                    name="search"
                                    placeholder="Szukaj transakcji..."
                                    icon={Search}
                                    disabled={isPending}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={isPending}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full sm:w-[180px]">
                                                        <SelectValue placeholder="Kategoria" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="all">Wszystkie</SelectItem>
                                                    {categoriesLoading ? (
                                                        <div className="p-2 text-xs text-muted-foreground">Ładowanie...</div>
                                                    ) : (
                                                        categories.map((category: any) => (
                                                            <SelectItem key={category.category_id} value={category.name}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <FormInput<FilterFormValues>
                                    name="minAmount"
                                    label="Kwota od"
                                    placeholder="Min"
                                    type="number"
                                    icon={DollarSign}
                                    disabled={isPending}
                                />
                                <FormInput<FilterFormValues>
                                    name="maxAmount"
                                    label="Kwota do"
                                    placeholder="Max"
                                    type="number"
                                    icon={DollarSign}
                                    disabled={isPending}
                                />
                            </div>

                            <div className="flex flex-row gap-3 items-center">
                                <FormInput<FilterFormValues>
                                    name="from"
                                    label="Od"
                                    type="date"
                                    disabled={isPending}
                                />
                                <FormInput<FilterFormValues>
                                    name="to"
                                    label="Do"
                                    type="date"
                                    disabled={isPending}
                                />
                            </div>

                            <Button 
                                type="submit"
                                className="w-full" 
                                disabled={isPending}
                            >
                                <Filter className="mr-2 size-4" />
                                {isPending ? 'Szukanie...' : 'Wyszukaj'}
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Opis</TableHead>
                            <TableHead className="hidden sm:table-cell">Kategoria</TableHead>
                            <TableHead className="hidden md:table-cell">Data</TableHead>
                            <TableHead className="text-right">Kwota</TableHead>
                        </TableRow>
                    </TableHeader>
                    {expensesData !== undefined && (
                        <TableBody>
                            {isPending && expensesData.length === 0 ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={5}>
                                            <Skeleton className="h-12 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : expensesData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-semibold">Brak wyników</span>
                                            <span className="text-sm">Zmień filtry, aby zobaczyć transakcje.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expensesData.map((transaction) => {
                                    return (
                                        <TableRow key={transaction.expense_id} className={isPending ? "opacity-50" : ""}>
                                            <TableCell>
                                                <div className="p-2 rounded-lg w-fit bg-card">
                                                    <DollarSign className="size-4 text-muted-foreground" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{transaction.notes || 'Bez opisu'}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline" className="font-normal">
                                                    {categories.find(c => c.category_id === transaction.category_id)?.name || 'Nieznana'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {transaction.transaction_date ? new Date(transaction.transaction_date).toLocaleDateString("pl-PL") : 'Brak daty'}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold whitespace-nowrap">
                                                {transaction.amount} PLN
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    )}
                </Table>

            </CardContent>
        </Card>
    )
}