"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import type { WelcomePageItem } from "@/types/welcome-page";

const SEEN_KEY = "doctor-system.website.welcome-pages.seen";
const VIDEO_EXTENSION_PATTERN = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") ?? "";

const encodeMediaUrl = (url: string) => encodeURI(url).replace(/#/g, "%23");

const resolveMediaUrl = (url: string) => {
  if (!url.startsWith("/") || url.startsWith("//") || url.startsWith("/api/")) {
    return encodeMediaUrl(url);
  }
  return encodeMediaUrl(BACKEND_ORIGIN ? `${BACKEND_ORIGIN}${url}` : url);
};

const unwrapPayload = (payload: unknown): unknown => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return unwrapPayload((payload as { data: unknown }).data);
  }
  return payload;
};

const normalizeWelcomePage = (value: unknown): WelcomePageItem | null => {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Partial<WelcomePageItem>;
  const rawMediaType = typeof item.mediaType === "string" ? item.mediaType.toLowerCase() : "";
  const mediaType =
    rawMediaType === "video" ? "Video" : rawMediaType === "image" ? "Image" : null;
  if (
    typeof item.id !== "number" ||
    typeof item.name !== "string" ||
    typeof item.description !== "string" ||
    mediaType === null ||
    typeof item.mediaUrl !== "string"
  ) {
    return null;
  }
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    mediaType,
    mediaUrl: resolveMediaUrl(item.mediaUrl),
    isActive: item.isActive !== false,
    createdAt: typeof item.createdAt === "string" ? item.createdAt : "",
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : "",
  };
};

const normalizeWelcomePages = (payload: unknown): WelcomePageItem[] => {
  const unwrapped = unwrapPayload(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped
      .map(normalizeWelcomePage)
      .filter((item): item is WelcomePageItem => item !== null);
  }
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "items" in unwrapped &&
    Array.isArray((unwrapped as { items: unknown }).items)
  ) {
    return (unwrapped as { items: unknown[] }).items
      .map(normalizeWelcomePage)
      .filter((item): item is WelcomePageItem => item !== null);
  }
  if (
    unwrapped &&
    typeof unwrapped === "object" &&
    "results" in unwrapped &&
    Array.isArray((unwrapped as { results: unknown }).results)
  ) {
    return (unwrapped as { results: unknown[] }).results
      .map(normalizeWelcomePage)
      .filter((item): item is WelcomePageItem => item !== null);
  }
  return [];
};

type WelcomeMediaLayerProps = {
  item: WelcomePageItem;
  onFinish: () => void;
  t: (key: "loading" | "play" | "error") => string;
};

const isVideoWelcomePage = (item: WelcomePageItem) =>
  item.mediaType === "Video" || VIDEO_EXTENSION_PATTERN.test(item.mediaUrl);

function WelcomeMediaLayer({ item, onFinish, t }: WelcomeMediaLayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaState, setMediaState] = useState<"loading" | "ready" | "blocked" | "error">(
    "loading",
  );
  const isVideo = isVideoWelcomePage(item);

  const tryPlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      video.muted = true;
      await video.play();
      setMediaState("ready");
    } catch {
      setMediaState("blocked");
    }
  }, []);

  useEffect(() => {
    if (!isVideo) return undefined;

    const fallbackTimer = window.setTimeout(() => {
      setMediaState((state) => (state === "loading" ? "blocked" : state));
    }, 5000);

    return () => window.clearTimeout(fallbackTimer);
  }, [isVideo]);

  if (!isVideo) {
    return (
      <>
        {mediaState === "loading" ? <WelcomeMediaStatus label={t("loading")} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.mediaUrl}
          alt={item.name}
          loading="eager"
          decoding="async"
          onLoad={() => setMediaState("ready")}
          onError={() => setMediaState("error")}
          className="h-screen w-screen object-cover"
        />
        {mediaState === "error" ? <WelcomeMediaStatus label={t("error")} tone="error" /> : null}
      </>
    );
  }

  return (
    <>
      <video
        key={item.id}
        ref={videoRef}
        src={item.mediaUrl}
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={mediaState === "blocked" || mediaState === "error"}
        onCanPlay={() => void tryPlay()}
        onLoadedData={() => void tryPlay()}
        onPlaying={() => setMediaState("ready")}
        onWaiting={() => setMediaState("loading")}
        onError={() => setMediaState("error")}
        onEnded={onFinish}
        className="h-screen w-screen object-cover"
      />
      {mediaState === "loading" ? <WelcomeMediaStatus label={t("loading")} /> : null}
      {mediaState === "blocked" ? (
        <button
          type="button"
          onClick={() => void tryPlay()}
          className="absolute left-1/2 top-1/2 z-10 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-2xl transition-transform hover:scale-105"
        >
          {t("play")}
        </button>
      ) : null}
      {mediaState === "error" ? <WelcomeMediaStatus label={t("error")} tone="error" /> : null}
    </>
  );
}

function WelcomeMediaStatus({ label, tone = "loading" }: { label: string; tone?: "loading" | "error" }) {
  return (
    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black text-sm font-medium text-white/80">
      <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 backdrop-blur">
        {tone === "loading" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : null}
        <span>{label}</span>
      </div>
    </div>
  );
}

export function WebsiteWelcomePagesModal() {
  const t = useTranslations("landing.welcomePages");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [items, setItems] = useState<WelcomePageItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(
    () => typeof window === "undefined" || window.localStorage.getItem(SEEN_KEY) === "true",
  );

  useEffect(() => {
    if (isDismissed) return;
    const controller = new AbortController();
    let mounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/website/welcome-pages", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) {
          if (mounted) setItems([]);
          return;
        }
        const payload: unknown = await response.json();
        if (mounted) {
          setItems(normalizeWelcomePages(payload).filter((item) => item.isActive));
        }
      } catch {
        if (mounted) setItems([]);
      }
    };

    void load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [isDismissed]);

  const active = useMemo(() => items[0] ?? null, [items]);

  const dismiss = () => {
    window.localStorage.setItem(SEEN_KEY, "true");
    setIsDismissed(true);
  };

  if (isDismissed || !active || items.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black"
      role="dialog"
      aria-modal="true"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute end-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-colors hover:bg-black/65"
        aria-label={t("skip")}
      >
        <IconX size={20} />
      </button>
      <WelcomeMediaLayer key={active.id} item={active} onFinish={dismiss} t={t} />
    </div>
  );
}
