/** Normalize pathname for quick-action matching (next-intl pathname has no locale prefix). */
const normalizePathForQuickAction = (path: string): string => {
  const withoutQuery = path.split("?")[0] ?? path;
  return withoutQuery.replace(/\/$/, "") || "/";
};

export { normalizePathForQuickAction };
