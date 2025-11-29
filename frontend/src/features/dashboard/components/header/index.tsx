import { Button } from "@/components/ui/button"
import { AlignVerticalJustifyStart, TrendingUp } from "lucide-react"

export function DashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Witaj ponownie! Oto podsumowanie Twoich finansów.</p>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                    <TrendingUp className="mr-2 size-4" />
                    Export
                </Button>
                <AlignVerticalJustifyStart className="size-10" />
            </div>
        </div>
    )
}