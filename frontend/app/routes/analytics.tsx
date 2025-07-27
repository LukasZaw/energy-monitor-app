import { AppSidebar } from "~/components/app-sidebar";
import { ChartAreaInteractive } from "~/components/chart-area-interactive";
import { ChartEnergyByDevice } from "~/components/chart-energy-by-device";
import { ChartPieForTypes } from "~/components/chart-pie-for-types";
import { ChartPie } from "~/components/chart-pie";

import { SiteHeader } from "~/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar";

export default function AnalyticsPage() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <div className="px-4 lg:px-6">
                <ChartEnergyByDevice />
              </div>
              <div className="px-4 md:px-6 flex gap-4">
                <div className="flex-1">
                  <ChartPie />
                </div>
                <div className="flex-1">
                  <ChartPieForTypes />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
