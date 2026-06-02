"use client";

import { Alert, Button, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconClipboardList, IconPackageOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { storeService } from "./store-service";
import { StoreEmptyState, StoreLoadingState, StoreOrderStatusBadge, StorePageHeader } from "./ui";

export function StoreMyOrdersView() {
  const t = useTranslations("labStore");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["store", "my-orders"],
    queryFn: () => storeService.listMyOrders({ query: { page: 1, pageSize: 20 } }),
  });

  if (isLoading) return <StoreLoadingState variant="table" />;
  if (isError || !data) return <Alert color="red" radius="lg">{t("loadError")}</Alert>;

  return (
    <Stack gap="xl">
      <StorePageHeader
        badge={t("myOrdersBadge")}
        title={t("myOrders")}
        description={t("myOrdersDesc")}
        icon={<IconClipboardList size={26} />}
        actions={
          <Button component={Link} href="/lab/store" variant="light" color="teal">
            {t("continueShopping")}
          </Button>
        }
      />

      {data.items.length === 0 ? (
        <StoreEmptyState
          icon={<IconPackageOff size={36} />}
          title={t("noOrders")}
          description={t("myOrdersDesc")}
          actionLabel={t("browseStore")}
          actionHref="/lab/store"
        />
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {data.items.map((item) => (
            <Paper key={item.id} withBorder radius="lg" p="lg">
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Text fw={800} size="lg">
                      #{item.orderNumber}
                    </Text>
                    <Text size="sm" c="dimmed" mt={4}>
                      {new Date(item.orderedAt).toLocaleString()}
                    </Text>
                  </div>
                  <StoreOrderStatusBadge status={item.status} size="md" />
                </Group>

                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {t("orderTotal")}
                  </Text>
                  <Text fw={700} c="teal">
                    {item.total.toLocaleString()} {t("currency")}
                  </Text>
                </Group>

                <Button
                  component={Link}
                  href={`/lab/store/orders/${item.id}`}
                  variant="light"
                  color="teal"
                  fullWidth
                >
                  {t("viewDetails")}
                </Button>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
