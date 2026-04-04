import sanitizeHtml from "sanitize-html";
import type { AppLocale } from "@/i18n/routing";

const WP_BASE = "https://metwalilabs.com";
const CAT_BLOG = 105;
const CAT_NEWS = 103;

function postsUrl(category: number): string {
  return `${WP_BASE}/wp-json/wp/v2/posts?categories=${category}&per_page=50&_embed=1`;
}

type WpEmbeddedMedia = {
  source_url: string;
  alt_text?: string;
};

type WpListPost = {
  id: number;
  date: string;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: WpEmbeddedMedia[];
  };
};

type WpDetailPost = WpListPost & {
  content: { rendered: string };
  categories?: number[];
};

/** WP theme lazy-load: real URL in data-src while src is a placeholder. */
function fixLazyWpImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (full, inner: string) => {
    const dataSrc = /data-src="([^"]+)"/i.exec(inner);
    if (!dataSrc) {
      return full;
    }
    const srcM = /src="([^"]*)"/i.exec(inner);
    if (!srcM || !srcM[1].trim().toLowerCase().startsWith("data:")) {
      return full;
    }
    let next = inner.replace(/src="[^"]*"/i, `src="${dataSrc[1]}"`);
    const dataSrcset = /data-srcset="([^"]+)"/i.exec(inner);
    if (dataSrcset) {
      if (/srcset="/i.test(next)) {
        next = next.replace(/srcset="[^"]*"/i, `srcset="${dataSrcset[1]}"`);
      } else {
        next = `${next.trimEnd()} srcset="${dataSrcset[1]}"`;
      }
    }
    return `<img${next}>`;
  });
}

/** Manual English titles/excerpts when the source is Arabic-only. */
const BLOG_EN_BY_POST_ID: Record<number, { title: string; excerpt: string }> = {
  3418: {
    title: "Symptoms of arthritis and myositis",
    excerpt:
      "Arthritis and myositis are two separate conditions; each has its own causes and characteristic symptoms. Knowing the difference helps you seek appropriate care.",
  },
  3462: {
    title:
      "New Apple Watch health feature and encouraging news for people with diabetes",
    excerpt:
      "Apple continues to expand health tools on Apple Watch; recent updates bring features that can matter for daily wellness and chronic conditions such as diabetes.",
  },
  3456: {
    title:
      "Pfizer vaccine effectiveness may wane six months after vaccination, new study suggests",
    excerpt:
      "Research discussed how protection from some COVID-19 vaccines can change over time, prompting ongoing public-health guidance on boosters and follow-up.",
  },
  3413: {
    title: "COVID-19 vaccines: what is the latest news?",
    excerpt:
      "Countries ran trials on several vaccines to help prevent COVID-19. Here is a concise overview of developments patients and clinicians were following.",
  },
};

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCodePoint(parseInt(h, 16)),
    )
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export function stripWpHtml(html: string): string {
  const noTags = html.replace(/<[^>]*>/g, " ");
  const decoded = decodeBasicEntities(noTags);
  return decoded
    .replace(/\s+/g, " ")
    .replace(/(?:\s*Read Mores?)+$/gi, "")
    .trim();
}

