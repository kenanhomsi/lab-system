import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/ui/section-header";

const IMG_MOL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuALi-mZ6bWnyT6V6AuqMrbu0P8m_nqFZtEX4-jyDjTpgJL_IAfj_VmrGN-Kl5S8W2erJDwjZgsOwAfmoqHhfhAhZWFBGT3iKqVKwLPHJKA_49VgefBCJifUhCCNhqYx6OeT7wFp2ZCMnvardWLgT_gePkj-fCNTLfd0-TNpEb4XozrCKlV4oi2YjLAybr4ViPt7ugR7auP_M5vLn9zJMiFSLGf27vuGoNfJ9NLWIcKLzeLHSKHjt_vUtd-q_wqb50TjfBbkFf_0lWFO";
const IMG_TOX =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBflJAVIkMGh1PFNgqvwY6KN7VMafbww5pEpO5HzDLSHDrah2k7NNgsGZhv4qaY1FadHDnGd7DkVxUWqJvIbPCNWVNhk1dFRuSS9pOHhrrUrMHfmgaR2h9nHTxCOJY7XfyDK3oUJERsTUi0MlD-4wx3C0aTnpIIcvyMQtmDYS6EeRH74AtsV9X6mV7RVS4mreT9TlKvRne7XfsF9pRynluYryB4mj3QvOKi84Uq4xi_YJmPm6wAcs6ty1BEnCj_t69vZ_bl0kwt-qLc";

export async function DepartmentsSection() {
  const t = await getTranslations("landing.departments");

  return (
    <section className="bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            className="mb-12 md:mb-16"
            title={t("gridTitle")}
            description={t("gridSubtitle")}
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div
            className="group reveal-up overflow-hidden rounded-2xl bg-white p-1 shadow-sm dark:bg-surface-container-high md:col-span-4"
            style={{ animationDelay: "160ms" }}
          >
            <div className="h-64 overflow-hidden rounded-xl">
              <Image
                src={IMG_MOL}
                alt=""
                width={400}
                height={256}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="p-8">
              <h4 className="mb-2 text-xl font-bold">{t("hormonalTitle")}</h4>
              <p className="text-sm text-on-surface-variant">
                {t("hormonalBody")}
              </p>
            </div>
          </div>
          <div
            className="group reveal-up flex flex-col overflow-hidden rounded-2xl bg-white p-1 shadow-sm dark:bg-surface-container-high md:col-span-8 md:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
              <h4 className="mb-4 text-2xl font-bold md:text-3xl">
                {t("immuneTitle")}
              </h4>
              <p className="mb-6 text-lg leading-relaxed text-on-surface-variant">
                {t("immuneBody")}
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="rounded bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-slate-800">
                  {t("immuneChip1")}
                </span>
                <span className="rounded bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-slate-800">
                  {t("immuneChip2")}
                </span>
              </div>
            </div>
            <div className="h-64 w-full overflow-hidden md:h-auto md:w-1/2">
              <Image
                src={IMG_TOX}
                alt=""
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
