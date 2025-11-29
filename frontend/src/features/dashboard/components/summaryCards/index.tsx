import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

export function SummaryCards() {
    const totalBalance = 15420.5
    const monthlyExpenses = 3250.0
    const budgetRemaining = 1750.0
    const budgetTotal = 5000.0

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="text-2xl font-bold text-destructive">-{monthlyExpenses.toFixed(2)} PLN</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {((monthlyExpenses / budgetTotal) * 100).toFixed(0)}% budżetu wykorzystane
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