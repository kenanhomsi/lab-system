"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  type BannerPlacement,
  useBannerCarousel,
  usePublicBanners,
} from "@/lib/banners";
import type { BannerItem } from "@/types/banner";

type PromoBannerProps = {
  location: BannerPlacement;
};

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export function PromoBanner({ location }: PromoBannerProps) {
  const t = useTranslations("dashboard.promoBanner");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const dismissKey = `promo-banner-dismissed-${location}`;
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(dismissKey) === "1",
  );

  const { banners: items, isLoading } = usePublicBanners({
    placement: location,
    fallbackToHomepage: false,
  });

  const { activeIdx, setActiveIdx } = useBannerCarousel({
    count: items.length,
    enabled: items.length > 1 && !dismissed,
  });

  if (dismissed || isLoading || items.length === 0) return null;

  const active = items[activeIdx] as BannerItem;
  const href = active.internalLink || active.externalLink || "#";
  const isExternal = !!active.externalLink && !active.internalLink;
  const mediaUrl = active.mediaUrl;
  const mediaIsVideo = isVideoUrl(mediaUrl);
  const slideLabelPrefix = locale === "ar" ? "الانتقال إلى الشريحة" : "Go to slide";

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
            zIndex: 2,
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

        {items.length > 1 ? (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              [isRtl ? "left" : "right"]: 10,
              display: "flex",
              gap: 6,
            }}
          >
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                aria-label={`${slideLabelPrefix} ${idx + 1}: ${item.title}`}
                aria-current={idx === activeIdx}
                style={{
                  width: idx === activeIdx ? 22 : 8,
                  height: 8,
                  borderRadius: 99,
                  border: "none",
                  cursor: "pointer",
                  background: idx === activeIdx ? "white" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
