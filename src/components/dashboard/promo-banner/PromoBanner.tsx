"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { bannerModuleNames, BannerFrontendService } from "@/modules/banner";
import type { BannerItem } from "@/types/banner";

type PromoBannerProps = {
  location: string;
};

const ROTATE_EVERY_MS = 5000;

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export function PromoBanner({ location }: PromoBannerProps) {
  const t = useTranslations("dashboard.promoBanner");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const dismissKey = `promo-banner-dismissed-${location}`;
  const [activeIdx, setActiveIdx] = useState(0);
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(dismissKey) === "1",
  );
  const bannerService = frontendContainer.get<BannerFrontendService>(
    bannerModuleNames.service,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["website-banners", location],
    queryFn: async () =>
      bannerService.findAllPublic({
        location,
      }),
    staleTime: 1000 * 60,
  });

  const items = useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .filter((item) => item.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [data],
  );

  useEffect(() => {
    if (items.length <= 1 || dismissed) return;
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % items.length);
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(timer);
  }, [dismissed, items.length]);

  if (dismissed || isLoading || items.length === 0) return null;

  const safeActiveIdx = Math.min(activeIdx, items.length - 1);
  const active = items[safeActiveIdx] as BannerItem;
  const href = active.internalLink || active.externalLink || "#";
  const isExternal = !!active.externalLink && !active.internalLink;
  const mediaUrl = active.mediaUrl;
  const mediaIsVideo = isVideoUrl(mediaUrl);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(dismissKey, "1");
    }
  };

  const body = (
    <>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            opacity: 0.85,
            marginBottom: 6,
          }}
        >
          {active.type || location}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.2 }}>{active.title}</div>
        <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9 }}>{t("learnMore")}</div>
      </div>
      <div
        style={{
          width: 220,
          maxWidth: "35%",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.25)",
          flexShrink: 0,
          background: "rgba(0,0,0,0.2)",
        }}
      >
        {mediaIsVideo ? (
          <video
            src={mediaUrl}
            muted
            loop
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={active.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}
      </div>
    </>
  );

  return (
    <section aria-label={t("regionAria")} style={{ marginBottom: 18 }}>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 18,
          border: "1px solid var(--mantine-color-gray-3)",
          background:
            "linear-gradient(120deg, rgba(24,100,171,0.95) 0%, rgba(73,80,245,0.92) 55%, rgba(38,198,218,0.88) 100%)",
          color: "white",
          padding: "18px 16px",
        }}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t("dismissAria")}
          style={{
            position: "absolute",
            top: 10,
            [isRtl ? "left" : "right"]: 10,
            width: 30,
            height: 30,
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.15)",
            color: "white",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            style={{ display: "flex", gap: 16, alignItems: "center", textDecoration: "none", color: "inherit" }}
          >
            {body}
          </a>
        ) : (
          <Link href={href} style={{ display: "flex", gap: 16, alignItems: "center", textDecoration: "none", color: "inherit" }}>
            {body}
          </Link>
        )}
      </div>
    </section>
  );
}
