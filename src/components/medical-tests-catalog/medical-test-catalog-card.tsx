"use client";

import type { MedicalTestItem } from "./types";
import { Badge, Group, Paper, Stack, Text, UnstyledButton } from "@mantine/core";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  item: MedicalTestItem;
  onClick: (item: MedicalTestItem) => void;
};

const MedicalTestCatalogCard = ({ item, onClick }: Props) => {
  const t = useTranslations("admin.medicalTestsCatalog");
  const locale = useLocale();

  const localizedName = locale === "ar" ? item.nameAr || item.nameEn : item.nameEn || item.nameAr;
  const localizedCategory =
    locale === "ar"
      ? item.categoryNameAr || item.categoryNameEn || item.category
      : item.categoryNameEn || item.categoryNameAr || item.category;
  const isActive = item.status.trim().toLowerCase() === "active";

  return (
    <UnstyledButton onClick={() => onClick(item)} style={{ width: "100%", textAlign: "start" }}>
      <Paper
        withBorder
        radius="lg"
        p="md"
        h="100%"
        style={{
          background: "light-dark(rgba(255,255,255,0.82), rgba(255,255,255,0.03))",
          borderColor: "light-dark(rgba(15,23,42,0.1), rgba(255,255,255,0.1))",
          transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
        }}
      >
        <Stack gap="sm">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Text fw={700} size="sm" lineClamp={2}>
              {localizedName || "—"}
            </Text>
            <Badge color={isActive ? "teal" : "gray"} variant="light" radius="sm" size="sm">
              {isActive ? t("statusActive") : t("statusInactive")}
            </Badge>
          </Group>

          <Group gap={8} wrap="wrap">
            <Badge variant="light" color="blue">
              {localizedCategory || t("unknownValue")}
            </Badge>
            <Badge variant="light" color="violet">
              {item.sampleType || t("unknownValue")}
            </Badge>
          </Group>

          <Text c="dimmed" size="sm">
            {t("priceLabel")}: {item.price}
          </Text>
        </Stack>
      </Paper>
    </UnstyledButton>
  );
};

export { MedicalTestCatalogCard };
