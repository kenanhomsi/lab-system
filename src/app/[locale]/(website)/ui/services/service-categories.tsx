import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { SectionHeader } from "@/components/ui/section-header";
import Image from "next/image";
import { cn } from "@/lib/utils";

function ListItem({ children, index }: { children: React.ReactNode; index?: number }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl bg-surface-container-low px-4 py-4 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-outline-variant/15 transition-all duration-300 hover:bg-surface hover:text-on-surface">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/15">
        <Icon name="check" filled className="text-sm!" size="sm" />
      </div>
      <div className="flex min-w-0 items-start gap-3">
        {index !== undefined && (
          <span className="pt-0.5 text-[11px] font-black tracking-[0.2em] text-primary/60">
            {index}
          </span>
        )}
        <span className="text-sm leading-7">{children}</span>
      </div>
    </li>
  );
}

function DetailBlock({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex flex-col gap-2 rounded-2xl bg-surface-container-low px-5 py-4 text-on-surface-variant shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-outline-variant/15 transition-all duration-300 hover:bg-surface hover:text-on-surface">
      <div className="flex items-center gap-2 text-primary">
        <Icon name="info" filled className="text-lg!" />
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm leading-7">{desc}</p>
    </li>
  );
}

export async function ServiceCategories() {
  const t = await getTranslations("servicesPage.detailedCategories");

  const patient = t.raw("patient");
  const doctor = t.raw("doctor");
  const lab = t.raw("lab");
  const company = t.raw("company");

  const sections = [
    {
      id: "patient",
      title: patient.title,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
              <Icon name="personal_injury" className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-on-surface md:text-[2rem]">
              {patient.title}
            </h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            {patient.desc}
          </p>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-4">{patient.labTitle}</h4>
            <ul className="grid gap-3">
              {patient.labItems.map((item: string, i: number) => (
                <ListItem key={i} index={i + 1}>{item}</ListItem>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-2">{patient.elecTitle}</h4>
            <p className="text-on-surface-variant mb-4 leading-relaxed">{patient.elecDesc}</p>
            <ul className="grid gap-3">
              {patient.elecItems.map((item: string, i: number) => (
                <ListItem key={i} index={i + 1}>{item}</ListItem>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "doctor",
      title: doctor.title,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
              <Icon name="stethoscope" className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-on-surface md:text-[2rem]">
              {doctor.title}
            </h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            {doctor.desc1}
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            {doctor.desc2}
          </p>
          <ul className="grid gap-3 mb-4">
            {doctor.axes.map((item: string, i: number) => (
              <ListItem key={i} index={i + 1}>{item}</ListItem>
            ))}
          </ul>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-4">{doctor.whyTitle}</h4>
            <ul className="grid gap-4 md:grid-cols-2">
              {doctor.whyItems.map((item: { title: string; desc: string }, i: number) => (
                <DetailBlock key={i} title={item.title} desc={item.desc} />
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "lab",
      title: lab.title,
      image: "https://images.unsplash.com/photo-1532187863486-abf9db0c2858?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
              <Icon name="science" className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-on-surface md:text-[2rem]">
              {lab.title}
            </h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            {lab.desc}
          </p>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-4">{lab.servicesTitle}</h4>
            <ul className="grid gap-3">
              {lab.servicesItems.map((item: string, i: number) => (
                <ListItem key={i} index={i + 1}>{item}</ListItem>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-4">{lab.elecTitle}</h4>
            <ul className="grid gap-4 md:grid-cols-2">
              {lab.elecItems.map((item: { title: string; desc: string }, i: number) => (
                <DetailBlock key={i} title={item.title} desc={item.desc} />
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      title: company.title,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
              <Icon name="business" className="text-3xl" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-on-surface md:text-[2rem]">
              {company.title}
            </h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            {company.desc1}
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            {company.desc2}
          </p>

          <div className="mt-4">
            <ul className="grid gap-4 md:grid-cols-2 mb-8">
              {company.blocks.map((item: { title: string; desc: string }, i: number) => (
                <DetailBlock key={i} title={item.title} desc={item.desc} />
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-bold text-on-surface mb-2">{company.elecTitle}</h4>
            <p className="text-on-surface-variant mb-4 leading-relaxed">{company.elecDesc}</p>
            <ul className="grid gap-3">
              {company.elecItems.map((item: string, i: number) => (
                <ListItem key={i} index={i + 1}>{item}</ListItem>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative overflow-hidden bg-surface-container-low py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-orb h-52 w-52 bg-primary/8 inset-s-[6%] top-[12%]" />
        <div className="bg-orb bg-orb-reverse h-64 w-64 bg-tertiary-fixed/8 inset-e-[7%] bottom-[10%]" />
      </div>

      <div className="relative content-container">
        <div className="reveal-up mb-12" style={{ animationDelay: "80ms" }}>
          <SectionHeader
            title={t("sectionTitle")}
            description={t("sectionDesc")}
            align="center"
            className="mx-auto max-w-3xl"
          />
        </div>

        <div className="mt-16 flex flex-col gap-20 xl:gap-28">
          {sections.map((section, index) => {
            const isReversed = index % 2 !== 0;
            return (
              <div
                key={section.id}
                className={cn(
                  "flex flex-col gap-8 lg:gap-12 reveal-up",
                  isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
                style={{ animationDelay: `${160 + index * 100}ms` }}
              >
                {/* Image Side */}
                <div className="w-full lg:w-5/12 shrink-0">
                  <div className="sticky top-24 aspect-[4/3] w-full overflow-hidden rounded-3xl ring-1 ring-outline-variant/20 shadow-lg md:aspect-auto md:h-[600px]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-7/12 py-4">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
