import { Suspense } from "react";
import { ContractServiceRequestsTable } from "@/components/tables/contract-service-requests-table";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ContractServiceRequestsTable />
    </Suspense>
  );
}
