"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface BannerData {
  id: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "gif";
  linkUrl: string;
}

export function AdBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("ad-banner-dismissed");
    if (wasDismissed) return;

    fetch("/api/banners/active")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBanner(data);
      })
      .catch(() => {});
  }, []);

  if (dismissed || !banner) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("ad-banner-dismissed", "true");
  };

  return (
    <div className="relative w-full bg-surface-container-low">
      <Link href={banner.linkUrl} className="block">
        {banner.mediaType === "video" ? (
          <video
            src={banner.mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-16 w-full object-cover sm:h-20"
          />
        ) : (
          <img
            src={banner.mediaUrl}
            alt=""
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
