import { notFound } from "next/navigation";
import { getServiceById, serviceIds } from "../../ui/services/service-catalog";
import { ServiceDetailView } from "../../ui/services/service-detail-view";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return serviceIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, id } = await params;
  const service = await getServiceById(locale, id);

  if (!service) {
    return {};
  }

  return {
    title: `${service.title} | Al Mutawali Lab`,
    description: service.summary,
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { locale, id } = await params;
  const service = await getServiceById(locale, id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
