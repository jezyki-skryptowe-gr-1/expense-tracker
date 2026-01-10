"use client"

import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { pl } from "date-fns/locale"
import FormInput from '@/components/formInput'
import { DollarSign, CalendarIcon, FileText } from 'lucide-react'
import { addExpenseSchema, type AddExpenseFormData } from '../../schemas'
import { useAddExpenseMutation, useCategoriesQuery } from '../../query'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'

interface AddExpenseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
    const { data: categoriesData, isLoading: isLoadingCategories } = useCategoriesQuery()
    const addExpenseMutation = useAddExpenseMutation()
    const form = useForm<AddExpenseFormData>({
        resolver: zodResolver(addExpenseSchema),
        defaultValues: {
            description: '',
            amount: '',
            category: '',
            date: new Date()
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                description: '',
                amount: '',
                category: '',
                date: new Date()
            })
        }
    }, [open, form])

    const onSubmit = (data: AddExpenseFormData) => {
        addExpenseMutation.mutate({
            amount: Number(data.amount),
            category_id: Number(data.category),
            description: data.description,
            date: format(data.date, 'yyyy-MM-dd')
        }, {
            onSuccess: () => {
                toast.success('Wydatek został dodany')
                form.reset()
                onOpenChange(false)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Nie udało się dodać wydatku')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="size-5" />
                        Dodaj Wydatek
                    </DialogTitle>
                    <DialogDescription>Wprowadź szczegóły swojego wydatku</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormInput<AddExpenseFormData>
                                name="amount"
                                label="Kwota (PLN)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                icon={DollarSign}
                            />
                            <FormInput<AddExpenseFormData>
                                name="description"
                                label="Opis"
                                placeholder="Na co wydałeś pieniądze?"
                                icon={FileText}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategoria</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Wybierz..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoadingCategories ? (
                                                        <div className="flex items-center justify-center py-2">
                                                            <Loader2 className="size-4 animate-spin" />
                                                        </div>
                                                    ) : categoriesData?.categories && categoriesData.categories.length > 0 ? (
                                                        categoriesData.categories.map((cat) => (
                                                            <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="size-2 rounded-full"
                                                                        style={{ backgroundColor: cat.color }}
                                                                    />
                                                                    {cat.name}
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className="text-xs text-center py-2 text-muted-foreground">
                                                            Brak kategorii. Dodaj je najpierw.
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center gap-2">
                                                <CalendarIcon className="size-4" />
                                                Data
                                            </FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP", { locale: pl })
                                                            ) : (
                                                                <span>Wybierz datę</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            if (date) field.onChange(date)
                                                        }}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={addExpenseMutation.isPending}>
                                {addExpenseMutation.isPending ? 'Dodawanie...' : 'Dodaj wydatek'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}