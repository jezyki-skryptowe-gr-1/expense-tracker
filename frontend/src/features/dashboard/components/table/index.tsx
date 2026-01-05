"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Search, ChevronLeft, ChevronRight, X, DollarSign} from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCategoriesQuery, useExpensesQuery } from "../../query"
import { Skeleton } from "@/components/ui/skeleton"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { dashboardApi } from "../../api"

export function TransactionsTable() {
    const search = useSearch({ from: '/_dashboardLayout/dashboard' })
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const currentPage = search.page || 1
    const searchQuery = search.search || ""
    const selectedCategory = search.category || "all"
    const itemsPerPage = 1

    const { data: expensesData, isLoading: expensesLoading } = useExpensesQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: selectedCategory === "all" ? undefined : selectedCategory
    })
    
    const { data: categoriesData, isLoading: categoriesLoading } = useCategoriesQuery()
    
    useEffect(() => {
        if (expensesData && currentPage < expensesData.totalPages) {
            const nextPageParams = {
                page: currentPage + 1,
                limit: itemsPerPage,
                search: searchQuery,
                category: selectedCategory === "all" ? undefined : selectedCategory
            }
            queryClient.prefetchQuery({
                queryKey: ['expenses', nextPageParams],
                queryFn: () => dashboardApi.getExpenses(nextPageParams),
            })
        }
    }, [expensesData, currentPage, searchQuery, selectedCategory, queryClient])

    const transactions = expensesData?.expenses || []
    const categories = categoriesData?.categories || []
    const totalPages = expensesData?.totalPages || 1

    const handleFilterChange = (key: string, value: string) => {
        navigate({
            to: '/dashboard',
            search: (prev: any) => ({
                ...prev,
                [key]: value || undefined,
                page: 1
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
                page: 1
            })
        })
    }

    const hasActiveFilters = !!searchQuery || selectedCategory !== "all"

    if (expensesLoading || categoriesLoading) {
        return (
            <Card className="border-border/50">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
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
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                                <X className="mr-2 size-4" />
                                Wyczyść filtry
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Szukaj transakcji..."
                                    value={searchQuery}
                                    onChange={(e) => handleFilterChange("search", e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={(val) => handleFilterChange("category", val)}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Kategoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Wszystkie</SelectItem>
                                    {categories.map((category: any) => (
                                        <SelectItem key={category.category_id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-row gap-3 items-center opacity-50 cursor-not-allowed">
                            <Input
                                type="number"
                                placeholder="Kwota od (PLN)"
                                value=""
                                disabled
                                className="flex-1"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Kwota do (PLN)"
                                value=""
                                disabled
                                className="flex-1"
                            />
                        </div>
                    </div>
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
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-semibold">Brak wyników</span>
                                        <span className="text-sm">Zmień filtry, aby zobaczyć transakcje.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction) => {
                                return (
                                    <TableRow key={transaction.expense_id}>
                                        <TableCell>
                                            <div className="p-2 rounded-lg w-fit bg-card">
                                                <DollarSign className="size-4 text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{transaction.description || 'Bez opisu'}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline" className="font-normal">
                                                {transaction.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {transaction.date ? new Date(transaction.date).toLocaleDateString("pl-PL") : 'Brak daty'}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold whitespace-nowrap">
                                            {transaction.amount.toFixed(2)} PLN
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>

                {transactions.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-muted-foreground">
                            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, expensesData?.totalCount || 0)} z {expensesData?.totalCount || 0}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => navigate({ to: '/dashboard', search: (prev: any) => ({ ...prev, page: Math.max(1, currentPage - 1) }) })}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>
                            <div className="text-sm font-medium w-[60px] text-center">
                                {currentPage} / {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => navigate({ to: '/dashboard', search: (prev: any) => ({ ...prev, page: Math.min(totalPages, currentPage + 1) }) })}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}