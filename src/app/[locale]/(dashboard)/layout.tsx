import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AdBanner } from "@/components/layout/ad-banner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>
      <DashboardTopbar />
      <AdBanner />
      <div className="mt-16 min-h-[calc(100vh-4rem)] pb-16 lg:ms-64 lg:pb-0">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
