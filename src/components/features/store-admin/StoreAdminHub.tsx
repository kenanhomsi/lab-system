"use client";

import {
  Alert,
  Badge,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBuildingStore,
  IconCategory,
  IconDiscount,
  IconLayoutBoard,
  IconPackage,
  IconSettings,
  IconShoppingCart,
  IconSlideshow,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { storeService } from "@/components/features/store";
import { StoreBannersTable } from "@/components/tables/store-banners-table";
import { StoreCategoriesTable } from "@/components/tables/store-categories-table";
import { StoreCouponsTable } from "@/components/tables/store-coupons-table";
import { StoreOrdersTable } from "@/components/tables/store-orders-table";
import { StoreProductsTable } from "@/components/tables/store-products-table";
import { StoreSlidersTable } from "@/components/tables/store-sliders-table";
import { StoreSettingsForm } from "./StoreSettingsForm";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number | string;
  color: string;
};

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Paper withBorder radius="lg" p="md">
      <Group>
        <ThemeIcon size={44} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {label}
          </Text>
          <Text fw={800} size="xl">
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

/**
 * Admin hub for lab store: stats overview and tabbed management tables.
 */
export function StoreAdminHub() {
  const t = useTranslations("labStore");
  const ta = useTranslations("labStore.admin");

  const categories = useQuery({
    queryKey: ["store", "admin", "categories"],
    queryFn: () => storeService.listCategories(),
  });
  const products = useQuery({
    queryKey: ["store", "admin", "products"],
    queryFn: () => storeService.listProducts({ query: { page: 1, pageSize: 1 } }),
  });
  const orders = useQuery({
    queryKey: ["store", "admin", "orders"],
    queryFn: () => storeService.listOrders({ query: { page: 1, pageSize: 1 } }),
  });
  const coupons = useQuery({
    queryKey: ["store", "admin", "coupons"],
    queryFn: () => storeService.listCoupons(),
  });

  const isLoading =
    categories.isLoading || products.isLoading || orders.isLoading || coupons.isLoading;

  if (categories.isError || products.isError || orders.isError || coupons.isError) {
    return <Alert color="red" radius="lg">{t("loadError")}</Alert>;
  }

  return (
    <Stack gap="xl">
      <Paper
        radius="lg"
        withBorder
        p={{ base: "md", sm: "lg" }}
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-white) 55%, var(--mantine-color-gray-0) 100%)",
        }}
      >
        <Group align="flex-start" wrap="nowrap">
          <ThemeIcon size={48} radius="md" variant="light" color="teal">
            <IconBuildingStore size={26} />
          </ThemeIcon>
          <div>
            <Badge color="teal" variant="light" mb={6}>
              {ta("badge")}
            </Badge>
            <Title order={2} fw={800}>
              {ta("title")}
            </Title>
            <Text c="dimmed" size="sm" mt={4}>
              {ta("description")}
            </Text>
          </div>
        </Group>
      </Paper>

      {isLoading ? (
        <SimpleGrid cols={{ base: 2, md: 4, xl: 6 }} spacing="md">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={80} radius="lg" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 2, md: 4, xl: 6 }} spacing="md">
          <StatCard
            icon={<IconCategory size={22} />}
            label={ta("categories")}
            value={categories.data?.length ?? 0}
            color="teal"
          />
          <StatCard
            icon={<IconPackage size={22} />}
            label={ta("products")}
            value={products.data?.totalCount ?? 0}
            color="blue"
          />
          <StatCard
            icon={<IconShoppingCart size={22} />}
            label={ta("orders")}
            value={orders.data?.totalCount ?? 0}
            color="violet"
          />
          <StatCard
            icon={<IconDiscount size={22} />}
            label={ta("coupons")}
            value={coupons.data?.length ?? 0}
            color="orange"
          />
        </SimpleGrid>
      )}

      <Tabs defaultValue="settings" variant="pills" radius="md" color="teal" keepMounted={false}>
        <Tabs.List mb="md" style={{ flexWrap: "wrap", gap: 8 }}>

          <Tabs.Tab value="categories" leftSection={<IconCategory size={16} />}>
            {ta("categories")}
          </Tabs.Tab>
          <Tabs.Tab value="products" leftSection={<IconPackage size={16} />}>
            {ta("products")}
          </Tabs.Tab>
          <Tabs.Tab value="banners" leftSection={<IconLayoutBoard size={16} />}>
            {ta("banners")}
          </Tabs.Tab>
          <Tabs.Tab value="sliders" leftSection={<IconSlideshow size={16} />}>
            {ta("sliders")}
          </Tabs.Tab>
          <Tabs.Tab value="coupons" leftSection={<IconDiscount size={16} />}>
            {ta("coupons")}
          </Tabs.Tab>
          <Tabs.Tab value="orders" leftSection={<IconShoppingCart size={16} />}>
            {ta("orders")}
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
            {ta("settings")}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="settings" pt="xs">
          <StoreSettingsForm />
        </Tabs.Panel>
        <Tabs.Panel value="categories" pt="xs">
          <StoreCategoriesTable />
        </Tabs.Panel>
        <Tabs.Panel value="products" pt="xs">
          <StoreProductsTable />
        </Tabs.Panel>
        <Tabs.Panel value="banners" pt="xs">
          <StoreBannersTable />
        </Tabs.Panel>
        <Tabs.Panel value="sliders" pt="xs">
          <StoreSlidersTable />
        </Tabs.Panel>
        <Tabs.Panel value="coupons" pt="xs">
          <StoreCouponsTable />
        </Tabs.Panel>
        <Tabs.Panel value="orders" pt="xs">
          <StoreOrdersTable />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
