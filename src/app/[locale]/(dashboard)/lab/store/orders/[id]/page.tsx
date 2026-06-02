import { StoreOrderDetailView } from "@/components/features/store";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <StoreOrderDetailView orderId={Number(id)} />;
}
