"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { BANNER_PLACEMENT, usePublicBanners } from "@/lib/banners";
import type { BannerItem } from "@/types/banner";

const AD_DISMISS_KEY = "ad-banner-dismissed";

function useAdDismissedFromStorage() {
  return useSyncExternalStore(
    () => () => {
      /* no cross-tab sync */
    },
    () => (typeof window !== "undefined" ? sessionStorage.getItem(AD_DISMISS_KEY) === "true" : false),
    () => false,
  );
}

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

function toAdDisplay(banner: BannerItem) {
  const linkUrl = banner.internalLink || banner.externalLink || "#";
  let mediaType: "image" | "video" | "gif" = "image";
  if (isVideoUrl(banner.mediaUrl)) {
    mediaType = "video";
  } else if (/\.gif(\?.*)?$/i.test(banner.mediaUrl)) {
    mediaType = "gif";
  }
  return {
    id: banner.id,
    mediaUrl: banner.mediaUrl,
    mediaType,
    linkUrl,
  };
}

export function AdBanner() {
  const storageDismissed = useAdDismissedFromStorage();
  const [dismissed, setDismissed] = useState(false);
  const dismissedEffective = dismissed || storageDismissed;

  const { banners, isLoading } = usePublicBanners({
    placement: BANNER_PLACEMENT.AD_BAR,
    fallbackToHomepage: false,
  });

  const display = useMemo(() => {
    const first = banners[0];
    return first ? toAdDisplay(first) : null;
  }, [banners]);

  if (isLoading || dismissedEffective || !display) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(AD_DISMISS_KEY, "true");
  };

  return (
    <div className="relative w-full bg-surface-container-low">
      <Link href={display.linkUrl} className="block">
        {display.mediaType === "video" ? (
          <video
            src={display.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-16 w-full object-cover sm:h-20"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={display.mediaUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-16 w-full object-cover sm:h-20"
          />
        )}
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white transition-colors hover:bg-black/60"
        aria-label="Close"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
}
