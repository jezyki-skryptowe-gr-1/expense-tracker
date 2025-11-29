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
import FormInput from '@/components/formInput'
import { Tag, Palette } from 'lucide-react'
import { addCategorySchema, type AddCategoryFormData } from '../../schemas'

interface AddCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const CATEGORY_COLORS = [
    { name: "Czerwony", value: "#ef4444" },
    { name: "Pomarańczowy", value: "#f97316" },
    { name: "Żółty", value: "#eab308" },
    { name: "Zielony", value: "#22c55e" },
    { name: "Niebieski", value: "#3b82f6" },
    { name: "Fioletowy", value: "#a855f7" },
    { name: "Różowy", value: "#ec4899" },
    { name: "Szary", value: "#6b7280" },
]

export function AddCategoryModal({ open, onOpenChange }: AddCategoryModalProps) {
    const form = useForm<AddCategoryFormData>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: {
            name: '',
            color: CATEGORY_COLORS[0].value
        }
    })

    const onSubmit = (data: AddCategoryFormData) => {
        console.log("[v0] Adding category:", data)
        // TODO: Implement category adding logic
        form.reset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="size-5" />
                        Dodaj Kategorię
                    </DialogTitle>
                    <DialogDescription>Utwórz nową kategorię wydatków. Nadaj jej nazwę i wybierz kolor.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <FormInput<AddCategoryFormData>
                                                name="name"
                                                label="Nazwa kategorii"
                                                placeholder="np. Rozrywka, Zdrowie..."
                                                icon={Tag}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2">
                                            <Palette className="size-4" />
                                            Kolor
                                        </FormLabel>
                                        <FormControl>
                                            <div className="grid grid-cols-8 gap-2">
                                                {CATEGORY_COLORS.map((color) => (
                                                    <button
                                                        key={color.value}
                                                        type="button"
                                                        onClick={() => field.onChange(color.value)}
                                                        className="size-10 rounded-lg border-2 transition-all hover:scale-110"
                                                        style={{
                                                            backgroundColor: color.value,
                                                            borderColor: field.value === color.value ? "hsl(var(--primary))" : "transparent",
                                                        }}
                                                        aria-label={color.name}
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
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
                                Dodaj kategorię
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}