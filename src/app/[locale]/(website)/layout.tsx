import type { ReactNode } from "react";
import { WebsiteFooter } from "@/components/layout/website-footer";
import { WebsiteHeader } from "@/components/layout/website-header";
import { ScrollRevealObserver } from "@/components/layout/scroll-reveal-observer";
import { PageBanner } from "@/components/layout/page-banner";

export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <ScrollRevealObserver />
      <WebsiteHeader />
      <PageBanner />
      <div id="website-page-content" className="mx-auto w-ful ">
        {children}
      </div>
      <WebsiteFooter />
    </div>
  );
}
