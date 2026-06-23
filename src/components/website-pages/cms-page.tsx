import type { CSSProperties, ReactNode } from "react";
import sanitizeHtml from "sanitize-html";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type {
  WebsiteContentBlockDto,
  WebsitePageDto,
  WebsitePageJsonValue,
} from "@/types/website-page";

type JsonRecord = { [key: string]: WebsitePageJsonValue };

type CardItem = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

const SAFE_STYLE_KEYS = new Set([
  "backgroundColor",
  "color",
  "textAlign",
  "paddingTop",
  "paddingBottom",
  "marginTop",
  "marginBottom",
]);

function asRecord(value: WebsitePageJsonValue | undefined): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value;
}

function asString(value: WebsitePageJsonValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function safeHref(value?: string | null): string | null {
  const href = value?.trim();
  if (!href) return null;
  const lower = href.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) {
    return null;
  }
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    lower.startsWith("https://") ||
    lower.startsWith("http://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tel:")
  ) {
    return href;
  }
  return `/${href.replace(/^\/+/, "")}`;
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function safeClassName(value?: string | null): string {
  return (value ?? "")
    .split(/\s+/)
    .filter((token) => /^[-_a-zA-Z0-9:\/.[\]]+$/.test(token))
    .join(" ");
}

function safeStyles(value: WebsitePageJsonValue | undefined): CSSProperties {
  const record = asRecord(value);
  if (!record) return {};
  const styles: CSSProperties = {};
  for (const [key, rawValue] of Object.entries(record)) {
    if (!SAFE_STYLE_KEYS.has(key)) continue;
    if (typeof rawValue !== "string" && typeof rawValue !== "number") continue;
    styles[key as keyof CSSProperties] = rawValue as never;
  }
  return styles;
}

function sanitizeRichText(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "h1",
      "h2",
      "h3",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel", "class"],
      img: ["src", "alt", "width", "height", "loading"],
      div: ["class"],
      p: ["class"],
      span: ["class"],
      figure: ["class"],
      figcaption: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}

function extractCards(data: WebsitePageJsonValue | undefined): CardItem[] {
  const record = asRecord(data);
  const cards = record?.cards;
  if (!Array.isArray(cards)) return [];
  return cards
    .map((item) => {
      const card = asRecord(item);
      if (!card) return null;
      return {
        title: asString(card.title),
        description: asString(card.description),
        imageUrl: asString(card.imageUrl),
        link: asString(card.link),
      };
    })
    .filter((item): item is CardItem => item !== null);
}

function CmsButton({ href, children }: { href: string | null; children: ReactNode }) {
  if (!href) return null;
  const className =
    "clinical-gradient inline-flex items-center justify-center rounded-xl px-5 py-3 font-headline text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95";
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function CmsMedia({ block }: { block: WebsiteContentBlockDto }) {
  const src = block.mediaUrl?.trim();
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={block.mediaAltText || block.heading || ""}
      loading="lazy"
      className="h-full max-h-[28rem] w-full rounded-2xl object-cover shadow-xl shadow-slate-900/10"
    />
  );
}

/**
 * Renders one safe CMS content block returned by the public pages API.
 */
