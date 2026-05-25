import type { ReactNode } from "react";
import { WebsiteFooter } from "@/components/layout/website-footer";
import { WebsiteHeader } from "@/components/layout/website-header";
import { DeferredScrollRevealObserver } from "@/components/layout/deferred-scroll-reveal-observer";
import { WebsiteProviders } from "@/components/providers/website-providers";

export default async function WebsiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WebsiteProviders>
      <div className="flex min-h-screen flex-col bg-background text-on-surface [--primary:#009cc2] [--color-primary:#009cc2]">
        <DeferredScrollRevealObserver />
        <WebsiteHeader />
        <div id="website-page-content" className="mx-auto w-full">
          {children}
        </div>
        <WebsiteFooter />
      </div>
    </WebsiteProviders>
  );
}
