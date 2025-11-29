"use client"

import { useForm } from 'react-hook-form'
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

interface AddExpenseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const CATEGORIES = ["Jedzenie", "Transport", "Dom", "Zakupy", "Rozrywka", "Zdrowie", "Inne"]

export function AddExpenseModal({ open, onOpenChange }: AddExpenseModalProps) {
    const form = useForm<AddExpenseFormData>({
        resolver: zodResolver(addExpenseSchema),
        defaultValues: {
            description: '',
            amount: '',
            category: '',
            date: new Date()
        }
    })

    const onSubmit = (_data: AddExpenseFormData) => {
        form.reset()
        onOpenChange(false)
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
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput<AddExpenseFormData>
                                    name="description"
                                    label="Opis"
                                    placeholder="Na co wydałeś pieniądze?"
                                    icon={FileText}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kategoria</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Wybierz..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CATEGORIES.map((cat) => (
                                                        <SelectItem key={cat} value={cat}>
                                                            {cat}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                                        className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
                                                    onSelect={field.onChange}
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
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Anuluj
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                Dodaj wydatek
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}