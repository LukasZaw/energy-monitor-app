import { AppSidebar } from "~/components/app-sidebar"
import { ChartAreaInteractive } from "~/components/chart-area-interactive"
import { DataTable } from "~/components/data-table"
import { SectionCards } from "~/components/section-cards"
import { SiteHeader } from "~/components/site-header"

import { DataTableUsers } from "~/components/data-table-users"
import { LineChartUser } from "~/components/line-chart-user"
import { LineChartDevice } from "~/components/line-chart-device"

import { Navigate } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"

import data from "./data.json"

import { useAuth } from '~/auth/useAuth';


export default function AdminDashboard() {
  const { user } = useAuth();

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
          <div className="p-4">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <DataTableUsers />

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex-1 min-w-[400px] rounded-md shadow-md">
              <LineChartUser />
            </div>
            <div className="flex-1 min-w-[400px] rounded-md shadow-md">
              <LineChartDevice />
            </div>
          </div>
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
