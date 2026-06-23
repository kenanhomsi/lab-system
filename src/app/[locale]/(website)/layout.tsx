import type { ReactNode } from "react";
import { WebsiteFooter } from "@/components/layout/website-footer";
import { WebsiteHeader } from "@/components/layout/website-header";
import type { WebsiteHeaderNavigationLink } from "@/components/layout/website-header";
import { DeferredScrollRevealObserver } from "@/components/layout/deferred-scroll-reveal-observer";
import { WebsiteProviders } from "@/components/providers/website-providers";
import { WebsiteWelcomePagesModal } from "@/components/welcome-pages";
import { HomepageAdPopup } from "@/components/homepage/homepage-ad-popup";
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
        <DeferredScrollRevealObserver />
        <WebsiteWelcomePagesModal />
        <HomepageAdPopup />
        <WebsiteHeader cmsNavigationLinks={cmsNavigationLinks} />
        <div id="website-page-content" className="mx-auto w-full">
          {children}
        </div>
        <WebsiteFooter />
      </div>
    </WebsiteProviders>
  );
}
