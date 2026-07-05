import type { ReactNode } from "react";
import { WebsiteFooter } from "@/components/layout/website-footer";
import { WebsiteHeader } from "@/components/layout/website-header";
import type { WebsiteHeaderNavigationLink } from "@/components/layout/website-header";
import { DeferredScrollRevealObserver } from "@/components/layout/deferred-scroll-reveal-observer";
import { DeferredIdleMount } from "@/components/layout/deferred-idle-mount";
import { WebsiteMaterialSymbolsLink } from "@/components/layout/website-material-symbols-link";
import { WebsiteProviders } from "@/components/providers/website-providers";
import { LazyWebsiteWelcomePagesModal } from "@/components/welcome-pages/lazy-website-welcome-pages-modal";
import { HomepageAdPopupGate } from "@/components/homepage/homepage-ad-popup-gate";
import { PathTargetedBannerGate } from "@/components/layout/path-targeted-banner-gate";
import { fetchWebsiteNavigation } from "@/lib/website-pages/server";

const toNavigationHref = (slug?: string | null) => {
  const trimmed = slug?.trim().replace(/^\/+/, "");
  return trimmed ? `/${trimmed}` : "/";
};

export default async function WebsiteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cmsNavigationLinks: WebsiteHeaderNavigationLink[] = (
    await fetchWebsiteNavigation(locale)
  )
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      href: toNavigationHref(item.slug),
      label: item.title || item.breadcrumbTitle || item.slug || "",
    }))
    .filter((item) => item.label.trim());

  return (
    <WebsiteProviders>
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-on-surface [--primary:#009cc2] [--color-primary:#009cc2]">
        <WebsiteMaterialSymbolsLink />
        <WebsiteHeader cmsNavigationLinks={cmsNavigationLinks} />
        <PathTargetedBannerGate />
        <div id="website-page-content" className="mx-auto w-full">
          {children}
        </div>
        <WebsiteFooter />
        <DeferredIdleMount>
          <DeferredScrollRevealObserver />
          <LazyWebsiteWelcomePagesModal />
          <HomepageAdPopupGate />
        </DeferredIdleMount>
      </div>
    </WebsiteProviders>
  );
}
