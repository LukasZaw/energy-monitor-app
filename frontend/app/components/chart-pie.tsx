"use client"

import { useEffect, useState } from "react"
import { Pie, PieChart } from "recharts"

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

export function ChartPie() {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get("/energy-usage/user/me/type-summary")
        const data = response.data

        // Formatowanie danych dla wykresu
        const formattedData = data.map((entry: any) => ({
          type: entry.type,
          totalEnergyKwh: entry.totalEnergyKwh,
          fill: `var(--chart-${data.indexOf(entry) + 1})`, 
        }))

        setChartData(formattedData)
      } catch (error) {
        console.error("Failed to fetch energy usage data:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Energy Usage by Device Type</CardTitle>
        <CardDescription>Sum of energy usage (kWh) by device type</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="type" valueKey="totalEnergyKwh" />}
            />
            <Pie
              data={chartData}
              dataKey="totalEnergyKwh"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius="75%"
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill="rgba(255, 255, 255, 0.7)"
                  >
                    {payload.type}
                  </text>
                )
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total energy usage by device type
        </div>
      </CardFooter>
    </Card>
  )
}
