import { Button } from "@/components/ui/button"
import { AlignVerticalJustifyStart, Plus, User, LogOut, Settings } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { useUserQuery } from "@/features/auth/query"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardHeaderProps {
    onCategoriesClick: () => void;
    onAddExpenseClick: () => void;
    onEditProfile: () => void;
    onLogout: () => void;
}

export function DashboardHeader({ onCategoriesClick, onAddExpenseClick, onEditProfile, onLogout }: DashboardHeaderProps) {
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { data: user, isLoading } = useUserQuery()

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
                <div className="text-muted-foreground mt-1 min-h-[1.5rem] flex items-center">
                    {isLoading ? (
                        <Skeleton className="h-4 w-48" />
                    ) : (
                        <p>Witaj ponownie, {user?.login || 'Użytkowniku'}! Oto podsumowanie Twoich finansów.</p>
                    )}
                </div>
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
                <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User className="size-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                        <div className="space-y-1">
                            <div className="px-2 py-1.5 text-sm font-semibold border-b mb-1 truncate">
                                {isLoading ? <Skeleton className="h-4 w-full" /> : (user?.login || 'Użytkownik')}
                            </div>
                            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={onEditProfile}>
                                <Settings className="mr-2 size-4" />
                                Edytuj profil
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" size="sm" onClick={onLogout}>
                                <LogOut className="mr-2 size-4" />
                                Wyloguj
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}