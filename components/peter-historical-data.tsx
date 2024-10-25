"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PeterHistoricalDataComponent({ fetchData }: { fetchData: (symbol: string) => Promise<{ date: string, high: number, volume: number, low: number, open: number, close: number, adjClose: number }[]> }) {
    const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<Array<{ date: string, volume: number, high: number, low: number, open: number, close: number, adjClose: number }>>([])

    const handleDownload = () => {
        const csv = [
          [
            "Date",
            "High",
            "Volume",
            "Open",
            "Low",
            "Close",
            "Adj Close",
          ],
          ...data.map(item => [
            item.date,
            item.high.toFixed(4),
              item.volume,
            item.open.toFixed(4),
            item.low.toFixed(4),
            item.close.toFixed(4),
            item.adjClose.toFixed(4),
          ])
        ].map(row => row.join(",")).join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "historical_data.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page reload
    try {
      const result = await fetchData(searchQuery);
      setData(result)
    } catch (e) {
      console.error(e);
    }
  };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Peter's Historical Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
                        <Input
                            type="text"
                            placeholder="Enter search query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Button type="submit">Search</Button>
                        <Button onClick={handleDownload} disabled={data.length === 0}>Download</Button>
                      </form>

                    {data.length > 0 ? (
                        <div className="h-[400px]">
                            <ChartContainer
                                config={{
                                    closePrice: {
                                        label: "Close Price",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                            >
                                <ResponsiveContainer width="100%" aspect={3}>
                                    <LineChart
                                        width={1200}
                                        height={400}
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="adjClose" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">Enter a search query and hit enter to find data.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
