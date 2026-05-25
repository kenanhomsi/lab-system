import Image from "next/image";
import { getTranslations } from "next-intl/server";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBTFPtQ7u9hY7otzTcVdc56n9ULq_i7ODzDsR8sSMuVksDdy3c4uI_4Ba6HQcaCIbijT9kzWfvfSwU0DuECJzxjXR70-a-C_EXVTQarlROnspBzq7_IJyc9cL-cQ64zyc90ahqhAOZac6MUyFtzb9BkdR9yzUOv0AW8nUeJCCwrZP-l-pSKMUwFn_zg6bmxbCjzW8LTunMUPJIp5fKuE7-V1P7J3E2VClZceYOgqwT0dbuzbiMiwnvUxUj78mgFlWMyYh3tXhbuJGOe";

export async function BlogHeroSection() {
  const t = await getTranslations("blog");

  return (
    <section className="relative flex min-h-[450px] items-center overflow-hidden md:min-h-[560px]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={HERO_IMG}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
        <div className="bg-orb absolute inset-s-[-10%] top-[-10%] h-[500px] w-[500px] bg-primary/10 blur-[100px]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 py-20 md:px-8">
        <div className="max-w-3xl">
          <span
            className="reveal-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary backdrop-blur-md"
            style={{ animationDelay: "100ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("badge")}
          </span>
          <h1
            className="reveal-up mb-6 font-headline text-5xl font-black leading-[1.1] tracking-tight text-on-surface md:text-7xl"
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
