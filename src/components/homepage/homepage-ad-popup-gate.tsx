"use client";

import { usePathname } from "@/i18n/navigation";
import dynamic from "next/dynamic";

const HomepageAdPopup = dynamic(
  () =>
    import("@/components/homepage/homepage-ad-popup").then(
      (module) => module.HomepageAdPopup,
    ),
  { ssr: false },
);

const isHomePath = (pathname: string) =>
  pathname === "/" || /^\/(en|ar)\/?$/.test(pathname);

/**
 * Mounts the homepage ad popup only on the landing route.
 */
export function HomepageAdPopupGate() {
  const pathname = usePathname();

  if (!isHomePath(pathname)) {
    return null;
  }

  return <HomepageAdPopup />;
}
