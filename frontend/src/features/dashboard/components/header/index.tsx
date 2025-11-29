import { Button } from "@/components/ui/button"
import { AlignVerticalJustifyStart, Plus } from "lucide-react"

interface DashboardHeaderProps {
    onCategoriesClick: () => void;
    onAddExpenseClick: () => void;
}

export function DashboardHeader({ onCategoriesClick, onAddExpenseClick }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Witaj ponownie! Oto podsumowanie Twoich finansów.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="default" size="sm" onClick={onAddExpenseClick}>
                    <Plus className="mr-2 size-4" />
                    Dodaj wydatek
                </Button>
                <Button variant="outline" size="sm" onClick={onCategoriesClick}>
                    <AlignVerticalJustifyStart className="mr-2 size-4" />
                    Kategorie
                </Button>
            </div>
        </div>
    )
}