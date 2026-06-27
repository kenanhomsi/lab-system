"use client";

import { CreateTestRequestModal } from "@/components/modals/test-requests";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type OrderTestRequestButtonProps = {
  className: string;
  label: string;
  locale: string;
  testId: number;
};

/** Opens the patient test-request modal in place or sends guests through login first. */
export function OrderTestRequestButton({
  className,
  label,
  locale,
  testId,
}: OrderTestRequestButtonProps) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [manualOpen, setManualOpen] = useState(false);

  const isPatient = useMemo(() => {
    const roles = session?.user?.roles ?? [];
    return roles.some((role) => role.toLowerCase().includes("patient"));
  }, [session?.user?.roles]);

  const autoOpen = searchParams.get("openOrder") === "1" && status === "authenticated" && isPatient;

  useEffect(() => {
    if (searchParams.get("openOrder") === "1" && status === "authenticated" && !isPatient) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isPatient, searchParams, status]);

  const handleClick = () => {
    if (status === "authenticated" && isPatient) {
      setManualOpen(true);
      return;
    }

    if (status === "authenticated") {
      window.location.href = `/${locale}/profile?tab=testRequests`;
      return;
    }

    const callbackUrl = `/${locale}/tests/${testId}?openOrder=1`;
    window.location.href = `/${locale}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  const handleClose = () => {
    if (searchParams.get("openOrder") === "1") {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setManualOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={status === "loading"}
      >
        {label}
      </button>
      <CreateTestRequestModal
        opened={manualOpen || autoOpen}
        onClose={handleClose}
        initialMedicalTestIds={[testId]}
      />
    </>
  );
}
