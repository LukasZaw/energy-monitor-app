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
import { Separator } from "~/components/ui/separator"

export function SectionCardsReport() {
  const [deviceCount, setDeviceCount] = useState<number | null>(null)
  const [devicesAddedToday, setDevicesAddedToday] = useState<number | null>(null)
  const [dailyEnergyUsage, setDailyEnergyUsage] = useState<number | null>(null)
  const [energyComparison, setEnergyComparison] = useState<number | null>(null)
  const [monthlyCost, setMonthlyCost] = useState<number | null>(null)
  const [monthlyCostComparison, setMonthlyCostComparison] = useState<number | null>(null)
  const [dailyEnergyCost, setDailyEnergyCost] = useState<number | null>(null)
  const [dailyEnergyCostComparison, setDailyEnergyCostComparison] = useState<number | null>(null)
  const [mostEnergyConsumingDevice, setMostEnergyConsumingDevice] = useState<string | null>(null)
  const [mostEnergyConsumingDeviceCost, setMostEnergyConsumingDeviceCost] = useState<number | null>(null)
  const [estimatedMonthlyCost, setEstimatedMonthlyCost] = useState<number | null>(null)

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

    async function fetchDailyEnergyCost() {
      try {
        const response = await axiosInstance.get("/energy-usage/user/me/history")
        const history = response.data

        const today = new Date().toISOString().split("T")[0]
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
          .toISOString()
          .split("T")[0]

        const todayUsage = history
          .filter((entry: any) => entry.date === today)
          .reduce((acc: number, entry: any) => acc + entry.energyKwh, 0)

        const yesterdayUsage = history
          .filter((entry: any) => entry.date === yesterday)
          .reduce((acc: number, entry: any) => acc + entry.energyKwh, 0)

        const userResponse = await axiosInstance.get("/users/me")
        const energyCostPerKwh = userResponse.data.energyCostPerKwh

        const todayCost = todayUsage * energyCostPerKwh
        const yesterdayCost = yesterdayUsage * energyCostPerKwh

        setDailyEnergyCost(todayCost)
        setDailyEnergyCostComparison(todayCost - yesterdayCost)
      } catch (error) {
        console.error("Failed to fetch daily energy cost:", error)
      }
    }

    async function fetchMostEnergyConsumingDevice() {
      try {
        const response = await axiosInstance.get("/devices/user/me")
        const devices = response.data

        const mostConsuming = devices.reduce((maxDevice: any, device: any) => {
          const deviceConsumption = (device.powerWatt / 1000) * device.dailyUsageHours
          const maxConsumption = maxDevice ? (maxDevice.powerWatt / 1000) * maxDevice.dailyUsageHours : 0

          return deviceConsumption > maxConsumption ? device : maxDevice
        }, null)

        if (mostConsuming) {
          const userResponse = await axiosInstance.get("/users/me")
          const energyCostPerKwh = userResponse.data.energyCostPerKwh

          const dailyCost = (mostConsuming.powerWatt / 1000) * mostConsuming.dailyUsageHours * energyCostPerKwh
          setMostEnergyConsumingDeviceCost(dailyCost)
          setMostEnergyConsumingDevice(mostConsuming.name)
        } else {
          setMostEnergyConsumingDevice(null)
          setMostEnergyConsumingDeviceCost(null)
        }
      } catch (error) {
        console.error("Failed to fetch most energy consuming device:", error)
      }
    }

    async function fetchEstimatedMonthlyCost() {
      try {
        const response = await axiosInstance.get("/devices/user/me")
        const devices = response.data

        const userResponse = await axiosInstance.get("/users/me")
        const energyCostPerKwh = userResponse.data.energyCostPerKwh

        const totalMonthlyCost = devices.reduce((total: number, device: any) => {
          const dailyConsumptionKwh = (device.powerWatt / 1000) * device.dailyUsageHours
          return total + dailyConsumptionKwh * 30 * energyCostPerKwh // Assuming 30 days in a month
        }, 0)

        setEstimatedMonthlyCost(totalMonthlyCost)
      } catch (error) {
        console.error("Failed to fetch estimated monthly cost:", error)
      }
    }

    fetchDeviceData()
    fetchEnergyHistory()
    fetchPriceEnergyHistory()
    fetchDailyEnergyCost()
    fetchMostEnergyConsumingDevice()
    fetchEstimatedMonthlyCost()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 px-4">
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
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Daily Energy Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {dailyEnergyCost !== null ? `${dailyEnergyCost.toFixed(2)} zł` : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant={dailyEnergyCostComparison !== null && dailyEnergyCostComparison >= 0 ? "destructive" : "outline"}>
              {dailyEnergyCostComparison !== null ? (
                dailyEnergyCostComparison >= 0 ? (
                  <>
                    <IconTrendingUp />
                    +{dailyEnergyCostComparison.toFixed(2)} zł
                  </>
                ) : (
                  <>
                    <IconTrendingDown />
                    {dailyEnergyCostComparison.toFixed(2)} zł
                  </>
                )
              ) : (
                "Loading..."
              )}
            </Badge>
          </CardAction>
        </CardHeader>
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
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Most Energy Consuming Device</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {mostEnergyConsumingDevice !== null ? mostEnergyConsumingDevice : "Loading..."}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {mostEnergyConsumingDeviceCost !== null
                ? `${mostEnergyConsumingDeviceCost.toFixed(2)} zł/day`
                : "Loading..."}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Estimated Monthly Cost</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {estimatedMonthlyCost !== null ? `${estimatedMonthlyCost.toFixed(2)} zł` : "Loading..."}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
    
  )
}
