"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react"
import { allTransactions } from "../../fakeData"

export function TransactionsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    const [amountFrom, setAmountFrom] = useState("")
    const [amountTo, setAmountTo] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const filteredTransactions = allTransactions.filter((transaction) => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory

        const amount = Math.abs(transaction.amount)
        const from = amountFrom ? parseFloat(amountFrom) : 0
        const to = amountTo ? parseFloat(amountTo) : Infinity
        const matchesAmount = amount >= from && amount <= to

        return matchesSearch && matchesCategory && matchesAmount
    })

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    const handleFilterChange = (setter: (val: string) => void, value: string) => {
        setter(value)
        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchQuery("")
        setSelectedCategory("all")
        setAmountFrom("")
        setAmountTo("")
        setCurrentPage(1)
    }

    const hasActiveFilters = searchQuery || selectedCategory !== "all" || amountFrom || amountTo

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
                                    onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={selectedCategory}
                                onValueChange={(val) => handleFilterChange(setSelectedCategory, val)}
                            >
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Kategoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Wszystkie</SelectItem>
                                    <SelectItem value="Jedzenie">Jedzenie</SelectItem>
                                    <SelectItem value="Transport">Transport</SelectItem>
                                    <SelectItem value="Dom">Dom</SelectItem>
                                    <SelectItem value="Zakupy">Zakupy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-row gap-3 items-center">
                            <Input
                                type="number"
                                placeholder="Kwota od (PLN)"
                                value={amountFrom}
                                onChange={(e) => handleFilterChange(setAmountFrom, e.target.value)}
                                className="flex-1"
                                min="0"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="number"
                                placeholder="Kwota do (PLN)"
                                value={amountTo}
                                onChange={(e) => handleFilterChange(setAmountTo, e.target.value)}
                                className="flex-1"
                                min="0"
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
                        {paginatedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="font-semibold">Brak wyników</span>
                                        <span className="text-sm">Zmień filtry, aby zobaczyć transakcje.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction) => {
                                const Icon = transaction.icon
                                return (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            <div className="p-2 rounded-lg w-fit bg-card">
                                                <Icon className="size-4 text-muted-foreground" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{transaction.description}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant="outline" className="font-normal">
                                                {transaction.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">
                                            {new Date(transaction.date).toLocaleDateString("pl-PL")}
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

                {filteredTransactions.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-xs text-muted-foreground">
                            {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} z {filteredTransactions.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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