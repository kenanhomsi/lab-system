"use client";

import { useEffect, useState } from "react";
import { BANNER_ROTATE_MS } from "./locations";

type UseBannerCarouselOptions = {
  count: number;
  enabled?: boolean;
};

export function useBannerCarousel({
  count,
  enabled = true,
}: UseBannerCarouselOptions) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (activeIdx >= count && count > 0) {
      setActiveIdx(0);
    } else if (count === 0) {
      setActiveIdx(0);
    }
  }, [activeIdx, count]);

  useEffect(() => {
    if (!enabled || count <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % count);
    }, BANNER_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [count, enabled]);

  const safeActiveIdx = count > 0 ? Math.min(activeIdx, count - 1) : 0;

  return { activeIdx: safeActiveIdx, setActiveIdx };
}
