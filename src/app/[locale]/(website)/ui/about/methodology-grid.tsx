import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const THUMB =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAe158G1y0CjJNLoC64S1x3gmIWSOTxm9uBrO74fm7Z0lbmqaWZ5Q4xOFXR9iLYf6lYKCcrQpBVDsKN02ptlbAcS_gnXonobNbu1BBq5m1LUbahzO-wd5THvTfPqot3bpaF-TdAQRu1O4w7NyW8I6mJWbcoi7dJEEn4vjJI6FKbRK_N9trH4Y94eNZM6cxXq8R67kJWtdyYa1ItOJ-QBEoBTcSz-8QSgIG-OzHS1gYCWOV0YlMKJqvKbAgaeIb22FHdKGtrEUIF53KN";

export async function AboutMethodologyGrid() {
  const t = await getTranslations("aboutPage.approach");

  return (
    <section className="bg-surface py-20 md:py-32">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up mb-16 text-center md:mb-24" style={{ animationDelay: "80ms" }}>
          <span className="text-xs font-black tracking-[0.4em] text-tertiary">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-headline text-4xl font-black md:text-5xl">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="reveal-up group relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8 transition-all duration-500 hover:border-primary/20 md:col-span-2 md:p-10" style={{ animationDelay: "160ms" }}>
            <div className="relative z-10">
              <Icon
                name="biotech"
                filled
                className="mb-8 text-4xl text-primary"
              />
              <h3 className="mb-4 text-2xl font-bold">{t("c1Title")}</h3>
              <p className="max-w-md leading-relaxed text-on-surface-variant">
                {t("c1Body")}
              </p>
            </div>
            <span className="pointer-events-none absolute start-0 top-0 p-4 font-headline text-[6rem] font-black leading-none text-on-surface/5">
              01
            </span>
          </div>
          <div className="reveal-up group relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container p-8 transition-all duration-500 hover:border-tertiary/20 md:p-10" style={{ animationDelay: "240ms" }}>
            <div className="relative z-10">
              <Icon
                name="verified"
                filled
                className="mb-8 text-4xl text-tertiary"
              />
              <h3 className="mb-4 text-2xl font-bold">{t("c2Title")}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("c2Body")}
              </p>
            </div>
            <span className="pointer-events-none absolute bottom-0 start-0 p-4 font-headline text-[4rem] font-black leading-none text-on-surface/5">
              02
            </span>
          </div>
          <div className="reveal-up group relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container p-8 transition-all duration-500 hover:border-primary/20 md:p-10" style={{ animationDelay: "320ms" }}>
            <div className="relative z-10">
              <Icon name="speed" className="mb-8 text-4xl text-primary" />
              <h3 className="mb-4 text-2xl font-bold">{t("c3Title")}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {t("c3Body")}
              </p>
            </div>
            <span className="pointer-events-none absolute bottom-0 start-0 p-4 font-headline text-[4rem] font-black leading-none text-on-surface/5">
              03
            </span>
          </div>
          <div className="reveal-up group relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8 transition-all duration-500 hover:border-tertiary/20 md:col-span-2 md:p-10" style={{ animationDelay: "400ms" }}>
            <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
              <div className="flex-1">
                <Icon
                  name="support_agent"
                  filled
                  className="mb-8 text-4xl text-tertiary"
                />
                <h3 className="mb-4 text-2xl font-bold">{t("c4Title")}</h3>
                <p className="leading-relaxed text-on-surface-variant">
                  {t("c4Body")}
                </p>
              </div>
              <div className="h-48 w-full overflow-hidden rounded-xl md:w-64">
                <Image
                  src={THUMB}
                  alt=""
                  width={256}
                  height={192}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
