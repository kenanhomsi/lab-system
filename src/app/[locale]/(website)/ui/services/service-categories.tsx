import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import {
  type ServiceCatalogItem,
  type ServiceMetricKey,
  getServicesCatalog,
} from "./service-catalog";

function getMetricLabel(
  t: Awaited<ReturnType<typeof getTranslations>>,
  key: ServiceMetricKey,
): string {
  switch (key) {
    case "labServices":
      return t("stats.labServices");
    case "digitalServices":
      return t("stats.digitalServices");
    case "carePillars":
      return t("stats.carePillars");
    case "doctorReasons":
      return t("stats.doctorReasons");
    case "partnerServices":
      return t("stats.partnerServices");
    case "featureBlocks":
      return t("stats.featureBlocks");
  }
}

/**
 * Displays the compact service-family cards on the services index page.
 */
export async function ServiceCategories() {
  const locale = await getLocale();
  const [tCatalog, tDetailed, services] = await Promise.all([
    getTranslations("servicesPage.catalog"),
    getTranslations("servicesPage.detailedCategories"),
    getServicesCatalog(locale),
  ]);

  const ctaArrow = locale === "ar" ? "arrow_back" : "arrow_forward";

  return (
    <section className="relative overflow-hidden bg-surface-container-low py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-52 w-52 bg-primary/8 inset-s-[6%] top-[12%]" />
        <div className="bg-orb bg-orb-reverse h-64 w-64 bg-tertiary-fixed/8 inset-e-[7%] bottom-[10%]" />
      </div>

      <div className="relative content-container">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            eyebrow={tCatalog("eyebrow")}
            title={tDetailed("sectionTitle")}
            description={tDetailed("sectionDesc")}
            align="center"
            className="mx-auto max-w-3xl"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              previewLabel={tCatalog("previewLabel")}
              detailsLabel={tCatalog("viewDetails")}
              metricLabel={(key) => getMetricLabel(tCatalog, key)}
              ctaArrow={ctaArrow}
              animationDelay={`${140 + index * 80}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceCardProps = {
  service: ServiceCatalogItem;
  previewLabel: string;
  detailsLabel: string;
  metricLabel: (key: ServiceMetricKey) => string;
  ctaArrow: string;
  animationDelay: string;
};

/**
 * Renders a preview card that links to a dedicated service detail page.
 */
function ServiceCard({
  service,
  previewLabel,
  detailsLabel,
  metricLabel,
  ctaArrow,
  animationDelay,
}: ServiceCardProps) {
  return (
    <Card
      padding="none"
      className="group reveal-up overflow-hidden rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <Badge tone="default" className="bg-white/90 text-slate-900">
              {service.title}
            </Badge>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
              <Icon name={service.icon} className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 md:p-7">
        <div className="space-y-3">
          <h3 className="font-headline text-2xl font-black tracking-tight text-on-surface">
            {service.title}
          </h3>
          <p className="line-clamp-3 leading-7 text-on-surface-variant">
            {service.summary}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-black tracking-[0.28em] text-primary/80">
            {previewLabel}
          </p>
          <ul className="grid gap-3">
            {service.previewItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-3 text-sm leading-7 text-on-surface-variant ring-1 ring-outline-variant/10"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon name="check" filled size="sm" className="text-sm!" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          {service.metrics.map((metric) => (
            <Badge key={`${service.id}-${metric.key}`} tone="muted" className="px-3 py-1.5">
              <span className="font-black text-on-surface">{metric.value}</span>
              <span>{metricLabel(metric.key)}</span>
            </Badge>
          ))}
        </div>

        <Link
          href={`/services/${service.id}`}
          className="inline-flex items-center text-white justify-center gap-2 rounded-2xl clinical-gradient px-5 py-3 text-sm font-bold  shadow-lg shadow-primary/15 transition-all hover:opacity-95"
        >
          {detailsLabel}
          <Icon name={ctaArrow} size="sm" />
        </Link>
      </div>
    </Card>
  );
}
