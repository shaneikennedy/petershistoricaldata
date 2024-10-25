"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// {
//     date: 2023 - 10 - 31T13: 30:00.000Z,
//         high: 170.89999389648438,
//             volume: 44846000,
//                 open: 169.35000610351562,
//                     low: 167.89999389648438,
//                         close: 170.77000427246094,
//                             adjClose: 169.90060424804688
// }


export function PeterHistoricalDataComponent({ fetchData }: { fetchData: (symbol: string) => Promise<{ date: string, high: number, volume: number, low: number, open: number, close: number, adjClose: number }[]> }) {
    const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<Array<{ date: string, volume: number, high: number, low: number, open: number, close: number, adjClose: number }>>([])

    const handleSearch = async () => {
        const result = await fetchData(searchQuery)
        setData(result)
    }

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

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Peter's Historical Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 mb-4">
                        <Input
                            type="text"
                            placeholder="Enter search query"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={handleSearch}>Search</Button>
                        <Button onClick={handleDownload} disabled={data.length === 0}>Download</Button>
                    </div>

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
                                        width={800}
                                        height={300}
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
                                        <Line
                                            type="monotone"
                                            dataKey="closePrice"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }}
                                        />
                                        <Line type="monotone" dataKey="adjClose" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground">Enter a search query and click search to find data.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
