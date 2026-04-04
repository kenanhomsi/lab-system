import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { MetwaliPostDetail } from "@/lib/metwali-blog";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type BlogArticleViewProps = {
  post: MetwaliPostDetail;
};

export async function BlogArticleView({ post }: BlogArticleViewProps) {
  const t = await getTranslations("blog");
  const locale = (await getLocale()) as AppLocale;
  const dateFmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
    dateStyle: "long",
  });
  const arabicNote = t("articleArabicBodyNote");
  const showArabicNote =
    locale === "en" && arabicNote.length > 0;

  const arrow = locale === "ar" ? "arrow_forward" : "arrow_back";
  const arrowClass =
    locale === "ar"
      ? "transition-transform group-hover:translate-x-1"
      : "transition-transform group-hover:-translate-x-1";

  return (
    <article className="pb-20">
      <div className="border-b border-outline-variant/15 bg-surface-container-lowest/40">
        <div className="mx-auto max-w-screen-lg px-6 py-10 md:px-8 md:py-14">
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            <Icon name={arrow} className={arrowClass} size="sm" />
            {t("backToList")}
          </Link>
          <time
            dateTime={post.date}
            className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary"
          >
            {dateFmt.format(new Date(post.date))}
          </time>
          <h1
            className="font-headline text-3xl font-black leading-tight tracking-tight text-on-surface md:text-5xl"
            lang={post.useArabicContentOnEn && locale === "en" ? "ar" : undefined}
            dir={post.useArabicContentOnEn && locale === "en" ? "rtl" : undefined}
          >
            {post.title}
          </h1>
          {post.excerpt ? (
            <p
              className="mt-6 max-w-2xl text-lg text-on-surface-variant"
              lang={post.useArabicContentOnEn && locale === "en" ? "ar" : undefined}
              dir={post.useArabicContentOnEn && locale === "en" ? "rtl" : undefined}
            >
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </div>

      {post.featuredImageUrl ? (
        <div className="relative mx-auto mt-10 max-w-screen-lg px-6 md:px-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-surface-container">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
              unoptimized
            />
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-screen-lg px-6 pt-12 md:px-8">
        {showArabicNote ? (
          <p className="mb-8 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-on-surface-variant">
            {t("articleArabicBodyNote")}
          </p>
        ) : null}
        <div
          className={cn(
            "blog-article-body max-w-none text-on-surface",
            "[&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline",
            "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl",
            "[&_p]:mb-4 [&_p]:leading-relaxed",
            "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-headline [&_h2]:text-2xl [&_h2]:font-bold",
            "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-headline [&_h3]:text-xl [&_h3]:font-bold",
            "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6",
            "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6",
          )}
          lang="ar"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
