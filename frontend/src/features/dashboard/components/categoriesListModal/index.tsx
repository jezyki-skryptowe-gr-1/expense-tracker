import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, Trash2, Plus } from 'lucide-react'
import { useState } from "react"
import { DeleteConfirmationModal } from "../../../../components/deleteConfirmationModal"
import { AddCategoryModal } from "../addCategoryModal"

interface CategoriesListModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const MOCK_CATEGORIES = [
    { id: 1, name: "Jedzenie", color: "#ef4444", count: 24 },
    { id: 2, name: "Transport", color: "#f97316", count: 12 },
    { id: 3, name: "Dom", color: "#eab308", count: 8 },
    { id: 4, name: "Zakupy", color: "#22c55e", count: 15 },
    { id: 5, name: "Rozrywka", color: "#3b82f6", count: 6 },
    { id: 6, name: "Zdrowie", color: "#a855f7", count: 4 },
    { id: 7, name: "Inne", color: "#6b7280", count: 3 },
]

export function CategoriesListModal({ open, onOpenChange }: CategoriesListModalProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<(typeof MOCK_CATEGORIES)[0] | null>(null)
    const [addModalOpen, setAddModalOpen] = useState(false)

    const handleDeleteClick = (category: (typeof MOCK_CATEGORIES)[0]) => {
        setSelectedCategory(category)
        setDeleteModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        console.log("[v0] Deleting category:", selectedCategory)
        setSelectedCategory(null)
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
                            <div className="space-y-2">
                                {MOCK_CATEGORIES.map((category) => (
                                    <div
                                        key={category.id}
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
                                                <p className="text-sm text-muted-foreground">{category.count} transakcji</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{category.count}</Badge>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDeleteClick(category)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
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