import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tag, Trash2, Plus, Loader2 } from 'lucide-react'
import { useState } from "react"
import { DeleteConfirmationModal } from "@/components/deleteConfirmationModal"
import { AddCategoryModal } from "../addCategoryModal"
import { useCategoriesQuery, useDeleteCategoryMutation } from "../../query"
import { toast } from "react-toastify"
import type {Category} from "@/features/dashboard/types";

interface CategoriesListModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CategoriesListModal({ open, onOpenChange }: CategoriesListModalProps) {
    const { data, isLoading } = useCategoriesQuery()
    const deleteCategoryMutation = useDeleteCategoryMutation()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [addModalOpen, setAddModalOpen] = useState(false)

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category)
        setDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (!selectedCategory) return

        deleteCategoryMutation.mutate(selectedCategory.category_id, {
            onSuccess: () => {
                toast.success('Kategoria została usunięta')
                setDeleteModalOpen(false)
                setSelectedCategory(null)
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Nie udało się usunąć kategorii')
            }
        })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tag className="size-5" />
                            Wszystkie Kategorie
                        </DialogTitle>
                        <DialogDescription>Zarządzaj swoimi kategoriami wydatków</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex justify-end mb-4">
                            <Button size="sm" onClick={() => setAddModalOpen(true)}>
                                <Plus className="size-4 mr-2" />
                                Dodaj kategorię
                            </Button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto pr-4">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="size-8 animate-spin text-primary" />
                                </div>
                            ) : data?.categories && data.categories.length > 0 ? (
                                <div className="space-y-2">
                                    {data.categories.map((category) => (
                                        <div
                                            key={category.category_id}
                                            className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="size-4 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                    aria-label={`Kolor: ${category.color}`}
                                                />
                                                <div>
                                                    <p className="font-medium">{category.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteClick(category)}
                                                    disabled={deleteCategoryMutation.isPending}
                                                >
                                                    {deleteCategoryMutation.isPending && selectedCategory?.category_id === category.category_id ? (
                                                        <Loader2 className="size-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="size-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nie znaleziono żadnych kategorii. Dodaj pierwszą, aby zacząć!
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <DeleteConfirmationModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                title={`Usuń kategorię "${selectedCategory?.name}"`}
                description="Czy na pewno chcesz usunąć tę kategorię?"
                onConfirm={handleDeleteConfirm}
            />
            <AddCategoryModal
                open={addModalOpen}
                onOpenChange={setAddModalOpen}
            />
        </>
    )
}