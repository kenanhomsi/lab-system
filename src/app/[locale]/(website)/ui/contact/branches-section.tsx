import { getTranslations } from "next-intl/server";
import { OsmBranchesMapDynamic } from "@/components/maps/osm-branches-map-dynamic";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { CONTACT_BRANCHES, type ContactBranch } from "@/lib/contact-branches";

export async function BranchesSection() {
  const t = await getTranslations("contactPage.branches");
  const info = await getTranslations("contactPage.info");

  const branchesForMap: ContactBranch[] = CONTACT_BRANCHES.map((c, i) => ({
    ...c,
    name: i === 0 ? t("branch1Name") : t("branch2Name"),
    address: i === 0 ? t("branch1Address") : t("branch2Address"),
    phone: t("sharedLandline"),
    mobile: t("sharedMobile"),
    shortCode: t("sharedShortCode"),
  }));

  const branches = [
    {
      name: t("branch1Name"),
      address: t("branch1Address"),
      phone: t("sharedLandline"),
      mobile: t("sharedMobile"),
      shortCode: t("sharedShortCode"),
    },
    {
      name: t("branch2Name"),
      address: t("branch2Address"),
      phone: t("sharedLandline"),
      mobile: t("sharedMobile"),
      shortCode: t("sharedShortCode"),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low to-surface py-20 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(59,130,246,0.05),transparent)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="absolute left-1/2 top-16 -translate-x-1/2">
        <div className="h-[300px] w-[300px] rounded-full bg-primary/[0.04] blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-screen-2xl px-6 md:px-8">
        <div
          className="reveal-up mb-12 md:mb-16"
          style={{ animationDelay: "60ms" }}
        >
          <SectionHeader
            eyebrow={t("mapEyebrow")}
            title={t("title")}
            description={t("description")}
            action={
              <div className="hidden flex-wrap gap-3 md:flex">
                <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/15 bg-white px-4 py-3 shadow-sm">
                  <Icon name="location_on" className="text-primary" size="sm" />
                  <div>
                    <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                      {t("title")}
                    </p>
                    <p className="font-headline text-base font-bold text-on-surface">
                      {CONTACT_BRANCHES.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/15 bg-white px-4 py-3 shadow-sm">
                  <Icon name="schedule" className="text-tertiary" size="sm" />
                  <div>
                    <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                      {info("itemHours")}
                    </p>
                    <p className="font-headline text-base font-bold text-on-surface">
                      {info("hoursValue")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-outline-variant/15 bg-white px-4 py-3 shadow-sm">
                  <Icon name="call" className="text-secondary" size="sm" />
                  <div>
                    <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                      {t("shortCodeLabel")}
                    </p>
                    <p className="font-headline text-base font-bold text-on-surface">
                      {t("sharedShortCode")}
                    </p>
                  </div>
                </div>
              </div>
            }
          />
        </div>

        <div className="mb-16 overflow-hidden rounded-[2rem] border border-outline-variant/15 bg-white shadow-xl shadow-slate-950/5 md:mb-20">
          <div className="bg-gradient-to-r from-surface via-surface to-surface-container-low px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="font-headline text-[11px] font-bold uppercase tracking-[0.4em] text-primary">
                  {t("mapEyebrow")}
                </p>
                <h3 className="mt-2 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
                  {t("mapTitle")}
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-xs text-on-surface-variant">
                <Icon name="map" size="sm" />
                {branches.length} {t("title")}
              </div>
            </div>
          </div>
          <div className="p-3 md:p-5">
            <OsmBranchesMapDynamic
              layout="arch"
              branches={branchesForMap}
              openInOsmLabel={t("openInOsm")}
            />
          </div>
          <div className="border-t border-outline-variant/10 px-6 py-4 md:px-10">
            <p className="text-center text-[11px] text-on-surface-variant">
              {t("mapAttribution")}{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-primary/80"
              >
                OpenStreetMap
              </a>
            </p>
          </div>
        </div>

        <div
          id="branch-locations"
          className="grid grid-cols-1 gap-6 scroll-mt-24 md:grid-cols-2 md:gap-8"
        >
          {branches.map((branch, index) => {
            const coords = CONTACT_BRANCHES[index];
            return (
              <article
                key={branch.name}
                className="reveal-up group relative overflow-hidden rounded-[2rem] border border-outline-variant/15 bg-white shadow-lg shadow-slate-950/4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl md:p-10"
                style={{ animationDelay: `${140 + index * 120}ms` }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />
                <div className="absolute -right-8 top-0 h-40 w-40 rounded-full bg-primary/[0.04] blur-[40px] transition-all duration-700 group-hover:bg-primary/[0.07]" />

                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary shadow-lg shadow-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                    <Icon name="location_on" className="text-3xl" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/8 px-4 py-2 text-[10px] font-black tracking-[0.28em] text-primary uppercase">
                      {t("mapEyebrow")}
                    </span>
                    <span className="rounded-full bg-tertiary/10 px-4 py-2 text-[10px] font-black tracking-[0.28em] text-tertiary uppercase">
                      #{index + 1}
                    </span>
                  </div>
                </div>

                <h3 className="mb-6 font-headline text-2xl font-black tracking-tight text-on-surface md:text-3xl">
                  {branch.name}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-2xl bg-surface-container-low/60 p-4 transition-colors group-hover:bg-primary/[0.03]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name="pin_drop" size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black tracking-[0.22em] text-on-surface-variant uppercase">
                        {info("itemAddress")}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-5 text-on-surface">
                        {branch.address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low/60 p-4 transition-colors group-hover:bg-primary/[0.03]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon name="phone_in_talk" size="sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black tracking-[0.18em] text-on-surface-variant uppercase">
                          {info("itemLandline")}
                        </p>
                        <a
                          href={`tel:${branch.phone.replace(/-/g, "")}`}
                          className="mt-0.5 block truncate text-sm font-bold text-on-surface hover:text-primary"
                        >
                          {branch.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low/60 p-4 transition-colors group-hover:bg-primary/[0.03]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                        <Icon name="smartphone" size="sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black tracking-[0.18em] text-on-surface-variant uppercase">
                          {info("itemMobile")}
                        </p>
                        <a
                          href={`tel:${branch.mobile}`}
                          className="mt-0.5 block truncate text-sm font-bold text-on-surface hover:text-primary"
                        >
                          {branch.mobile}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low/60 p-4 transition-colors group-hover:bg-primary/[0.03]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Icon name="call" size="sm" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-[0.18em] text-on-surface-variant uppercase">
                        {info("itemShortCode")}
                      </p>
                      <p className="mt-0.5 font-headline text-lg font-black text-on-surface tracking-tight">
                        {branch.shortCode}
                      </p>
                    </div>
                  </div>

                  {coords ? (
                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary to-primary/85 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                      >
                        <Icon name="map" size="sm" />
                        {t("openInOsm")}
                      </a>
                      <a
                        href={`tel:${branch.mobile}`}
                        className="group/btn inline-flex items-center gap-2.5 rounded-2xl border border-outline-variant/25 bg-white px-5 py-3.5 text-xs font-bold text-on-surface shadow-lg shadow-slate-950/4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                      >
                        <Icon name="call" size="sm" />
                        {branch.mobile}
                      </a>
                      <a
                        href={`tel:${branch.phone.replace(/-/g, "")}`}
                        className="group/btn inline-flex items-center gap-2.5 rounded-2xl border border-outline-variant/25 bg-white px-5 py-3.5 text-xs font-bold text-on-surface shadow-lg shadow-slate-950/4 transition-all duration-300 hover:-translate-y-0.5 hover:border-tertiary/30 hover:text-tertiary"
                      >
                        <Icon name="phone_in_talk" size="sm" />
                        {branch.phone}
                      </a>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
