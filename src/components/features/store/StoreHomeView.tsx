"use client";

import { Alert, Anchor, Card, Grid, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconBuildingStore, IconSparkles } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { storeService } from "./store-service";
import {
  StoreCategoryCard,
  StoreLoadingState,
  StoreNavActions,
  StorePageHeader,
  StoreProductCard,
} from "./ui";
import { useStoreCart } from "./use-store-cart";

export function StoreHomeView() {
  const t = useTranslations("labStore");
  const addProduct = useStoreCart((s) => s.addProduct);
  const cartCount = useStoreCart((s) => s.items.length);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store", "home"],
    queryFn: () => storeService.getHome(),
  });

  if (isLoading) {
    return <StoreLoadingState variant="home" />;
  }

  if (isError || !data) {
    return <Alert color="red" radius="lg">{t("loadError")}</Alert>;
  }

  return (
    <Stack gap="xl">
      <StorePageHeader
        badge={t("storeBadge")}
        title={t("title")}
        description={data.settings.announcementHeader || t("storeDesc")}
        icon={<IconBuildingStore size={26} />}
        actions={<StoreNavActions cartCount={cartCount} />}
      />

      {data.banners.length > 0 ? (
        <Grid >
          {data.banners.map((banner) => (
            <Grid.Col key={banner.id} span={{ base: 12, md: 6 }}>
              <Paper
                withBorder
                radius="lg"
                p="md"
                style={{
                  background:
                    "linear-gradient(90deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-white) 100%)",
                }}
              >
                <Group wrap="nowrap" align="center">
                  <Image src={banner.imageUrl} alt={banner.title} w={140} h={90} radius="md" fit="cover" />
                  <Stack gap={4} flex={1}>
                    <Text fw={700} size="lg">
                      {banner.title}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {banner.location}
                    </Text>
                    {banner.linkUrl ? (
                      <Anchor component={Link} href={banner.linkUrl} size="sm" c="teal">
                        {t("browseStore")}
                      </Anchor>
                    ) : null}
                  </Stack>
                </Group>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      ) : null}

      <Stack gap="md">
        <Group gap="xs">
          <IconSparkles size={20} color="var(--mantine-color-teal-6)" />
          <Title order={3} fw={700}>
            {t("shopByCategory")}
          </Title>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {data.categories.map((category) => (
            <StoreCategoryCard key={category.id} category={category} />
          ))}
        </SimpleGrid>
      </Stack>

      {data.sliders.map((slider) => (
        <Stack key={slider.id} gap="md">
          <Group justify="space-between" align="flex-end">
            <div>
              <Title order={3} fw={700}>
                {slider.title}
              </Title>
              <Text size="sm" c="dimmed">
                {t("featuredProducts")}
              </Text>
            </div>
          </Group>
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="md">
            {slider.products.map((product) => (
              <StoreProductCard key={product.id} product={product} onAddToCart={addProduct} />
            ))}
          </SimpleGrid>
        </Stack>
      ))}

      {data.categories.length === 0 && data.sliders.length === 0 ? (
        <Card withBorder radius="lg" p="xl" ta="center">
          <Text c="dimmed">{t("emptyStore")}</Text>
        </Card>
      ) : null}
    </Stack>
  );
}
