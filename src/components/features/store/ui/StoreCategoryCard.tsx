"use client";

import { Badge, Card, Group, Image, Stack, Text } from "@mantine/core";
import { IconArrowRight, IconCategory } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { StoreCategory } from "@/modules/store";

type StoreCategoryCardProps = {
  category: StoreCategory;
};

/**
 * Clickable category card with image fallback icon.
 */
export function StoreCategoryCard({ category }: StoreCategoryCardProps) {
  const t = useTranslations("labStore");
  const locale = useLocale();
  const name = locale === "ar" ? category.nameAr : category.nameEn;

  return (
    <Card
      component={Link}
      href={`/lab/store/category/${category.id}`}
      withBorder
      radius="lg"
      padding="lg"
      style={{
        cursor: "pointer",
        transition: "transform 150ms ease, box-shadow 150ms ease",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "var(--mantine-shadow-md)",
          },
        },
      }}
    >
      <Stack gap="sm">
        {category.imageUrl ? (
          <Image src={category.imageUrl} alt={name} h={100} radius="md" fit="cover" />
        ) : (
          <Card withBorder radius="md" p="md" bg="teal.0">
            <Group justify="center">
              <IconCategory size={36} color="var(--mantine-color-teal-6)" />
            </Group>
          </Card>
        )}
        <div>
          <Text fw={700} lineClamp={1}>
            {name}
          </Text>
          {category.description ? (
            <Text c="dimmed" size="sm" lineClamp={2} mt={4}>
              {category.description}
            </Text>
          ) : null}
        </div>
        <Group justify="space-between" mt="auto">
          <Badge variant="light" color="teal" size="sm">
            {t("categories")}
          </Badge>
          <IconArrowRight size={18} color="var(--mantine-color-teal-6)" />
        </Group>
      </Stack>
    </Card>
  );
}
