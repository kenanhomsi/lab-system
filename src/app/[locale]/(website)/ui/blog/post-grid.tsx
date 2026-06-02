import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { MetwaliBlogPost } from "@/types/metwali-blog";
import type { AppLocale } from "@/i18n/routing";

type BlogPostGridProps = {
  result: { ok: true; posts: MetwaliBlogPost[] } | { ok: false };
};

export async function BlogPostGrid({ result }: BlogPostGridProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as AppLocale;

  if (!result.ok) {
    return (
      <section className="content-container py-16">
        <p className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-6 py-8 text-center text-on-surface-variant">
          {t("error")}
        </p>
      </section>
    );
  }

  if (result.posts.length === 0) {
    return (
      <section className="content-container py-16">
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
    <section className="content-container py-16 lg:py-24">
      <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p
            className="reveal-up mb-2 text-center text-sm font-bold tracking-widest text-primary uppercase md:text-start"
            style={{ animationDelay: "80ms" }}
          >
            {t("badge")}
          </p>
          <h2
            className="reveal-up text-center font-headline text-3xl font-black tracking-tight text-on-surface md:text-start md:text-4xl"
            style={{ animationDelay: "120ms" }}
          >
            {t("gridTitle")}
          </h2>
        </div>
        <p
          className="reveal-up max-w-md text-center text-sm text-on-surface-variant md:text-start"
          style={{ animationDelay: "160ms" }}
        >
          {t("sourceNote")}
        </p>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
        {result.posts.map((post, i) => (
          <li
            key={post.id}
            className="reveal-up"
            style={{ animationDelay: `${200 + (i % 6) * 60}ms` }}
          >
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/30">
              <Link
                href={`/blog/${post.id}`}
                className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 via-surface-container to-surface-container-high">
                  {post.featuredImageUrl ? (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt ?? ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full min-h-[140px] items-center justify-center">
                      <Icon
                        name="article"
                        className="!text-6xl text-primary/20 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/40"
                        size="lg"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <time
                      dateTime={post.date}
                      className="text-xs font-bold uppercase tracking-widest text-primary/80"
                    >
                      {dateFmt.format(new Date(post.date))}
                    </time>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Icon
                        name="arrow_outward"
                        size="sm"
                        className="!text-[14px]"
                      />
                    </span>
                  </div>
                  <h2
                    className="mb-4 font-headline text-xl font-black leading-snug tracking-tight text-on-surface transition-colors group-hover:text-primary line-clamp-2"
                    lang={post.useArabicContentOnEn ? "ar" : undefined}
                    dir={post.useArabicContentOnEn ? "rtl" : undefined}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="mb-6 flex-1 text-sm leading-relaxed text-on-surface-variant line-clamp-3"
                    lang={post.useArabicContentOnEn ? "ar" : undefined}
                    dir={post.useArabicContentOnEn ? "rtl" : undefined}
                  >
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors group-hover:text-primary-dark">
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
