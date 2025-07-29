"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import type { ChartConfig } from "~/components/ui/chart"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

import axiosInstance from "~/lib/axios"

export const description = "A line chart"

const chartConfig = {
  count: {
    label: "Devices",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function LineChartDevice() {
  const [chartData, setChartData] = useState<{ date: string; count: number }[]>(
    []
  )

  useEffect(() => {
    async function fetchSignupStats() {
      try {
        const response = await axiosInstance.get("devices/creation-stats")
        const data = response.data

        const formattedData = data.map(
          (entry: { date: string; count: number }) => ({
            date: new Date(entry.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            count: entry.count,
          })
        )

        setChartData(formattedData)
      } catch (error) {
        console.error("Failed to fetch devices add stats:", error)
      }
    }

    fetchSignupStats()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Devices added</CardTitle>
        <CardDescription>Last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        
        <div className="text-muted-foreground leading-none">
          Showing total devices added in the last 14 days
        </div>
      </CardFooter>
    </Card>
  )
}
