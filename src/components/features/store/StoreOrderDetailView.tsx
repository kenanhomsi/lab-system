"use client";

import {
  Alert,
  Anchor,
  Breadcrumbs,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Stepper,
  Table,
  Text,
} from "@mantine/core";
import { IconChevronRight, IconReceipt } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StoreOrderStatus } from "@/modules/store";
import { storeService } from "./store-service";
import { StoreLoadingState, StoreOrderStatusBadge, StorePageHeader } from "./ui";

const statusSteps: StoreOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Preparing",
  "OutForDelivery",
  "Delivered",
];

function getActiveStep(status: StoreOrderStatus): number {
  if (status === "Cancelled") return 0;
  const idx = statusSteps.indexOf(status);
  return idx >= 0 ? idx : 0;
}

type StoreOrderDetailViewProps = {
  orderId: number;
};

export function StoreOrderDetailView({ orderId }: StoreOrderDetailViewProps) {
  const t = useTranslations("labStore");
  const locale = useLocale();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["store", "my-order", orderId],
    queryFn: () => storeService.getMyOrder({ id: orderId }),
  });

  if (isLoading) return <StoreLoadingState variant="detail" />;
  if (isError || !data) return <Alert color="red" radius="lg">{t("loadError")}</Alert>;

  const activeStep = getActiveStep(data.status);
  const currency = t("currency");

  return (
    <Stack gap="xl">
      <Breadcrumbs separator={<IconChevronRight size={14} />}>
        <Anchor component={Link} href="/lab/store" size="sm" c="dimmed">
          {t("title")}
        </Anchor>
        <Anchor component={Link} href="/lab/store/orders" size="sm" c="dimmed">
          {t("myOrders")}
        </Anchor>
        <Text size="sm" fw={600}>
          #{data.orderNumber}
        </Text>
      </Breadcrumbs>

      <StorePageHeader
        badge={t("orderDetails")}
        title={`#${data.orderNumber}`}
        description={new Date(data.orderedAt).toLocaleString(locale)}
        icon={<IconReceipt size={26} />}
        actions={
          <Anchor component={Link} href="/lab/store/orders" size="sm" c="teal" fw={600}>
            {t("backToOrders")}
          </Anchor>
        }
      />

      <Paper withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600}>{t("orderStatus")}</Text>
            <StoreOrderStatusBadge status={data.status} size="md" />
          </Group>

          {data.status !== "Cancelled" ? (
            <>
              <Divider />
              <Text fw={600} size="sm" c="dimmed">
                {t("trackingTimeline")}
              </Text>
              <Stepper active={activeStep} color="teal" size="sm" iconSize={28}>
                {statusSteps.map((step) => (
                  <Stepper.Step key={step} label={t(statusLabelKey(step))} />
                ))}
              </Stepper>
            </>
          ) : null}
        </Stack>
      </Paper>

      <Paper withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Text fw={700} size="lg">
            {t("items")}
          </Text>
          <Table withTableBorder striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("product")}</Table.Th>
                <Table.Th>{t("quantity")}</Table.Th>
                <Table.Th>{t("unitPrice")}</Table.Th>
                <Table.Th>{t("total")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.items.map((item, idx) => (
                <Table.Tr key={`${item.productId}-${idx}`}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      {item.imageUrl || item.imageSnapshot ? (
                        <Image
                          src={item.imageUrl ?? item.imageSnapshot}
                          alt=""
                          w={40}
                          h={40}
                          radius="sm"
                          fit="cover"
                        />
                      ) : null}
                      <Text size="sm">
                        {item.productNameSnapshot ?? item.productNameEn ?? item.productNameAr}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>
                    {(item.effectiveUnitPrice ?? item.unitPrice ?? item.unitPriceSnapshot ?? 0).toLocaleString()}{" "}
                    {currency}
                  </Table.Td>
                  <Table.Td fw={600}>
                    {item.lineTotal.toLocaleString()} {currency}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>

          <Divider />

          <Stack gap="xs">
            <Group justify="space-between">
              <Text c="dimmed">{t("subtotal")}</Text>
              <Text>{data.subtotal.toLocaleString()} {currency}</Text>
            </Group>
            {data.discountAmount > 0 ? (
              <Group justify="space-between">
                <Text c="dimmed">{t("discount")}</Text>
                <Text c="teal">-{data.discountAmount.toLocaleString()} {currency}</Text>
              </Group>
            ) : null}
            <Group justify="space-between">
              <Text c="dimmed">{t("deliveryFee")}</Text>
              <Text>{data.deliveryFee.toLocaleString()} {currency}</Text>
            </Group>
            <Group justify="space-between">
              <Text fw={800} size="lg">{t("orderTotal")}</Text>
              <Text fw={800} size="lg" c="teal">
                {data.total.toLocaleString()} {currency}
              </Text>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

function statusLabelKey(
  status: StoreOrderStatus,
): "pending" | "confirmed" | "processing" | "shipped" | "delivered" {
  const map = {
    Pending: "pending",
    Confirmed: "confirmed",
    Preparing: "processing",
    OutForDelivery: "shipped",
    Delivered: "delivered",
  } as const;
  return map[status as keyof typeof map] ?? "pending";
}
