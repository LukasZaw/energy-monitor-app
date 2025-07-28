"use client";

import * as React from "react";
import { DataTableExport } from "~/components/data-table-export";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function DevicesReportPage() {
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
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl font-semibold mb-4">Devices Report</h1>
          <DataTableExport />
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}