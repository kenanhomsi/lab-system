"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { Button } from "@/components/ui/button";
import { axiosInstanceFront } from "@/lib/clients/frontend-instance";

type PurchasePlanButtonProps = {
  packageId: number;
  recommended?: boolean;
};

export function PurchasePlanButton({ packageId, recommended }: PurchasePlanButtonProps) {
  const t = useTranslations("subscriptions");
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const purchase = async () => {
    setLoading(true);
    try {
      await axiosInstanceFront.post("/subscriptions/purchase", { packageId });
      notifications.show({ color: "teal", message: t("purchaseSuccess") });
      router.refresh();
    } catch (error: unknown) {
      const status =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 401) {
        router.push(`/${locale}/login?callbackUrl=/${locale}/plans`);
        return;
      }
      notifications.show({ color: "red", message: t("purchaseError") });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={recommended ? "primary" : "secondary"}
      className="w-full"
      disabled={loading}
      onClick={purchase}
    >
      {loading ? t("processing") : t("selectPlan")}
    </Button>
  );
}
