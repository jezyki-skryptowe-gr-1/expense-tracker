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
import { useUpdateCategoryMutation } from '../../query'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import type { Category } from '../../types'
import {CATEGORY_COLORS} from "@/features/dashboard/components/addCategoryModal";

interface EditCategoryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    category: Category | null
}

export function EditCategoryModal({ open, onOpenChange, category }: EditCategoryModalProps) {
    const updateCategoryMutation = useUpdateCategoryMutation()
    const form = useForm<AddCategoryFormData>({
        resolver: zodResolver(addCategorySchema),
        defaultValues: {
            name: '',
            color: CATEGORY_COLORS[0].value
        }
    })

    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                color: category.color || CATEGORY_COLORS[0].value
            })
        }
    }, [category, form])

    const onSubmit = (data: AddCategoryFormData) => {
        if (!category) return

        updateCategoryMutation.mutate({
            category_id: category.category_id,
            category: data.name,
            color: data.color
        }, {
            onSuccess: () => {
                toast.success('Kategoria została zaktualizowana')
                onOpenChange(false)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Nie udało się zaktualizować kategorii')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Tag className="size-5" />
                        Edytuj Kategorię
                    </DialogTitle>
                    <DialogDescription>Zmień nazwę lub kolor kategorii.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">
                            <FormInput<AddCategoryFormData>
                                name="name"
                                label="Nazwa kategorii"
                                placeholder="np. Rozrywka, Zdrowie..."
                                icon={Tag}
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
                            <Button type="submit" disabled={updateCategoryMutation.isPending}>
                                {updateCategoryMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}