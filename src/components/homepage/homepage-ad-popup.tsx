"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { IconExternalLink, IconSparkles, IconX } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  filterAdsByPlacement,
  getPageLocationFromPath,
} from "@/lib/banners/locations";
import type { AdItem } from "@/types/ad";

const OFFER_PATTERN =
  /(\d+\s*%|خصم|عرض|مجان|free|save|off|bundle|باقة|checkup|فحص)/i;

const normalizeAd = (value: unknown): AdItem | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<AdItem>;
  if (
    typeof item.id !== "number" ||
    typeof item.name !== "string" ||
    typeof item.description !== "string" ||
    (item.mediaType !== "Image" && item.mediaType !== "Video") ||
    typeof item.mediaUrl !== "string" ||
    typeof item.createdAt !== "string" ||
    (item.updatedAt !== null && typeof item.updatedAt !== "string")
  ) {
    return null;
  }
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    mediaType: item.mediaType,
    mediaUrl: item.mediaUrl,
    websiteUrl: typeof item.websiteUrl === "string" ? item.websiteUrl : undefined,
    latitude: typeof item.latitude === "number" ? item.latitude : undefined,
    longitude: typeof item.longitude === "number" ? item.longitude : undefined,
    addressName: typeof item.addressName === "string" ? item.addressName : undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt ?? null,
  };
};

const normalizeAds = (payload: unknown): AdItem[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeAd).filter((item): item is AdItem => item !== null);
  }
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: unknown }).data;
    if (Array.isArray(inner)) {
      return inner.map(normalizeAd).filter((item): item is AdItem => item !== null);
    }
    if (inner && typeof inner === "object" && "data" in inner) {
      const nested = (inner as { data: unknown }).data;
      if (Array.isArray(nested)) {
        return nested.map(normalizeAd).filter((item): item is AdItem => item !== null);
      }
    }
  }
  return [];
};

const extractOfferHighlight = (description: string) => {
  const trimmed = description.trim();
  if (!trimmed) return null;
  const firstLine = trimmed.split(/\n|\.(?=\s)/)[0]?.trim() ?? trimmed;
  if (OFFER_PATTERN.test(firstLine) && firstLine.length <= 72) {
    return firstLine;
  }
  return null;
};

/**
 * Displays the first matching public ad as a dismissible modal-style popup.
 */
export function HomepageAdPopup() {
  const t = useTranslations("landing.ads");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleClose = useCallback(() => {
    setIsDismissed(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    queueMicrotask(() => {
      if (isMounted) {
        setIsDismissed(false);
      }
    });

    const fetchAds = async () => {
      try {
        const response = await fetch("/api/website/ads", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) return;
        const payload: unknown = await response.json();
        if (isMounted) {
          setAds(normalizeAds(payload));
        }
      } catch {
        if (isMounted) {
          setAds([]);
        }
      }
    };

    void fetchAds();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [pathname]);

  const pagePlacement = useMemo(() => getPageLocationFromPath(pathname), [pathname]);

  const ad = useMemo(() => {
    if (!pagePlacement) return null;
    return filterAdsByPlacement(ads, pagePlacement)[0] ?? null;
  }, [ads, pagePlacement]);

  const offerHighlight = useMemo(
    () => (ad ? extractOfferHighlight(ad.description) : null),
    [ad],
  );

  const bodyCopy = useMemo(() => {
    if (!ad?.description.trim()) return "";
    const trimmed = ad.description.trim();
    if (offerHighlight && trimmed.startsWith(offerHighlight)) {
      return trimmed.slice(offerHighlight.length).replace(/^[\s.\-–—]+/, "").trim();
    }
    return trimmed;
  }, [ad, offerHighlight]);

  useEffect(() => {
    if (isDismissed || !ad) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [ad, handleClose, isDismissed]);

  if (isDismissed || !ad) return null;

  const media =
    ad.mediaType === "Video" ? (
      <video
        src={ad.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full min-h-64 w-full object-cover md:min-h-full"
      />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ad.mediaUrl}
        alt={ad.name}
        loading="eager"
        decoding="async"
        className="h-full min-h-64 w-full object-cover md:min-h-full"
      />
    );

  const ctaClassName =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary,#009cc2)] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#009cc2]/25 transition-all hover:-translate-y-0.5 hover:bg-[#0085a8] hover:shadow-xl hover:shadow-[#009cc2]/30";

  const ctaContent = (
    <>
      {ad.websiteUrl ? t("card.ctaExternal") : t("card.cta")}
      {ad.websiteUrl ? <IconExternalLink size={16} stroke={2.2} /> : null}
    </>
  );

  return (
    <div
      className="ad-modal-overlay fixed inset-0 z-80 flex items-center justify-center bg-slate-950/75 px-4 py-8 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="homepage-ad-title"
      dir={isRtl ? "rtl" : "ltr"}
      onClick={handleClose}
    >
      <div
        className="ad-modal-panel relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_32px_80px_-24px_rgba(15,23,42,0.55)] ring-1 ring-white/20 md:max-h-[90vh] md:flex-row"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute end-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-md ring-1 ring-slate-200/80 backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-800"
          aria-label={t("dismissAria")}
        >
          <IconX size={18} stroke={2} />
        </button>

        <div className="relative min-h-64 shrink-0 overflow-hidden bg-slate-900 md:min-h-0 md:w-[54%]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-slate-950/20" />
          <div
            className="pointer-events-none absolute -start-16 top-8 h-40 w-40 rounded-full bg-[#009cc2]/30 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -end-10 bottom-0 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl"
            aria-hidden
          />
          {ad.websiteUrl ? (
            <a
              href={ad.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block h-full min-h-64 md:min-h-[420px]"
            >
              {media}
              <span className="pointer-events-none absolute inset-0 bg-slate-900/0 transition-colors group-hover:bg-slate-900/10" />
            </a>
          ) : (
            <div className="relative h-full min-h-64 md:min-h-[420px]">{media}</div>
          )}

          {offerHighlight ? (
            <div className="absolute bottom-4 start-4 end-4 z-10 md:bottom-6 md:start-6 md:end-auto md:max-w-[85%]">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-bold text-[#009cc2] shadow-lg ring-1 ring-white/60 backdrop-blur-sm">
                <IconSparkles size={16} stroke={2} />
                {offerHighlight}
              </span>
            </div>
          ) : null}
        </div>

        <div className="relative flex flex-1 flex-col justify-between gap-6 bg-gradient-to-b from-white to-slate-50 p-6 pt-14 sm:p-8 sm:pt-16">
          <div className="absolute inset-y-0 start-0 hidden w-1 bg-gradient-to-b from-[#009cc2] via-cyan-400 to-[#009cc2]/40 md:block" />

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#009cc2]/20 bg-[#009cc2]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#007a99]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#009cc2]" aria-hidden />
                {t("card.sponsored")}
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200/80">
                {t("card.kicker")}
              </span>
            </div>

            <div className="space-y-3">
              <h2
                id="homepage-ad-title"
                className="text-balance text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[1.75rem]"
              >
                {ad.name}
              </h2>
              {bodyCopy ? (
                <p className="max-w-prose text-sm leading-7 text-slate-600 sm:text-[15px]">
                  {bodyCopy}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {ad.websiteUrl ? (
                <a href={ad.websiteUrl} target="_blank" rel="noreferrer" className={ctaClassName}>
                  {ctaContent}
                </a>
              ) : (
                <Link href="/offers" onClick={handleClose} className={ctaClassName}>
                  {ctaContent}
                </Link>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                {t("card.notNow")}
              </button>
            </div>
            <p className="text-[11px] leading-5 text-slate-400">{t("card.disclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
