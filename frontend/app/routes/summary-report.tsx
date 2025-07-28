"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { AppSidebar } from "~/components/app-sidebar";
import { SiteHeader } from "~/components/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import axiosInstance from "~/lib/axios";

import { SectionCardsReport } from "~/components/section-cards-report";

const printPage = () => {
  window.print();
};

export default function SummaryReportPage() {
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
        <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Devices Report</h1>
            <Button variant="outline" onClick={printPage}>
              Print Report
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-2 px-2 lg:px-2 @xl/main:grid-cols-4">
            <SectionCardsReport />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