function sanitizeWpContent(html: string): string {
  const absolutized = html
    .replace(/src="\/(?!\/)/g, `src="${WP_BASE}/`)
    .replace(/srcset="\/(?!\/)/g, `srcset="${WP_BASE}/`);
  return sanitizeHtml(absolutized, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: [
        "src",
        "srcset",
        "sizes",
        "alt",
        "width",
        "height",
        "class",
        "loading",
      ],
      a: ["href", "name", "target", "rel", "class"],
      div: ["class", "id", "dir"],
      span: ["class", "id", "dir"],
      p: ["class", "dir"],
      h1: ["class", "dir"],
      h2: ["class", "dir"],
      h3: ["class", "dir"],
      h4: ["class", "dir"],
      figure: ["class"],
      figcaption: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

function prepareWpArticleHtml(raw: string): string {
  return sanitizeWpContent(fixLazyWpImages(raw));
}

export type MetwaliBlogPost = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  featuredImageAlt: string | null;
  useArabicContentOnEn: boolean;
};

function featuredFromListRow(row: WpListPost): {
  url: string | null;
  alt: string | null;
} {
  const media = row._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.source_url ?? null;
  const alt = media?.alt_text?.trim() || null;
  return { url, alt };
}

function mapWpToDisplay(row: WpListPost, locale: AppLocale): MetwaliBlogPost {
  const titleAr = stripWpHtml(row.title.rendered);
  const excerptAr = stripWpHtml(row.excerpt.rendered);
  const { url: featuredImageUrl, alt: featuredImageAlt } =
    featuredFromListRow(row);

  if (locale === "ar") {
    return {
      id: row.id,
      date: row.date,
      title: titleAr,
      excerpt: excerptAr,
      featuredImageUrl,
      featuredImageAlt,
      useArabicContentOnEn: false,
    };
  }

  const en = BLOG_EN_BY_POST_ID[row.id];
  if (en) {
    return {
      id: row.id,
      date: row.date,
      title: en.title,
      excerpt: en.excerpt,
      featuredImageUrl,
      featuredImageAlt,
      useArabicContentOnEn: false,
    };
  }

  return {
    id: row.id,
    date: row.date,
    title: titleAr,
    excerpt: excerptAr,
    featuredImageUrl,
    featuredImageAlt,
    useArabicContentOnEn: true,
  };
}

async function fetchCategoryPosts(category: number): Promise<WpListPost[]> {
  const res = await fetch(postsUrl(category), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as WpListPost[];
  return Array.isArray(data) ? data : [];
}

function mergeById(rows: WpListPost[]): WpListPost[] {
  const byId = new Map<number, WpListPost>();
  for (const row of rows) {
    byId.set(row.id, row);
  }
  return [...byId.values()];
}

export type FetchMetwaliBlogResult =
  | { ok: true; posts: MetwaliBlogPost[] }
  | { ok: false };

export async function fetchMetwaliBlogPosts(
  locale: AppLocale,
): Promise<FetchMetwaliBlogResult> {
  try {
    const [blogRows, newsRows] = await Promise.all([
      fetchCategoryPosts(CAT_BLOG),
      fetchCategoryPosts(CAT_NEWS),
    ]);
    if (blogRows.length === 0 && newsRows.length === 0) {
      return { ok: false };
    }
    const merged = mergeById([...blogRows, ...newsRows]);
    const posts = merged.map((row) => mapWpToDisplay(row, locale));
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { ok: true, posts };
  } catch {
    return { ok: false };
  }
}

export async function fetchMetwaliAllPostIds(): Promise<number[]> {
  try {
    const [blogRows, newsRows] = await Promise.all([
      fetchCategoryPosts(CAT_BLOG),
      fetchCategoryPosts(CAT_NEWS),
    ]);
    return mergeById([...blogRows, ...newsRows]).map((r) => r.id);
  } catch {
    return [];
  }
}

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

function mapDetailToDisplay(
  row: WpDetailPost,
  locale: AppLocale,
): MetwaliPostDetail {
  const list = mapWpToDisplay(row, locale);
  const media = row._embedded?.["wp:featuredmedia"]?.[0];
  const featuredImageUrl = media?.source_url ?? null;
  const featuredImageAlt = media?.alt_text?.trim() || null;

  return {
    id: list.id,
    date: list.date,
    title: list.title,
    excerpt: list.excerpt,
    contentHtml: prepareWpArticleHtml(row.content.rendered),
    featuredImageUrl,
    featuredImageAlt,
    useArabicContentOnEn: list.useArabicContentOnEn,
  };
}

export async function fetchMetwaliPostById(
  id: number,
  locale: AppLocale,
): Promise<MetwaliPostDetail | null> {
  try {
    const res = await fetch(
      `${WP_BASE}/wp-json/wp/v2/posts/${id}?_embed`,
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/json" },
      },
    );
    if (!res.ok) {
      return null;
    }
    const row = (await res.json()) as WpDetailPost;
    if (typeof row.id !== "number" || row.id !== id) {
      return null;
    }
    const cats = row.categories ?? [];
    const allowed = cats.some((c) => c === CAT_BLOG || c === CAT_NEWS);
    if (!allowed) {
      return null;
    }
    return mapDetailToDisplay(row, locale);
  } catch {
    return null;
  }
}
