import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { MetwaliBlogPost } from "@/lib/metwali-blog";
import type { AppLocale } from "@/i18n/routing";

type BlogPostGridProps = {
  result: { ok: true; posts: MetwaliBlogPost[] } | { ok: false };
};

export async function BlogPostGrid({ result }: BlogPostGridProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as AppLocale;

  if (!result.ok) {
    return (
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-8">
        <p className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-8 text-center text-on-surface-variant">
          {t("error")}
        </p>
      </section>
    );
  }

  if (result.posts.length === 0) {
    return (
      <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-8">
        <p className="text-center text-on-surface-variant">{t("empty")}</p>
      </section>
    );
  }

  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
    dateStyle: "medium",
  });
  const readArrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const readArrowClass =
    locale === "ar"
      ? "transition-transform group-hover:-translate-x-0.5"
      : "transition-transform group-hover:translate-x-0.5";

  return (
    <section className="mx-auto max-w-screen-2xl px-6 py-16 md:px-8">
      <p className="reveal-up mb-10 text-center text-sm text-on-surface-variant md:text-start" style={{ animationDelay: "80ms" }}>
        {t("sourceNote")}
      </p>
      <ul className="grid gap-8 md:grid-cols-2">
        {result.posts.map((post, i) => (
          <li key={post.id} className="reveal-up" style={{ animationDelay: `${160 + i * 80}ms` }}>
            <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md">
              <Link
                href={`/blog/${post.id}`}
                className="group flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/15 via-surface-container to-surface-container-high">
                  {post.featuredImageUrl ? (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt ?? ""}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full min-h-[140px] items-center justify-center">
                      <Icon
                        name="article"
                        className="!text-6xl text-primary/25"
                        size="lg"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <time
                    dateTime={post.date}
                    className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary"
                  >
                    {dateFmt.format(new Date(post.date))}
                  </time>
                  <h2
                    className="mb-4 font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl"
                    lang={post.useArabicContentOnEn ? "ar" : undefined}
                    dir={post.useArabicContentOnEn ? "rtl" : undefined}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mb-6 flex-1 text-sm leading-relaxed text-on-surface-variant md:text-base"
                    lang={post.useArabicContentOnEn ? "ar" : undefined}
                    dir={post.useArabicContentOnEn ? "rtl" : undefined}
                  >
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-primary/90">
                    {t("readFull")}
                    <Icon
                      name={readArrow}
                      className={`text-base ${readArrowClass}`}
                      size="sm"
                    />
                  </span>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
