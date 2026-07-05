import type { ReactNode } from "react";

export const MATERIAL_SYMBOLS_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap";

/**
 * Injects Material Symbols stylesheet during SSR (hoisted to document head).
 */
export function WebsiteMaterialSymbolsLink(): ReactNode {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} />
    </>
  );
}
