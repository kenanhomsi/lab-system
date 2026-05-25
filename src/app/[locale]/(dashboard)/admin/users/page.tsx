import { Suspense } from "react";
import { UsersTable } from "@/components/tables/users-table";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <UsersTable />
    </Suspense>
  );
}
