"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import FormInput from "@/components/formInput"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X, DollarSign, Filter, Trash2, Pencil } from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCategoriesQuery, useExpensesQuery, useDeleteExpenseMutation } from "../../query"
import { Skeleton } from "@/components/ui/skeleton"
import { format, startOfMonth } from "date-fns"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "react-toastify"
import { DeleteConfirmationModal } from "@/components/deleteConfirmationModal"
import { EditExpenseModal } from "../editExpenseModal"
import type { Expense } from "../../types"

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
    const deleteExpenseMutation = useDeleteExpenseMutation()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null)
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)

    const searchQuery = search.search || ""
    const selectedCategory = search.category ? search.category.toString() : "all"
    const defaultDateFrom = format(startOfMonth(new Date()), 'yyyy-MM-dd')
    const defaultDateTo = format(new Date(), 'yyyy-MM-dd')

    const dateFrom = search.from || defaultDateFrom
    const dateTo = search.to || defaultDateTo
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
        category: search.category,
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
                category: data.category === "all" ? undefined : Number(data.category),
                from: data.from,
                to: data.to,
                minAmount: data.minAmount === undefined || data.minAmount === ("" as any) ? undefined : Number(data.minAmount),
                maxAmount: data.maxAmount === undefined || data.maxAmount === ("" as any) ? undefined : Number(data.maxAmount),
            })
        })
    }

    const clearFilters = () => {
        form.reset({
            search: "",
            category: "all",
            from: defaultDateFrom,
            to: defaultDateTo,
            minAmount: undefined,
            maxAmount: undefined,
        })

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

    const hasActiveFilters = !!searchQuery || 
        selectedCategory !== "all" || 
        minAmount !== undefined || 
        maxAmount !== undefined ||
        dateFrom !== defaultDateFrom ||
        dateTo !== defaultDateTo
    const isPending = expensesLoading || expensesFetching

    const handleDelete = (id: number) => {
        setExpenseToDelete(id)
        setDeleteModalOpen(true)
    }

    const handleEdit = (expense: Expense) => {
        setExpenseToEdit(expense)
        setEditModalOpen(true)
    }

    const confirmDelete = () => {
        console.log("[DEBUG_LOG] confirmDelete called, expenseToDelete:", expenseToDelete)
        if (expenseToDelete !== null) {
            deleteExpenseMutation.mutate(expenseToDelete, {
                onSuccess: () => {
                    console.log("[DEBUG_LOG] delete success")
                    toast.success('Wydatek został usunięty')
                    setExpenseToDelete(null)
                    setDeleteModalOpen(false)
                },
                onError: (error: any) => {
                    console.error("[DEBUG_LOG] delete error:", error)
                    toast.error(error.response?.data?.message || 'Nie udało się usunąć wydatku')
                }
            })
        } else {
            console.warn("[DEBUG_LOG] confirmDelete called but expenseToDelete is null")
        }
    }

    return (
        <Card className="border-border/50">
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ostatnie Transakcje</CardTitle>
                            <CardDescription>Historia Twoich wydatków</CardDescription>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSearch)} className="flex flex-col gap-3">
                            <FormInput<FilterFormValues>
                                name="search"
                                label="Szukaj"
                                placeholder="Szukaj transakcji..."
                                disabled={isPending}
                            />
                            <div className="flex flex-col md:flex-row gap-3 items-start">
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

                                <div className="flex-1 md:min-w-[180px] min-w-full">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="mb-1 font-semibold">Kategoria</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    disabled={isPending}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full h-11! border-border/50 focus:ring-primary">
                                                            <SelectValue placeholder="Kategoria" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="all">Wszystkie</SelectItem>
                                                        {categoriesLoading ? (
                                                            <div className="p-2 text-xs text-muted-foreground">Ładowanie...</div>
                                                        ) : (
                                                            categories.map((category: any) => (
                                                                <SelectItem key={category.category_id} value={category.category_id.toString()}>
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
                            </div>

                            <div className="flex flex-row gap-3 items-start">
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
                            
                            {hasActiveFilters && (
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    className="w-full"
                                    onClick={clearFilters}
                                    disabled={isPending}
                                >
                                    <X className="mr-2 size-4" />
                                    Wyczyść filtry
                                </Button>
                            )}
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
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    {expensesData !== undefined && (
                        <TableBody>
                            {isPending && (expensesData === undefined || expensesData.length === 0) ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}>
                                            <Skeleton className="h-12 w-full" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : expensesData === undefined || expensesData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="font-semibold">Brak wyników</span>
                                            <span className="text-sm">Zmień filtry, aby zobaczyć transakcje.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                expensesData.map((transaction) => {
                                    return (
                                        <TableRow key={transaction.transaction_id} className={isPending ? "opacity-50" : ""}>
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
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                        onClick={() => handleEdit(transaction)}
                                                        disabled={isPending}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(transaction.transaction_id)}
                                                        disabled={deleteExpenseMutation.isPending}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    )}
                </Table>

            </CardContent>
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                title="Usuń wydatek"
                description="Czy na pewno chcesz usunąć ten wydatek?"
                onConfirm={confirmDelete}
                isLoading={deleteExpenseMutation.isPending}
            />
            <EditExpenseModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                expense={expenseToEdit}
            />
        </Card>
    )
}