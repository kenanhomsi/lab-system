import { useTranslations } from "next-intl";

function PlansPlaceholderSection({ title }: { title: string }) {
  return (
    <section className="rounded-2xl border border-dashed border-outline-variant/30 bg-surface p-6 text-center">
      <h2 className="font-headline text-xl font-bold text-on-surface">{title}</h2>
      <p className="mt-2 text-sm text-secondary">
        This section will be rebuilt in the new dashboard implementation.
      </p>
    </section>
  );
}

export default function PlansPage() {
  const t = useTranslations("subscriptions");

  return (
    <main className="mx-auto max-w-7xl space-y-12 p-6 md:p-8">
      <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {t("upgradeEyebrow")}
        </p>
        <h1 className="mt-3 font-headline text-3xl font-bold text-on-surface md:text-4xl">
          {t("packagesTitle")}
        </h1>
      </section>
      <PlansPlaceholderSection title={t("packagesTitle")} />
      <PlansPlaceholderSection title="Vouchers" />
    </main>
  );
}
