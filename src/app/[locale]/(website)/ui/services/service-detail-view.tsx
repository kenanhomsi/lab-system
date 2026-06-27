import type { ReactNode } from "react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import {
  type ServiceCatalogItem,
  type ServiceDetailSection,
  type ServiceMetricKey,
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
 * Renders the full, dedicated details page for a single service family.
 */
export async function ServiceDetailView({
  service,
}: {
  service: ServiceCatalogItem;
}) {
  const locale = await getLocale();
  const [tCatalog, tDetail] = await Promise.all([
    getTranslations("servicesPage.catalog"),
    getTranslations("servicesPage.detail"),
  ]);

  const breadcrumbIcon = locale === "ar" ? "chevron_left" : "chevron_right";
  const backArrow = locale === "ar" ? "arrow_forward" : "arrow_back";

  return (
    <main className="bg-linear-to-b from-surface via-surface to-surface-container-low py-12 md:py-20">
      <div className="content-container">
        <nav className="mb-8 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/services" className="transition-colors hover:text-primary">
            {tDetail("breadcrumbServices")}
          </Link>
          <Icon name={breadcrumbIcon} size="sm" />
          <span className="font-semibold text-on-surface">{service.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-outline-variant/20 bg-surface-container-high shadow-lg">
              <Image
                src={service.image}
                alt={service.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-sm">
                  <Icon name={service.icon} className="text-3xl" />
                </div>
                <Badge tone="default" className="bg-white/90 text-slate-900">
                  {service.title}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-sm md:p-8">
              <h1 className="font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                {service.title}
              </h1>
              <p className="mt-4 leading-8 text-on-surface-variant">
                {service.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.metrics.map((metric) => (
                  <Badge
                    key={`${service.id}-${metric.key}`}
                    tone="muted"
                    className="px-3 py-1.5"
                  >
                    <span className="font-black text-on-surface">{metric.value}</span>
                    <span>{getMetricLabel(tCatalog, metric.key)}</span>
                  </Badge>
                ))}
              </div>

              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80"
              >
                <Icon name={backArrow} size="sm" />
                {tDetail("backToServices")}
              </Link>
            </div>

            {service.intro.length > 1 ? (
              <Card className="space-y-4">
                <h2 className="font-headline text-lg font-bold text-on-surface">
                  {tDetail("overviewTitle")}
                </h2>
                {service.intro.slice(1).map((paragraph) => (
                  <p key={paragraph} className="leading-8 text-on-surface-variant">
                    {paragraph}
                  </p>
                ))}
              </Card>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          {service.sections.map((section) => (
            <Card key={`${service.id}-${section.id}`} className="space-y-6">
              {section.title ? (
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon
                      name={section.variant === "list" ? "checklist" : "info"}
                      filled={section.variant !== "list"}
                      size="sm"
                    />
                  </div>
                  <div>
                    <h2 className="font-headline text-xl font-bold text-on-surface">
                      {section.title}
                    </h2>
                    {section.description ? (
                      <p className="mt-2 leading-8 text-on-surface-variant">
                        {section.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : section.description ? (
                <p className="leading-8 text-on-surface-variant">{section.description}</p>
              ) : null}

              <SectionContent section={section} />
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

/**
 * Chooses the appropriate detail layout for a service section.
 */
function SectionContent({ section }: { section: ServiceDetailSection }) {
  if (section.variant === "detail-grid") {
    return (
      <ul className="grid gap-4 md:grid-cols-2">
        {section.items.map((item) => (
          <ServiceDetailBlock key={`${item.title}-${item.desc}`} title={item.title} desc={item.desc} />
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "grid gap-3",
        section.items.length >= 6 && "xl:grid-cols-2",
      )}
    >
      {section.items.map((item, index) => (
        <ServiceListItem key={`${section.id}-${index}`} index={index + 1}>
          {item}
        </ServiceListItem>
      ))}
    </ul>
  );
}

/**
 * Displays a numbered bullet row for text-only service points.
 */
function ServiceListItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-4 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-outline-variant/15">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon name="check" filled className="text-sm!" size="sm" />
      </div>
      <div className="flex min-w-0 items-start gap-3">
        <span className="pt-0.5 text-[11px] font-black tracking-[0.2em] text-primary/60">
          {index}
        </span>
        <span className="text-sm leading-7">{children}</span>
      </div>
    </li>
  );
}

/**
 * Displays an informational card inside a service details grid.
 */
function ServiceDetailBlock({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-surface-container-low px-5 py-4 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-outline-variant/15">
      <div className="flex items-center gap-2 text-primary">
        <Icon name="info" filled className="text-lg!" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <p className="text-sm leading-7">{desc}</p>
    </li>
  );
}
