/** Public blog DTOs shared by API, pages, and UI (no WordPress/fetch logic). */

export type MetwaliBlogPost = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  useArabicContentOnEn: boolean;
};

export type FetchMetwaliBlogResult =
  | { ok: true; posts: MetwaliBlogPost[] }
  | { ok: false };

export type MetwaliPostDetail = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  useArabicContentOnEn: boolean;
};
