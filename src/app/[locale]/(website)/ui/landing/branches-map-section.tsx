import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OsmBranchesMapDynamic } from "@/components/maps/osm-branches-map-dynamic";
import { CONTACT_BRANCHES, type ContactBranch } from "@/lib/contact-branches";

export async function BranchesMapSection() {
  const tl = await getTranslations("landing.branchesMap");
  const tb = await getTranslations("contactPage.branches");

  const branches: ContactBranch[] = CONTACT_BRANCHES.map((c, i) => ({
    ...c,
    name: i === 0 ? tb("branch1Name") : tb("branch2Name"),
    address: i === 0 ? tb("branch1Address") : tb("branch2Address"),
    phone: tb("sharedLandline"),
    mobile: tb("sharedMobile"),
    shortCode: tb("sharedShortCode"),
  }));

  return (
    <section
      id="labs-map"
      className="bg-white py-16 md:py-24 lg:py-28 dark:bg-surface"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center md:px-8">
        <p className="font-headline text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          {tl("eyebrow")}
        </p>
        <h2 className="mt-5 max-w-xl font-headline text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-on-surface md:text-5xl lg:text-[3.25rem]">
          {tl("title")}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600 dark:text-on-surface-variant">
          {tl("subtitle")}
        </p>
        <Link
          href="/contact#branch-locations"
          className="labs-map-cta mt-10 inline-flex items-center justify-center rounded-full px-10 py-3.5 font-headline text-[11px] font-bold uppercase tracking-[0.22em] text-white shadow-md transition hover:opacity-92 active:scale-[0.98]"
        >
          {tl("cta")}
        </Link>
      </div>

      <div className="mx-auto mt-14 max-w-7xl md:mt-20">
        <OsmBranchesMapDynamic
          layout="arch"
          branches={branches}
          openInOsmLabel={tl("openInOsm")}
        />
        <p className="mx-auto mt-4 max-w-2xl px-6 text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {tl("attributionLine")}{" "}
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
    </section>
  );
}
