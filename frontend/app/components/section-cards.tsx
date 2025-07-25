import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import axiosInstance from "~/lib/axios"

export function SectionCards() {
  const [deviceCount, setDeviceCount] = useState<number | null>(null)
  const [devicesAddedToday, setDevicesAddedToday] = useState<number | null>(null)
  const [dailyEnergyUsage, setDailyEnergyUsage] = useState<number | null>(null)
  const [energyComparison, setEnergyComparison] = useState<number | null>(null)
  const [monthlyCost, setMonthlyCost] = useState<number | null>(null)
  const [monthlyCostComparison, setMonthlyCostComparison] = useState<number | null>(null)

  useEffect(() => {
    async function fetchDeviceData() {
      try {
        const response = await axiosInstance.get("/devices/user/me")
        const devices = response.data

        const today = new Date().toISOString().split("T")[0] 
        const addedToday = devices.filter((device: any) => device.createdAt.startsWith(today)).length

        setDeviceCount(devices.length)
        setDevicesAddedToday(addedToday)
      } catch (error) {
        console.error("Failed to fetch device data:", error)
      }
    }

    async function fetchEnergyHistory() {
      try {
        const response = await axiosInstance.get("/energy-usage/user/me/history")
        const history = response.data

        const energyByDate = history.reduce((acc: Record<string, number>, entry: any) => {
          acc[entry.date] = (acc[entry.date] || 0) + entry.energyKwh
          return acc
        }, {})

        const dates = Object.keys(energyByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

        if (dates.length > 0) {
          const latestDate = dates[dates.length - 1]
          const previousDate = dates[dates.length - 2]

          setDailyEnergyUsage(energyByDate[latestDate])
          if (previousDate) {
            const comparison = energyByDate[latestDate] - energyByDate[previousDate]
            setEnergyComparison(comparison)
          }
        }
      } catch (error) {
        console.error("Failed to fetch energy history:", error)
      }
    }

    async function fetchPriceEnergyHistory() {
      try {
        const response = await axiosInstance.get("/energy-usage/user/me/history")
        const history = response.data

        const energyByMonth = history.reduce((acc: Record<string, number>, entry: any) => {
          const month = entry.date.slice(0, 7)
          acc[month] = (acc[month] || 0) + entry.energyKwh
          return acc
        }, {})

        const months = Object.keys(energyByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

        if (months.length > 0) {
          const latestMonth = months[months.length - 1]
          const previousMonth = months[months.length - 2]

          const userResponse = await axiosInstance.get("/users/me")
          const energyCostPerKwh = userResponse.data.energyCostPerKwh

          const latestMonthCost = energyByMonth[latestMonth] * energyCostPerKwh
          setMonthlyCost(latestMonthCost)

          if (previousMonth) {
            const previousMonthCost = energyByMonth[previousMonth] * energyCostPerKwh
            
            setMonthlyCostComparison(latestMonthCost - previousMonthCost)
          }

        }
      } catch (error) {
        console.error("Failed to fetch energy history or user profile:", error)
      }
    }

    fetchDeviceData()
    fetchEnergyHistory()
    fetchPriceEnergyHistory()
  }, [])

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-8 px-8 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Devices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {deviceCount !== null ? deviceCount : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant={devicesAddedToday !== null && devicesAddedToday > 0 ? "outline" : "destructive"}>
              {devicesAddedToday !== null ? (
                devicesAddedToday > 0 ? (
                  <>
                    <IconTrendingUp />
                    +{devicesAddedToday} today
                  </>
                ) : (
                  <>
                    <IconTrendingDown />
                    {devicesAddedToday} today
                  </>
                )
              ) : (
                "Loading..."
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {deviceCount !== null
              ? "Devices successfully tracked"
              : "Fetching device data..."}
          </div>
          <div className="text-muted-foreground">
            Manage your devices efficiently
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Daily Energy Usage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dailyEnergyUsage !== null
              ? `${dailyEnergyUsage.toFixed(2)} kWh`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant={energyComparison !== null && energyComparison >= 0 ? "destructive" : "outline"}>
              {energyComparison !== null ? (
                energyComparison >= 0 ? (
                  <>
                    <IconTrendingUp />
                    +{energyComparison.toFixed(2)} kWh
                  </>
                ) : (
                  <>
                    <IconTrendingDown />
                    {energyComparison.toFixed(2)} kWh
                  </>
                )
              ) : (
                "Loading..."
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {dailyEnergyUsage !== null
              ? "Energy usage calculated"
              : "Fetching energy data..."}
          </div>
          <div className="text-muted-foreground">
            Optimize your energy consumption
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Monthly Energy Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {monthlyCost !== null
              ? `${monthlyCost.toFixed(2)} zł`
              : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant={monthlyCostComparison !== null && monthlyCostComparison >= 0 ? "destructive" : "outline"}>
              {monthlyCostComparison !== null ? (
                monthlyCostComparison >= 0 ? (
                  <>
                    <IconTrendingUp />
                    +{monthlyCostComparison.toFixed(2)} zł
                  </>
                ) : (
                  <>
                    <IconTrendingDown />
                    {monthlyCostComparison.toFixed(2)} zł
                  </>
                )
              ) : (
                "0 zł"
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {monthlyCost !== null
              ? "Monthly cost calculated"
              : "Fetching cost data..."}
          </div>
          <div className="text-muted-foreground">
            Monitor your energy expenses
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
