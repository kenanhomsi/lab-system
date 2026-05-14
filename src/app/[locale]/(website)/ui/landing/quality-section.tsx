import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const AV1 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAMMbN7OLw9kLAAsBNo4FKhSBVOTVDEsPaJD2r-quOOEw3gg33RkwUfjKSc2hEI-JCBTAJ04901kgbhol6USvSsppbZd5eGQtU3JQBNGDFqH8hQ8rQHbHeZ0WDtJi_HtFFAroAHd85Lg37XHa9GLD1UUloe8FIPLd7S-Wzhfqzy8eqz-XGqoyyZWsaHnYiB2tBhN8LTfPLwlcOMznkk50YVGPw2clj8QPtXysJclNoHXPTRY19rQg_YfUME4XaIN8sHkAgrseEnRYN2";
const AV2 =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBgg9YBL74Zpa3Jm76FKjSs1u_RR349auws9NmTSzspIlcTo1W7JzyXoZf2cXrZp-mhpHRMiE4TOdPtKR9fAaRxyabs1QO8PpgllI-1M3D0HkDuzP4hL1BC6RxyMgkDOJPuKzLe6WoAx5yxWCWt7WltDRJE1WUEliuqoX3l1Rpvahy3x_jbnXQsdWyj9X7qFppNwr-zGPnxI5HlLpyiEG60wwc2HXTikxZqTIGwiiIqaISibOoCoXSPSoE52RwxEDWLZXX6N7KBewZt";

export async function QualitySection() {
  const t = await getTranslations("landing.quality");

  return (
    <section className="relative overflow-hidden bg-surface py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-44 w-44 bg-primary/10 inset-s-[10%] top-[14%]" />
        <div className="bg-orb bg-orb-reverse h-56 w-56 bg-primary-fixed/10 inset-e-[4%] bottom-[12%]" />
      </div>
      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div
              className="reveal-up inline-block rounded bg-primary/10 px-4 py-1 text-xs font-bold tracking-widest text-primary"
              style={{ animationDelay: "90ms" }}
            >
              {t("protocol")}
            </div>
            <h2
              className="font-headline reveal-up text-4xl font-extrabold tracking-tight text-on-surface sm:text-5xl"
              style={{ animationDelay: "150ms" }}
            >
              {t("title")}
            </h2>
            <div className="space-y-6">
              <div
                className="reveal-up flex gap-4 rounded-xl border-s-4 border-tertiary bg-surface-container-low p-6 shadow-sm"
                style={{ animationDelay: "220ms" }}
              >
                <Icon
                  name="workspace_premium"
                  filled
                  className="text-tertiary-container"
                  size="sm"
                />
                <div>
                  <h4 className="text-lg font-bold">{t("tripleTitle")}</h4>
                  <p className="text-sm text-on-surface-variant">
                    {t("tripleBody")}
                  </p>
                </div>
              </div>
              <div
                className="reveal-up flex gap-4 rounded-xl border-s-4 border-primary bg-surface-container-low p-6 shadow-sm"
                style={{ animationDelay: "290ms" }}
              >
                <Icon name="verified_user" className="text-primary" size="sm" />
                <div>
                  <h4 className="text-lg font-bold">{t("aiTitle")}</h4>
                  <p className="text-sm text-on-surface-variant">
                    {t("aiBody")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="reveal-up relative" style={{ animationDelay: "350ms" }}>
            <div className="absolute -inset-s-12 -top-12 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative z-10 rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-2xl">
              <div className="mb-8">
                <div className="mb-6 flex items-center justify-between">
                  <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {t("benchmark")}
                  </h5>
                  <span className="font-bold text-primary">{t("liveData")}</span>
                </div>
                <div className="relative flex h-48 w-full items-end gap-2">
                  <div className="absolute bottom-1/4 h-px w-full bg-on-surface/10" />
                  <div className="absolute bottom-2/4 h-px w-full bg-on-surface/10" />
                  <div className="absolute bottom-3/4 h-px w-full bg-on-surface/10" />
                  {[40, 60, 85, 55, 70, 92, 65].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${i === 2 || i === 5 ? "bg-primary" : "bg-primary-fixed"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between">
                  {["08:00", "12:00", "16:00", "20:00"].map((time) => (
                    <span
                      key={time}
                      className="text-[10px] font-bold text-slate-400"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="flex flex-row items-center [&>*:not(:first-child)]:-ms-2">
                  <Image
                    src={AV1}
                    alt={t("reviewers")}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-slate-900"
                    unoptimized
                  />
                  <Image
                    src={AV2}
                    alt={t("reviewers")}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover dark:border-slate-900"
                    unoptimized
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold dark:border-slate-900 dark:bg-slate-800">
                    {t("extraCount")}
                  </div>
                </div>
                <span className="text-xs font-semibold italic text-slate-500">
                  {t("reviewers")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
