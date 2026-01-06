"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PeterHistoricalDataComponent({ fetchDataAction }: { fetchDataAction: (symbol: string) => Promise<{ date: string; high: number | null; low: number | null; open: number | null; close: number | null; volume: number | null; adjclose?: number | null | undefined; }[]> }) {
    const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState<Array<{ date: string; high: number | null; low: number | null; open: number | null; close: number | null; volume: number | null; adjclose?: number | null | undefined; }>>([])
    const [chartTitle, setChartTitle ] = useState<string | null>()

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
            item.high?.toFixed(4),
            item.volume,
            item.open?.toFixed(4),
            item.low?.toFixed(4),
            item.close?.toFixed(4),
            item.adjclose?.toFixed(4),
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
      const result = await fetchDataAction(searchQuery);
      setChartTitle(searchQuery);
      setData(result)
    } catch (e) {
      console.error(e);
    }
  };

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Peter&apos;s Historical Data</CardTitle>
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
                          <h1 className="text-center">{chartTitle}</h1>
                            <ChartContainer
                                config={{
                                    closePrice: {
                                        label: "Close Price",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                            >
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
                                        <Line type="monotone" dataKey="adjclose" stroke="#82ca9d" />
                                    </LineChart>
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
