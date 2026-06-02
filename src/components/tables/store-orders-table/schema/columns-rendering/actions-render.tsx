"use client";

import { Button, Group, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { StoreOrder, StoreOrderStatus } from "@/modules/store";
import { storeOrderStatusSchema } from "@/modules/store/abstraction/schemas";
import { useMirror } from "../../store";

const ORDER_STATUSES = storeOrderStatusSchema.options;

type Props = {
  row: StoreOrder;
};

const statusLabelKey = (value: StoreOrderStatus) =>
  value === "Pending"
    ? "pending"
    : value === "Confirmed"
      ? "confirmed"
      : value === "Preparing"
        ? "processing"
        : value === "OutForDelivery"
          ? "shipped"
          : value === "Delivered"
            ? "delivered"
            : "cancelled";

const OrderStatusActions = ({ row }: Props) => {
  const t = useTranslations("labStore.admin");
  const tl = useTranslations("labStore");
  const updateStatusMutation = useMirror("updateStatusMutation");
  const [status, setStatus] = useState<StoreOrderStatus>(row.status);

  const statusOptions = useMemo(
    () =>
      ORDER_STATUSES.map((value) => ({
        value,
        label: tl(statusLabelKey(value)),
      })),
    [tl],
  );

  const hasChanges = status !== row.status;

  const onSave = async () => {
    await updateStatusMutation.mutateAsync({ id: row.id, status });
    notifications.show({ title: t("saved"), message: t("orderUpdated"), color: "green" });
  };

  return (
    <Group gap="xs" wrap="nowrap">
      <Select
        size="xs"
        data={statusOptions}
        value={status}
        onChange={(v) => setStatus((v as StoreOrderStatus) ?? row.status)}
        style={{ minWidth: 140 }}
      />
      <Button
        size="xs"
        color="teal"
        variant="light"
        disabled={!hasChanges}
        loading={updateStatusMutation.isPending}
        onClick={() => void onSave()}
      >
        {t("save")}
      </Button>
    </Group>
  );
};

const ActionsRender = ({ row }: Props) => (
  <OrderStatusActions key={`${row.id}-${row.status}`} row={row} />
);

export { ActionsRender };
