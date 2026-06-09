import { TestRequestsTable } from "@/components/tables/test-requests-table";
import { guardByRole } from "@/lib/auth/role-guard";
import { getTranslations } from "next-intl/server";

type OrderTestRequestPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Patient-facing website page for ordering and tracking lab test requests.
 */
export default async function OrderTestRequestPage({
  params,
}: OrderTestRequestPageProps) {
  const { locale } = await params;
  await guardByRole({ locale, allowedRoles: ["patient"] });
  const t = await getTranslations("patientWebsite.orderTestRequest");

  return (
    <main className="content-container py-10 md:py-14">
      <section className="mb-8 max-w-3xl">
        <p className="mb-2 font-headline text-sm font-bold uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-headline text-3xl font-black tracking-normal text-secondary md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base leading-7 text-on-surface-variant">
          {t("description")}
        </p>
      </section>
      <TestRequestsTable initialActiveModal="create" />
    </main>
  );
}
