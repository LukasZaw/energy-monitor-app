"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"
import axiosInstance from "~/lib/axios"

export function ChartEnergyByDevice() {
  const [chartData, setChartData] = useState([])
  const [deviceKeys, setDeviceKeys] = useState<string[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(
          "/energy-usage/user/me/device-share"
        )
        const data = response.data

        // Transform data into a format suitable for the chart
        const formattedData = data.map((entry: any) => {
          const { date, devices } = entry
          return {
            date,
            ...devices,
          }
        })

        // Extract unique device keys for the chart
        const keys = Array.from(
          new Set(data.flatMap((entry: any) => Object.keys(entry.devices)))
        )

        setChartData(formattedData)
        setDeviceKeys(keys)
      } catch (error) {
        console.error("Failed to fetch energy usage data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Usage by Device</CardTitle>
        <CardDescription>
          Showing energy usage (kWh) for each device over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              {deviceKeys.map((key, index) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--chart-${index + 1})`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--chart-${index + 1})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              reversed={true}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              label={{
                value: "Energy (kWh)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "var(--foreground)" },
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {deviceKeys.map((key, index) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill${key})`}
                fillOpacity={0.4}
                stroke={`var(--chart-${index + 1})`}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground text-sm">
          Data is aggregated by device and date.
        </div>
      </CardFooter>
    </Card>
  )
}
