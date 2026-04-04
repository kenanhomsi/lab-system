import type { ReactNode } from "react";
import { WebsiteFooter } from "@/components/layout/website-footer";
import { WebsiteHeader } from "@/components/layout/website-header";
import { ScrollRevealObserver } from "@/components/layout/scroll-reveal-observer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AdBanner } from "@/components/layout/ad-banner";

export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <ScrollRevealObserver />
      <AdBanner />
      <WebsiteHeader />
      <div className="pb-16 lg:pb-0">{children}</div>
      <WebsiteFooter />
      <BottomNav />
    </div>
  );
}
