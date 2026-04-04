import Image from "next/image";
import { getTranslations } from "next-intl/server";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFPtQ7u9hY7otzTcVdc56n9ULq_i7ODzDsR8sSMuVksDdy3c4uI_4Ba6HQcaCIbijT9kzWfvfSwU0DuECJzxjXR70-a-C_EXVTQarlROnspBzq7_IJyc9cL-cQ64zyc90ahqhAOZac6MUyFtzb9BkdR9yzUOv0AW8nUeJCCwrZP-l-pSKMUwFn_zg6bmxbCjzW8LTunMUPJIp5fKuE7-V1P7J3E2VClZceYOgqwT0dbuzbiMiwnvUxUj78mgFlWMyYh3tXhbuJGOe";

export async function BlogHeroSection() {
  const t = await getTranslations("blog");

  return (
    <section className="relative flex min-h-[420px] items-center overflow-hidden md:min-h-[520px]">
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
            className="reveal-up mb-6 font-headline text-4xl font-black leading-[0.95] tracking-tight text-on-surface md:text-6xl"
            style={{ animationDelay: "180ms" }}
          >
            {t("titleLine1")}{" "}
            <span className="text-primary">{t("titleAccent")}</span>
          </h1>
          <p
            className="reveal-up max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
            style={{ animationDelay: "260ms" }}
          >
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  );
}
