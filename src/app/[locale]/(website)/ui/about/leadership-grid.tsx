import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const IMG1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1azZ2hBqGVrLd-fPElS7drYdJRhYpiLeuGRjlyhShCNP2uowFFTelxeGXuy7PqPd-QUbkaHMkaJgaoU2K3F9D56XYl58718yD9UveKRl8j-JmtNjgdVvFJgs3cuqn1SDeOZfbOj3ZpTwERSQnir-LjZtz_cT7w34M87Z9cx44shKAhGHLkphhmlfeFpz_-gq-faEiodRSxfl4O7OToX_0a1l86ylbIQ_C_7gMQ8UbHvebiPK1flaw2g8VfupHBRK6HKP_X_ZPfdxN";
const IMG2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBS7QbJnx37UPNufTZx5ANBgn7qmYctWEntROejPuCvmD92P7odlrrCz62tH3u06Uq3m2Rq4D5p2e4F2rL7QVqlneNq5Sg4NvhMo6NTyNYluAQAROk2Y6DIgSZFcijfC6t1O990NrRRFQLTnDsNKFpJDb7wfjzvZrouuqHCa5Duxdw_-ztkyGhEZ0UL3u4b428Stek2Q8OCrAoD3FV622NwWTWjHqDC4BopxLZKg20hxG74GT6exOpQDmV7j92leMnECJjiooR_HukY";
const IMG3 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBH-xITg5V4yN9mvr5iWqGvkWgvpQmPiwwnURKDofsS5jbcMe6ycvhy3iGVV1weQUH5MI9NAAwt3qPUImgmhD0QF7Sr44FkNzsG1gRASpNJo904C6o3am7ksPCBVuDjIO8pTLMcosFrvKRsiMoAoX8W-pujsEMdAIJp4KNS-8DKlAD4IDmk14p-F3R3akyKNcql729HESYYPqABRnUcT-Qzrt_PcgPt1QR9ZeiAQ360Dtz4W1JcqzXQibBh7Z2PeT6bwZpKTrpVjA0k";

export async function AboutLeadershipGrid() {
  const t = await getTranslations("aboutPage.features");
  const locale = await getLocale();
  const isAr = locale === "ar";
  const prevIcon = isAr ? "chevron_right" : "chevron_left";
  const nextIcon = isAr ? "chevron_left" : "chevron_right";
  const services = [
    { title: t("f1Title"), description: t("f1Body"), img: IMG1 },
    { title: t("f2Title"), description: t("f2Body"), img: IMG2 },
    { title: t("f3Title"), description: t("f3Body"), img: IMG3 },
  ];

  return (
    <section className="bg-surface-container-low py-20 md:py-32">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-start" style={{ animationDelay: "80ms" }}>
          <div className="max-w-xl">
            <h2 className="mb-6 font-headline text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">
              {t("title1")} <br />
              {t("title2")}
            </h2>
            <p className="text-lg text-on-surface-variant">{t("subtitle")}</p>
          </div>
          <div className="flex gap-4 md:ms-auto">
            <button
              type="button"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-surface-container-lowest transition-colors hover:bg-primary/20"
              aria-label={t("prev")}
            >
              <Icon name={prevIcon} className="text-primary" size="sm" />
            </button>
            <button
              type="button"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-surface-container-lowest transition-colors hover:bg-primary/20"
              aria-label={t("next")}
            >
              <Icon name={nextIcon} className="text-primary" size="sm" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`reveal-up group ${i === 1 ? "md:mt-12 lg:mt-0" : ""} ${i === 2 ? "lg:mt-12" : ""}`}
              style={{ animationDelay: `${160 + i * 120}ms` }}
            >
              <div className="relative mb-8 aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={s.img}
                  alt=""
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <h4 className="mb-1 text-2xl font-bold">{s.title}</h4>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
