import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { MetwaliPostDetail } from "@/types/metwali-blog";
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
    <article className="pb-24">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-surface-container-lowest pt-16 pb-32 md:pt-24 md:pb-40 border-b border-outline-variant/15">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-orb absolute inset-s-[-10%] top-[-20%] h-[600px] w-[600px] bg-primary/5 blur-[120px]" />
          <div className="bg-orb absolute inset-e-[-5%] bottom-[-10%] h-[400px] w-[400px] bg-secondary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-md px-6 md:px-8">
          <Link
            href="/blog"
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface px-4 py-2 text-sm font-bold text-on-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow hover:text-primary"
          >
            <Icon name={arrow} className={arrowClass} size="sm" />
            {t("backToList")}
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
              <Icon name="calendar_today" size="sm" className="!text-[14px]" />
              <time dateTime={post.date}>{dateFmt.format(new Date(post.date))}</time>
            </span>
          </div>

          <h1
            className="mb-6 font-headline text-4xl font-black leading-tight tracking-tight text-on-surface md:text-5xl lg:text-6xl"
            lang={post.useArabicContentOnEn && locale === "en" ? "ar" : undefined}
            dir={post.useArabicContentOnEn && locale === "en" ? "rtl" : undefined}
          >
            {post.title}
          </h1>

          {post.excerpt ? (
            <p
              className="text-lg leading-relaxed text-on-surface-variant md:text-xl md:leading-relaxed"
              lang={post.useArabicContentOnEn && locale === "en" ? "ar" : undefined}
              dir={post.useArabicContentOnEn && locale === "en" ? "rtl" : undefined}
            >
              {post.excerpt}
            </p>
          ) : null}
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImageUrl ? (
        <div className="relative z-20 mx-auto -mt-20 max-w-screen-lg px-6 md:-mt-32 md:px-8">
          <div className="relative aspect-[21/10] w-full overflow-hidden rounded-3xl bg-surface-container shadow-2xl ring-1 ring-outline-variant/20">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt ?? ""}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      ) : null}

      {/* Article Body */}
      <div className="mx-auto max-w-screen-md px-6 pt-16 md:px-8 md:pt-20">
        {showArabicNote ? (
          <p className="mb-10 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm font-medium text-on-surface-variant">
            <Icon name="translate" className="text-primary" />
            {t("articleArabicBodyNote")}
          </p>
        ) : null}
        <div
          className={cn(
            "blog-article-body max-w-none text-on-surface",
            // Links
            "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-primary/30 hover:[&_a]:decoration-primary transition-all",
            // Images
            "[&_img]:my-10 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl [&_img]:shadow-md [&_img]:ring-1 [&_img]:ring-outline-variant/10",
            // Paragraphs
            "[&_p]:mb-8 [&_p]:text-[1.125rem] [&_p]:leading-[1.8] [&_p]:text-on-surface-variant",
            // Headings
            "[&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:font-headline [&_h2]:text-3xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-on-surface",
            "[&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:font-headline [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-on-surface",
            "[&_h4]:mt-8 [&_h4]:mb-4 [&_h4]:font-headline [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-on-surface",
            // Lists
            "[&_ul]:my-8 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-3 [&_li]:text-[1.125rem] [&_li]:text-on-surface-variant [&_li]:leading-relaxed",
            "[&_ol]:my-8 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-3 [&_li]:text-[1.125rem] [&_li]:text-on-surface-variant [&_li]:leading-relaxed",
            // Blockquotes
            "[&_blockquote]:my-10 [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-6 [&_blockquote]:rounded-e-2xl [&_blockquote]:italic [&_blockquote]:text-on-surface-variant",
            // Bold/Strong
            "[&_strong]:font-bold [&_strong]:text-on-surface"
          )}
          lang="ar"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </article>
  );
}
