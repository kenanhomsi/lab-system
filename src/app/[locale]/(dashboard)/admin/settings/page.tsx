import { Suspense } from "react";
import { AdminSettingsUI } from "./ui";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminSettingsUI />
    </Suspense>
  );
}
