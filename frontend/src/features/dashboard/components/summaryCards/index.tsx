import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { useSummaryQuery } from "../../query"
import { Skeleton } from "@/components/ui/skeleton"

export function SummaryCards() {
    const { data: summary, isLoading } = useSummaryQuery()

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-border/50">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-3 w-40 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const { 
        totalBalance = 0, 
        monthlyExpenses = 0, 
        budgetRemaining = 0, 
        percentageUsed = 0 
    } = summary || {}

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Całkowite Saldo</CardTitle>
                    <Wallet className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalBalance.toFixed(2)} PLN</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <TrendingUp className="size-3 text-green-500 mr-1" />
                        +12.5% od ostatniego miesiąca
                    </p>
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Miesięczne Wydatki</CardTitle>
                    <TrendingDown className="size-4 text-destructive" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">{monthlyExpenses.toFixed(2)} PLN</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {percentageUsed.toFixed(0)}% budżetu wykorzystane
                    </p>
                </CardContent>
            </Card>

            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Pozostały Budżet</CardTitle>
                    <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{budgetRemaining.toFixed(2)} PLN</div>
                    <p className="text-xs text-muted-foreground mt-1">Do końca miesiąca</p>
                </CardContent>
            </Card>
        </div>
    )
}