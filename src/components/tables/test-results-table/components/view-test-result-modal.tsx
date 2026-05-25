"use client";

import { Group, Modal, ScrollArea, Stack, Table, Text, Code } from "@mantine/core";
import { IconListDetails } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getTestRequestCreatorLabel } from "../get-test-request-creator-label";
import { TestResultItem } from "../types";
import { parseResultData, stringifyPreview } from "../schema/columns-rendering/parse-result-data";

function prettyPrint(raw: unknown): string {
  if (raw === null || raw === undefined) return "";

  if (typeof raw !== "string") {
    try {
      return JSON.stringify(raw, null, 2);
    } catch {
      return String(raw);
    }
  }

  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (trimmed === "{}") return "{}";
  try {
    const obj: unknown = JSON.parse(trimmed);
    return JSON.stringify(obj, null, 2);
  } catch {
    return trimmed;
  }
}

export function ViewTestResultModal({
  opened,
  onClose,
  testResult,
}: {
  opened: boolean;
  onClose: () => void;
  testResult: TestResultItem;
}) {
  const t = useTranslations("admin.testResults");
  const requestCreator = getTestRequestCreatorLabel(testResult);
  const parsed = parseResultData(testResult.resultData);
  const formatted = prettyPrint(testResult.resultData);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconListDetails size={20} />
          <Text fw={600}>{t("colResultData")}</Text>
        </Group>
      }
      size="lg"
      centered
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Stack gap="md">
        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">
            {t("colTestRequestId")}
          </Text>
          <Text size="sm">{testResult.testRequestId}</Text>
        </Stack>
        {requestCreator ? (
          <Stack gap={4}>
            <Text size="sm" fw={600} c="dimmed">
              {t("colRequestCreatedBy")}
            </Text>
            <Text size="sm">{requestCreator}</Text>
          </Stack>
        ) : null}
        {parsed.kind === "object" && parsed.entries && parsed.entries.length > 0 && (
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Key</Table.Th>
                <Table.Th>Value</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {parsed.entries.map(([k, v]) => (
                <Table.Tr key={k}>
                  <Table.Td fw={500}>{k}</Table.Td>
                  <Table.Td>{stringifyPreview(v)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        <Stack gap={4}>
          <Text size="sm" fw={600} c="dimmed">JSON</Text>
          <ScrollArea.Autosize mah={400} type="hover" offsetScrollbars="x">
            <Code
              block
              fz={12}
              px={12}
              py={10}
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.5,
                borderRadius: 8,
              }}
            >
              {formatted || "—"}
            </Code>
          </ScrollArea.Autosize>
        </Stack>
      </Stack>
    </Modal>
  );
}