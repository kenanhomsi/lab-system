import { getTranslations } from "next-intl/server";
import { OsmBranchesMapDynamic } from "@/components/maps/osm-branches-map-dynamic";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import { CONTACT_BRANCHES, type ContactBranch } from "@/lib/contact-branches";

export async function BranchesSection() {
  const t = await getTranslations("contactPage.branches");

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
    <section className="bg-surface-container-low py-16 md:py-24">
      <div className="mx-auto max-w-screen-2xl px-6 md:px-8">
        <div className="reveal-up" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            title={t("title")}
            description={t("description")}
            align="center"
          />
        </div>

        <div className="mb-14 md:mb-20">
          <div className="mx-auto mb-4 max-w-4xl px-4 text-center sm:px-6">
            <p className="font-headline text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              {t("mapEyebrow")}
            </p>
            <h3 className="mt-3 font-headline text-2xl font-bold tracking-tight text-slate-900 dark:text-on-surface md:text-3xl">
              {t("mapTitle")}
            </h3>
          </div>
          <OsmBranchesMapDynamic
            layout="arch"
            branches={branchesForMap}
            openInOsmLabel={t("openInOsm")}
          />
          <p className="mx-auto mt-4 max-w-2xl px-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            {t("mapAttribution")}{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              OpenStreetMap
            </a>
          </p>
        </div>

        <div
          id="branch-locations"
          className="grid grid-cols-1 gap-8 scroll-mt-24 md:grid-cols-2"
        >
          {branches.map((branch, index) => {
            const coords = CONTACT_BRANCHES[index];
            return (
              <div
                key={branch.name}
                className="reveal-up group rounded-2xl bg-surface-container-lowest p-8 shadow-sm transition-all duration-500 hover:shadow-xl md:p-10"
                style={{ animationDelay: `${160 + index * 120}ms` }}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon name="location_on" className="text-2xl text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{branch.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-on-surface-variant">
                    <Icon name="pin_drop" className="mt-0.5 shrink-0" size="sm" />
                    <span className="text-sm">{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Icon name="phone_in_talk" className="shrink-0" size="sm" />
                    <a
                      href={`tel:${branch.phone.replace(/-/g, "")}`}
                      className="text-sm hover:text-primary"
                    >
                      {branch.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Icon name="smartphone" className="shrink-0" size="sm" />
                    <a
                      href={`tel:${branch.mobile}`}
                      className="text-sm hover:text-primary"
                    >
                      {branch.mobile}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <Icon name="call" className="shrink-0" size="sm" />
                    <span className="text-sm">
                      {t("shortCodeLabel")} {branch.shortCode}
                    </span>
                  </div>
                  {coords ? (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=17/${coords.lat}/${coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      <Icon name="map" size="sm" />
                      {t("openInOsm")}
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
