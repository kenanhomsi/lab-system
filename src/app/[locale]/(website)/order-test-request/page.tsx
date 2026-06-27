import { redirect } from "next/navigation";

type OrderTestRequestPageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Legacy route that now sends patients back to their profile requests tab.
 */
export default async function OrderTestRequestPage({
  params,
}: OrderTestRequestPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/profile?tab=testRequests`);
}
