"use client";

import { Alert, Anchor, Badge, Breadcrumbs, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconCategory, IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { storeService } from "./store-service";
import { StoreLoadingState, StorePageHeader, StoreProductCard } from "./ui";
import { useStoreCart } from "./use-store-cart";

type StoreCategoryViewProps = {
  categoryId: number;
};

export function StoreCategoryView({ categoryId }: StoreCategoryViewProps) {
  const t = useTranslations("labStore");
  const locale = useLocale();
  const addProduct = useStoreCart((s) => s.addProduct);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store", "category-page", categoryId],
    queryFn: () => storeService.getCategoryPage({ id: categoryId }),
  });

  if (isLoading) return <StoreLoadingState variant="grid" />;
  if (isError || !data) return <Alert color="red" radius="lg">{t("loadError")}</Alert>;

  const categoryName = locale === "ar" ? data.category.nameAr : data.category.nameEn;

  return (
    <Stack gap="xl">
      <Breadcrumbs separator={<IconChevronRight size={14} />}>
        <Anchor component={Link} href="/lab/store" size="sm" c="dimmed">
          {t("title")}
        </Anchor>
        <Text size="sm" fw={600}>
          {categoryName}
        </Text>
      </Breadcrumbs>

      <StorePageHeader
        badge={t("categories")}
        title={categoryName}
        description={data.category.description}
        icon={<IconCategory size={26} />}
        actions={
          <Anchor component={Link} href="/lab/store" size="sm" c="teal" fw={600}>
            {t("backToStore")}
          </Anchor>
        }
      />

      {data.subcategories.length > 0 ? (
        <Group gap="xs">
          {data.subcategories.map((subcategory) => (
            <Badge key={subcategory.id} variant="light" color="teal" size="lg" radius="md">
              {locale === "ar" ? subcategory.nameAr : subcategory.nameEn}
            </Badge>
          ))}
        </Group>
      ) : null}

      {data.products.length === 0 ? (
        <Alert color="gray" variant="light" radius="lg">
          {t("noProductsInCategory")}
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing="md">
          {data.products.map((product) => (
            <StoreProductCard key={product.id} product={product} onAddToCart={addProduct} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
