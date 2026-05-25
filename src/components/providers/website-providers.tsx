"use client";

import type { ReactNode } from "react";
import { LocaleHtmlSync } from "./locale-html-sync";

/** Minimal client providers for public website routes. */
export function WebsiteProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <LocaleHtmlSync />
      {children}
    </>
  );
}