function CmsBlock({ block }: { block: WebsiteContentBlockDto }) {
  const blockType = (block.blockType ?? "generic").toLowerCase();
  const customClassName = safeClassName(block.customCssClass);
  const customStyles = safeStyles(block.customStyles);
  const buttonHref = safeHref(block.buttonLink);
  const buttonText = block.buttonText?.trim();

  if (blockType === "hero") {
    return (
      <section className={cn("bg-surface py-16 md:py-24", customClassName)} style={customStyles}>
        <div className="content-container grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-3xl">
            {block.subheading ? (
              <p className="mb-4 font-headline text-sm font-bold uppercase tracking-[0.18em] text-primary">
                {block.subheading}
              </p>
            ) : null}
            {block.heading ? (
              <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface md:text-6xl">
                {block.heading}
              </h1>
            ) : null}
            {block.description ? (
              <p className="mt-6 text-lg leading-8 text-on-surface-variant">
                {block.description}
              </p>
            ) : null}
            {buttonText ? (
              <div className="mt-8">
                <CmsButton href={buttonHref}>{buttonText}</CmsButton>
              </div>
            ) : null}
          </div>
          <CmsMedia block={block} />
        </div>
      </section>
    );
  }

  if (blockType === "rich-text") {
    const html = sanitizeRichText(block.description ?? "");
    return (
      <section className={cn("bg-background py-12 md:py-16", customClassName)} style={customStyles}>
        <article className="content-container max-w-4xl">
          {block.heading ? (
            <h2 className="mb-5 font-headline text-3xl font-black text-on-surface">
              {block.heading}
            </h2>
          ) : null}
          <div
            className="prose prose-slate max-w-none leading-8 text-on-surface-variant"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </section>
    );
  }

  if (blockType === "media-text") {
    return (
      <section className={cn("bg-surface py-12 md:py-20", customClassName)} style={customStyles}>
        <div className="content-container grid items-center gap-8 lg:grid-cols-2">
          <CmsMedia block={block} />
          <div>
            {block.subheading ? (
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">
                {block.subheading}
              </p>
            ) : null}
            {block.heading ? (
              <h2 className="font-headline text-3xl font-black text-on-surface">
                {block.heading}
              </h2>
            ) : null}
            {block.description ? (
              <p className="mt-5 leading-8 text-on-surface-variant">{block.description}</p>
            ) : null}
            {buttonText ? (
              <div className="mt-6">
                <CmsButton href={buttonHref}>{buttonText}</CmsButton>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  if (blockType === "cta") {
    return (
      <section className={cn("bg-surface-container-low py-12 md:py-16", customClassName)} style={customStyles}>
        <div className="content-container text-center">
          {block.heading ? (
            <h2 className="font-headline text-3xl font-black text-on-surface">
              {block.heading}
            </h2>
          ) : null}
          {block.description ? (
            <p className="mx-auto mt-4 max-w-2xl leading-8 text-on-surface-variant">
              {block.description}
            </p>
          ) : null}
          {buttonText ? (
            <div className="mt-7">
              <CmsButton href={buttonHref}>{buttonText}</CmsButton>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (blockType === "cards") {
    const cards = extractCards(block.contentData);
    return (
      <section className={cn("bg-background py-12 md:py-20", customClassName)} style={customStyles}>
        <div className="content-container">
          {block.heading ? (
            <h2 className="mb-8 font-headline text-3xl font-black text-on-surface">
              {block.heading}
            </h2>
          ) : null}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => {
              const href = safeHref(card.link);
              const content = (
                <div className="h-full rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm transition-transform hover:-translate-y-1">
                  {card.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.imageUrl}
                      alt={card.title}
                      loading="lazy"
                      className="mb-4 h-40 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-on-surface-variant">
                    {card.description}
                  </p>
                </div>
              );
              if (!href) return <div key={`${card.title}-${index}`}>{content}</div>;
              if (isExternalHref(href)) {
                return (
                  <a
                    key={`${card.title}-${index}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link key={`${card.title}-${index}`} href={href}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("bg-background py-12 md:py-16", customClassName)} style={customStyles}>
      <div className="content-container max-w-4xl">
        {block.heading ? (
          <h2 className="font-headline text-3xl font-black text-on-surface">
            {block.heading}
          </h2>
        ) : null}
        {block.description ? (
          <p className="mt-4 leading-8 text-on-surface-variant">{block.description}</p>
        ) : null}
        <div className="mt-6">
          <CmsMedia block={block} />
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a public website page from ordered CMS content blocks.
 */
export function WebsiteCmsPage({ page }: { page: WebsitePageDto }) {
  const blocks = (page.contentBlocks ?? []).slice().sort((a, b) => a.order - b.order);

  return (
    <main>
      {blocks.length > 0 ? (
        blocks.map((block) => <CmsBlock key={block.id} block={block} />)
      ) : (
        <section className="bg-background py-16">
          <div className="content-container max-w-3xl">
            <h1 className="font-headline text-4xl font-black text-on-surface">
              {page.title}
            </h1>
          </div>
        </section>
      )}
    </main>
  );
}
