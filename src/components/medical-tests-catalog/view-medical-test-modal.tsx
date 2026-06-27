"use client";

import type { MedicalTestItem } from "./types";
import { Code, Group, Modal, ScrollArea, Stack, Table, Text } from "@mantine/core";
import { IconListDetails } from "@tabler/icons-react";
import { parseParameterSchema } from "@/modules/medical-tests/abstraction";
import { useLocale, useTranslations } from "next-intl";

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value || "—";
  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toPreviewJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value ?? "");
  }
}

type Props = {
  opened: boolean;
  onClose: () => void;
  test: MedicalTestItem | null;
};

const ViewMedicalTestModal = ({ opened, onClose, test }: Props) => {
  const t = useTranslations("admin.medicalTestsCatalog");
  const locale = useLocale();
  if (!test) return null;

  const schema = parseParameterSchema(test.parameterSchema);
  const schemaEntries = Array.isArray(schema) ? schema.map((s) => [s.key, s.value]) : Object.entries(schema);
  const statusActive = test.status.trim().toLowerCase() === "active";
  const localizedCategory =
    locale === "ar"
      ? test.categoryNameAr || test.categoryNameEn || test.category
      : test.categoryNameEn || test.categoryNameAr || test.category;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      title={
        <Group gap="sm">
          <IconListDetails size={20} />
          <Text fw={600}>{t("detailsTitle")}</Text>
        </Group>
      }
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("nameArLabel")}
          </Text>
          <Text size="sm">{test.nameAr || "—"}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("nameEnLabel")}
          </Text>
          <Text size="sm">{test.nameEn || "—"}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("categoryLabel")}
          </Text>
          <Text size="sm">{localizedCategory || "—"}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("sampleTypeLabel")}
          </Text>
          <Text size="sm">{test.sampleType || "—"}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("priceLabel")}
          </Text>
          <Text size="sm">{test.price}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("statusLabel")}
          </Text>
          <Text size="sm">{statusActive ? t("statusActive") : t("statusInactive")}</Text>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("createdAtLabel")}
          </Text>
          <Text size="sm">{formatDate(test.createdAt)}</Text>
        </Stack>

        {schemaEntries.length > 0 ? (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t("schemaKey")}</Table.Th>
                <Table.Th>{t("schemaValue")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {schemaEntries.map(([key, value]) => (
                <Table.Tr key={String(key)}>
                  <Table.Td fw={500}>{String(key)}</Table.Td>
                  <Table.Td>{String(value)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : null}

        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            JSON
          </Text>
          <ScrollArea.Autosize mah={280} type="hover" offsetScrollbars="x">
            <Code block fz={12} px={12} py={10} style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
              {toPreviewJson(schema) || "{}"}
            </Code>
          </ScrollArea.Autosize>
        </Stack>
      </Stack>
    </Modal>
  );
};

export { ViewMedicalTestModal };
