"use client";

import { useEffect, useState } from "react";
import { LabelList, Pie, PieChart } from "recharts";

import { Label } from "~/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import axiosInstance from "~/lib/axios";

export function ChartPieForTypes() {
  const [chartData, setChartData] = useState([]);
  const [selectedType, setSelectedType] = useState("AGD");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(
          `energy-usage/user/me/type/${selectedType}/devices`
        );
        const data = response.data;

        const formattedData = data.map((entry: any, index: number) => ({
          device: entry.device,
          totalEnergyKwh: entry.totalEnergyKwh,
          fill: `var(--chart-${index + 1})`,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch energy usage data:", error);
      }
    }

    fetchData();
  }, [selectedType]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <div className="flex items-center justify-between w-full">
          <CardTitle>Pie Chart for Devices</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="device-type" className="text-sm">
              Device Type
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setSelectedType(value)}
            >
              <SelectTrigger id="device-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGD">AGD</SelectItem>
                <SelectItem value="RTV">RTV</SelectItem>
                <SelectItem value="Oświetlenie">Oświetlenie</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="inne">inne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription>
          Select a device type to view energy usage by devices
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  nameKey="device"
                  valueKey="totalEnergyKwh"
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="totalEnergyKwh"
              nameKey="device"
              cx="50%"
              cy="50%"
              outerRadius="80%"
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
                    {payload.device}
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing energy usage for devices of the selected type
        </div>
      </CardFooter>
    </Card>
  );
}
