import { Suspense } from "react";
import { ClientJoinRequestsTable } from "@/components/tables/client-join-requests-table";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ClientJoinRequestsTable />
    </Suspense>
  );
}
