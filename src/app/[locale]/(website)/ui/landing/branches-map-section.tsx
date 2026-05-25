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
      className="relative overflow-hidden bg-white py-16 md:py-24 lg:py-28 dark:bg-surface"
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10">
        <div className="h-[40rem] w-[40rem] rounded-full bg-primary blur-[100px]" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center md:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-headline text-xs font-bold uppercase tracking-widest text-primary dark:bg-primary/20 dark:text-primary-fixed">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          {tl("eyebrow")}
        </span>

        <h2 className="mt-6 max-w-xl font-headline text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-5xl lg:text-[3.25rem]">
          {tl("title")}
        </h2>

        <p className="mt-5 max-w-md text-base leading-relaxed text-on-surface-variant md:text-lg">
          {tl("subtitle")}
        </p>

        <Link
          href="/contact#branch-locations"
          className="clinical-gradient mt-10 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-headline text-sm font-bold uppercase tracking-wider text-on-primary shadow-lg shadow-primary/25 transition-all hover:-translate-y-1 hover:opacity-95 hover:shadow-primary/40 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">explore</span>
          {tl("cta")}
        </Link>
      </div>

      <div className="relative mx-auto mt-16 max-w-7xl md:mt-24">
        <div className="absolute -inset-4 z-0 rounded-[clamp(5rem,32vw,18rem)] bg-gradient-to-b from-primary/5 to-transparent opacity-50 blur-2xl"></div>
        <OsmBranchesMapDynamic
          layout="arch"
          branches={branches}
          openInOsmLabel={tl("openInOsm")}
        />
        <p className="mx-auto mt-6 max-w-2xl px-6 text-center text-xs leading-relaxed text-on-surface-variant">
          {tl("attributionLine")}{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline hover:underline-offset-2"
          >
            OpenStreetMap
          </a>
        </p>
      </div>
    </section>
  );
}
