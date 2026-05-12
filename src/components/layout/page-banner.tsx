"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import type { BannerItem } from "@/types/banner";

const ROTATE_EVERY_MS = 5000;

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

const getPageLocation = (pathname: string): string => {
    const path = pathname.toLowerCase();

    if (path.includes("/about")) return "about";
    if (path.includes("/blog")) return "blog";
    if (path.includes("/contact")) return "contact";
    if (path.includes("/services")) return "services";
    if (path.includes("/careers")) return "careers";
    if (path.includes("/offers")) return "offers";
    if (path.includes("/plans")) return "plans";
    if (path.includes("/tests")) return "tests";
    if (path === "/" || path.includes("/home")) return "homepage";

    return "homepage"; // default fallback
};

export function PageBanner() {
    const t = useTranslations("landing.banners");
    const locale = useLocale();
    const pathname = usePathname();
    const [activeIdx, setActiveIdx] = useState(0);
    const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
    const bannerService = frontendContainer.get<BannerFrontendService>(
        bannerModuleNames.service,
    );

    const pageLocation = useMemo(() => getPageLocation(pathname), [pathname]);

    const { data } = useQuery({
        queryKey: ["website-banners", pageLocation],
        queryFn: async () => {
            const pageBanners = await bannerService.findAllPublic({
                location: pageLocation,
            });
            if (pageBanners.length > 0) return pageBanners;

            // Fallback to homepage banners if no specific page banners found
            return bannerService.findAllPublic({ location: "homepage" });
        },
        staleTime: 1000 * 60,
    });

    const banners = useMemo(
        () =>
            (data ?? [])
                .filter((item) => item.isActive)
                .sort((a, b) => a.displayOrder - b.displayOrder),
        [data],
    );

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = window.setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % banners.length);
        }, ROTATE_EVERY_MS);
        return () => window.clearInterval(timer);
    }, [banners.length]);

    useEffect(() => {
        const root = document.getElementById("website-page-content");
        if (!root) return;

        const slot = document.createElement("div");
        slot.setAttribute("data-page-banner-slot", "true");
        slot.className = "w-full";

        const main = root.querySelector("main");
        const host = (main as HTMLElement | null) ?? root;
        const firstSection = host.querySelector("section");

        if (firstSection?.parentElement) {
            firstSection.parentElement.insertBefore(slot, firstSection.nextSibling);
        } else if (host.firstChild) {
            host.insertBefore(slot, host.firstChild.nextSibling);
        } else {
            host.appendChild(slot);
        }

        const mountFrame = window.requestAnimationFrame(() => {
            setMountNode(slot);
        });

        return () => {
            window.cancelAnimationFrame(mountFrame);
            window.requestAnimationFrame(() => {
                setMountNode((current) => (current === slot ? null : current));
            });
            slot.remove();
        };
    }, [pathname]);

    if (banners.length === 0 || !mountNode) return null;

    const safeActiveIdx = Math.min(activeIdx, banners.length - 1);
    const banner = banners[safeActiveIdx] as BannerItem;
    const href = banner.internalLink || banner.externalLink || "";
    const isExternal = !!banner.externalLink && !banner.internalLink;
    const mediaIsVideo = isVideoUrl(banner.mediaUrl);
    const isRtl = locale === "ar";

    const media = mediaIsVideo ? (
        <video
            src={banner.mediaUrl}
            muted
            loop
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
    ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={banner.mediaUrl}
            alt={banner.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
    );

    const content = (
        <>
            <div style={{ flex: 1, minWidth: 0, zIndex: 2 }}>
                <p className="text-xs font-bold text-primary/90 md:text-sm">{banner.type || t("fallback")}</p>
                <h2 className="mt-2 text-2xl font-black leading-tight text-on-surface md:text-4xl">
                    {banner.title}
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant md:text-base">{t("learnMore")}</p>
                {isExternal && href ? (
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary transition-opacity hover:opacity-90 md:text-sm"
                    >
                        {locale === "ar" ? "زيارة الرابط الخارجي" : "Visit External Link"}
                    </a>
                ) : null}
            </div>
            <div className="w-full max-w-[320px] overflow-hidden rounded-2xl border border-outline-variant/35 bg-white/40">
                {media}
            </div>
        </>
    );

    const section = (
        <section aria-label={t("regionAria")} className="mx-auto mt-8 max-w-screen-2xl px-6 md:px-8">
            <div className="rounded-3xl border border-outline-variant/30 bg-linear-to-br from-sky-100/95 via-cyan-100/90 to-emerald-100/90 p-4 shadow-sm md:p-6">
                <div className="relative overflow-hidden rounded-2xl p-4 md:p-6">
                    <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_80%_20%] from-white/60 to-transparent" />
                    <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
                        {href ? (
                            isExternal ? (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="contents"
                                >
                                    {content}
                                </a>
                            ) : (
                                <Link href={href} className="contents">
                                    {content}
                                </Link>
                            )
                        ) : (
                            content
                        )}
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            [isRtl ? "left" : "right"]: 12,
                            display: "flex",
                            gap: 6,
                        }}
                    >
                        {banners.map((item, idx) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveIdx(idx)}
                                aria-label={`slide-${idx + 1}`}
                                className={[
                                    "h-2 rounded-full transition-all",
                                    idx === safeActiveIdx ? "w-6 bg-primary" : "w-2 bg-black/25",
                                ].join(" ")}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

    return createPortal(section, mountNode);
}
