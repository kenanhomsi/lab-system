import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFPtQ7u9hY7otzTcVdc56n9ULq_i7ODzDsR8sSMuVksDdy3c4uI_4Ba6HQcaCIbijT9kzWfvfSwU0DuECJzxjXR70-a-C_EXVTQarlROnspBzq7_IJyc9cL-cQ64zyc90ahqhAOZac6MUyFtzb9BkdR9yzUOv0AW8nUeJCCwrZP-l-pSKMUwFn_zg6bmxbCjzW8LTunMUPJIp5fKuE7-V1P7J3E2VClZceYOgqwT0dbuzbiMiwnvUxUj78mgFlWMyYh3tXhbuJGOe";

export async function ServicesHeroSection() {
  const t = await getTranslations("servicesPage.hero");

  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden md:min-h-[700px]">
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover opacity-30"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 md:px-8">
        <div className="max-w-3xl">
          <span
            className="reveal-up mb-6 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-xs font-bold tracking-[0.2em] text-primary"
            style={{ animationDelay: "100ms" }}
          >
            {t("badge")}
          </span>
          <h1
            className="reveal-up mb-8 font-headline text-5xl font-black leading-[0.95] tracking-tight text-on-surface md:text-7xl"
            style={{ animationDelay: "180ms" }}
          >
            {t("titleLine1")} <br />
            <span className="text-primary">{t("titleAccent")}</span>
          </h1>
          <p
            className="reveal-up mb-10 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
            style={{ animationDelay: "260ms" }}
          >
            {t("description")}
          </p>
          <a
            href="#tests-catalog"
            className="reveal-up group inline-flex items-center gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-4 shadow-sm transition-all hover:shadow-lg"
            style={{ animationDelay: "340ms" }}
          >
            <span className="text-sm font-bold tracking-wide">
              {t("browseTests")}
            </span>
            <Icon
              name="arrow_downward"
              className="text-primary transition-transform group-hover:translate-y-1"
              size="sm"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
