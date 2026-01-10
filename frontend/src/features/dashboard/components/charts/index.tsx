import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useChartDataQuery } from "../../query"

export function ChartsSection() {
    const { data, isLoading, isError, error } = useChartDataQuery()

    const chartData = useMemo(() => {
        if (!data?.barChartData) return []
        return data.barChartData.map(item => ({
            month: item.month,
            expenses: item.expenses.reduce((acc, exp) => acc + exp.amount, 0)
        }))
    }, [data])

    const pieData = useMemo(() => {
        if (!data?.categoryData || !data?.barChartData) return []

        const categoryTotals: Record<string, number> = {}

        data.barChartData.forEach(monthItem => {
            monthItem.expenses.forEach(expense => {
                categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
            })
        })

        return data.categoryData.map(cat => ({
            name: cat.name,
            value: categoryTotals[cat.name] || 0,
            color: cat.color
        })).filter(cat => cat.value > 0)
    }, [data])

    if (isError) {
        return (
            <div className="grid gap-4 md:grid-cols-7">
                <Card className="col-span-full">
                    <CardContent className="pt-6">
                        <div className="text-center text-red-500">
                            Error loading charts: {error?.message}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-full md:col-span-4 border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Przegląd Wydatków</CardTitle>
                            <CardDescription>Historia miesięcznych wydatków</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="w-full h-[300px]" />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        color: "hsl(var(--foreground))",
                                    }}
                                />
                                <Bar dataKey="expenses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-3 border-border/50">
                <CardHeader>
                    <CardTitle>Wydatki wg Kategorii</CardTitle>
                    <CardDescription>Rozkład wydatków miesięcznych</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="w-full h-[300px]" />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        color: "hsl(var(--foreground))",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}