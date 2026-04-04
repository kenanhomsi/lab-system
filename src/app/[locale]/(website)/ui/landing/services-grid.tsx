import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";

const IMAGING =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFPtQ7u9hY7otzTcVdc56n9ULq_i7ODzDsR8sSMuVksDdy3c4uI_4Ba6HQcaCIbijT9kzWfvfSwU0DuECJzxjXR70-a-C_EXVTQarlROnspBzq7_IJyc9cL-cQ64zyc90ahqhAOZac6MUyFtzb9BkdR9yzUOv0AW8nUeJCCwrZP-l-pSKMUwFn_zg6bmxbCjzW8LTunMUPJIp5fKuE7-V1P7J3E2VClZceYOgqwT0dbuzbiMiwnvUxUj78mgFlWMyYh3tXhbuJGOe";

export async function ServicesGrid() {
  const t = await getTranslations("landing.services");
  const locale = await getLocale();
  const ctaArrow = locale === "ar" ? "arrow_back" : "arrow_forward";
  const ctaArrowClass =
    locale === "ar"
      ? "transition-all group-hover:gap-4 group-hover:-translate-x-1"
      : "transition-all group-hover:gap-4 group-hover:translate-x-1";

  return (
    <section className="relative overflow-hidden bg-surface-container-low py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-56 w-56 bg-primary/12 inset-s-[8%] top-[18%]" />
        <div className="bg-orb bg-orb-reverse h-72 w-72 bg-tertiary-fixed/10 inset-e-[6%] bottom-[8%]" />
      </div>
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            title={t("gridTitle")}
            description={t("gridSubtitle")}
            align="center"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div
            className="group reveal-up relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-2"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative z-10">
              <Icon
                name="personal_injury"
                className="mb-6 text-4xl text-primary"
              />
              <h3 className="mb-4 text-2xl font-bold">{t("patientTitle")}</h3>
              <p className="mb-8 text-on-surface-variant">{t("patientBody")}</p>
              <button
                type="button"
                className="group flex items-center gap-2 font-bold text-primary"
              >
                {t("patientCta")}
                <Icon name={ctaArrow} size="sm" className={ctaArrowClass} />
              </button>
            </div>
            <div className="absolute -bottom-12 -inset-s-12 h-48 w-48 rounded-full bg-primary/5 transition-transform duration-700 group-hover:scale-150" />
          </div>
          <div
            className="reveal-up rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl"
            style={{ animationDelay: "200ms" }}
          >
            <Icon name="stethoscope" className="mb-6 text-4xl text-primary" />
            <h3 className="mb-4 text-xl font-bold">{t("doctorTitle")}</h3>
            <p className="text-sm text-on-surface-variant">{t("doctorBody")}</p>
          </div>
          <div
            className="reveal-up rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl"
            style={{ animationDelay: "260ms" }}
          >
            <Icon name="science" className="mb-6 text-4xl text-primary" />
            <h3 className="mb-4 text-xl font-bold">{t("labTitle")}</h3>
            <p className="text-sm text-on-surface-variant">{t("labBody")}</p>
          </div>
          <div
            className="reveal-up rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl"
            style={{ animationDelay: "320ms" }}
          >
            <Icon name="business" className="mb-6 text-4xl text-primary" />
            <h3 className="mb-4 text-xl font-bold">{t("companyTitle")}</h3>
            <p className="text-sm text-on-surface-variant">
              {t("companyBody")}
            </p>
          </div>
          <div
            className="reveal-up flex flex-col items-center gap-8 rounded-xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl md:col-span-3 md:flex-row"
            style={{ animationDelay: "380ms" }}
          >
            <div className="flex-1">
              <Icon name="experiment" className="mb-6 text-4xl text-primary" />
              <h3 className="mb-4 text-2xl font-bold">
                {t("electronicTitle")}
              </h3>
              <p className="text-on-surface-variant">
                {t("electronicBody")}
              </p>
            </div>
            <div className="h-48 w-full flex-1 overflow-hidden rounded-lg md:w-1/2">
              <Image
                src={IMAGING}
                alt=""
                width={600}
                height={300}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
