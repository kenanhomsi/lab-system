"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Watches every .reveal-up and .reveal-in element on the page and adds the
 * `is-visible` class the moment it enters the viewport.
 *
 * Re-runs on every client-side route change so elements on new pages are
 * picked up even though this component lives in a persistent layout.
 */
export function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Small delay so the incoming page content is fully painted before we query.
    const timer = setTimeout(() => {
      const elements =
        document.querySelectorAll<HTMLElement>(".reveal-up, .reveal-in");
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
      );

      elements.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
