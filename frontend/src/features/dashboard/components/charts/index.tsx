"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { barChartData, categoryData } from "../../fakeData"

export function ChartsSection() {
    const [selectedPeriod, setSelectedPeriod] = useState("month")

    return (
        <div className="grid gap-4 md:grid-cols-7">
            <Card className="col-span-full md:col-span-4 border-border/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Przegląd Wydatków</CardTitle>
                            <CardDescription>Historia miesięcznych wydatków</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={selectedPeriod === "week" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedPeriod("week")}
                                className="text-xs"
                            >
                                Tydzień
                            </Button>
                            <Button
                                variant={selectedPeriod === "month" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedPeriod("month")}
                                className="text-xs"
                            >
                                Miesiąc
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barChartData}>
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
                            <Bar dataKey="wydatki" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-full md:col-span-3 border-border/50">
                <CardHeader>
                    <CardTitle>Wydatki wg Kategorii</CardTitle>
                    <CardDescription>Rozkład wydatków miesięcznych</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent || 100 * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
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
                </CardContent>
            </Card>
        </div>
    )
}