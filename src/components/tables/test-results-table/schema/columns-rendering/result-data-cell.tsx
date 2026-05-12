"use client";

import {
  Badge,
  Box,
  Code,
  Group,
  Popover,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconBraces } from "@tabler/icons-react";
import classes from "./result-data-cell.module.css";

type Parsed =
  | { kind: "empty" }
  | { kind: "object"; entries: [string, unknown][] }
  | { kind: "json"; value: unknown }
  | { kind: "text"; text: string };

const MAX_CHIPS = 5;
const MAX_VALUE_LEN = 26;

function stringifyPreview(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

function parseResultData(raw: string): Parsed {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "{}") return { kind: "empty" };
  try {
    const value = JSON.parse(trimmed) as unknown;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return {
        kind: "object",
        entries: Object.entries(value as Record<string, unknown>),
      };
    }
    return { kind: "json", value };
  } catch {
    return { kind: "text", text: trimmed };
  }
}

function prettyPrint(raw: string): string {
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

/** Summarizes lab result JSON as key/value chips; opens a popover with indented JSON for full detail. */
function ResultDataCell({ value }: { value: string }) {
  const parsed = parseResultData(value);

  if (parsed.kind === "empty") {
    return (
      <Text size="sm" c="dimmed" py={4}>
        —
      </Text>
    );
  }

  const formatted = prettyPrint(value);

  const chips =
    parsed.kind === "object"
      ? parsed.entries.slice(0, MAX_CHIPS).map(([k, v]) => {
        const vs = truncate(stringifyPreview(v), MAX_VALUE_LEN);
        const label = `${k}: ${vs}`;
        return (
          <Badge
            key={k}
            variant="light"
            color="teal"
            radius="md"
            size="sm"
            tt="none"
            title={label}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
            styles={{
              label: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                textAlign: "start",
                fontWeight: 500,
              },
            }}
          >
            {label}
          </Badge>
        );
      })
      : null;

  const overflow =
    parsed.kind === "object" && parsed.entries.length > MAX_CHIPS ? (
      <Badge variant="outline" color="gray" size="sm" radius="md" tt="none">
        +{parsed.entries.length - MAX_CHIPS} more
      </Badge>
    ) : null;

  const summary =
    parsed.kind === "object"
      ? `${parsed.entries.length} field${parsed.entries.length === 1 ? "" : "s"}`
      : parsed.kind === "json" && Array.isArray(parsed.value)
        ? `Array (${parsed.value.length})`
        : parsed.kind === "json"
          ? "Structured value"
          : "Raw text";

  const compactPreview =
    parsed.kind === "object"
      ? null
      : truncate(
        parsed.kind === "json"
          ? stringifyPreview(parsed.value)
          : parsed.text,
        160,
      );

  return (
    <Popover position="bottom-start" withArrow shadow="md" width={400} trapFocus={false}>
      <Popover.Target>
        <UnstyledButton
          type="button"
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", textAlign: "inherit", borderRadius: 8 }}
        >
          <Box
            py={4}
            px={6}
            maw={340}
            mx={-6}
            className={classes.box}
            style={{
              borderRadius: 8,
            }}
          >
            {parsed.kind === "object" ? (
              <Stack gap={6}>
                <Group gap={6} wrap="wrap" align="flex-start">
                  {chips}
                  {overflow}
                </Group>
                <Group gap={6} wrap="nowrap" align="center">
                  <IconBraces size={14} stroke={1.5} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <Text size="xs" c="dimmed" lh={1.3}>
                    {summary} · click to expand
                  </Text>
                </Group>
              </Stack>
            ) : (
              <Stack gap={6}>
                <Code
                  fz={11}
                  fw={500}
                  px={10}
                  py={8}
                  block
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: 76,
                    overflow: "hidden",
                    lineHeight: 1.45,
                    borderRadius: 8,
                  }}
                >
                  {compactPreview}
                </Code>
                <Group gap={6} wrap="nowrap" align="center">
                  <IconBraces size={14} stroke={1.5} style={{ opacity: 0.5, flexShrink: 0 }} />
                  <Text size="xs" c="dimmed">
                    {summary} · click to expand
                  </Text>
                </Group>
              </Stack>
            )}
          </Box>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p="sm">
        <Stack gap="xs">
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" lts={0.8}>
            Result data
          </Text>
          <ScrollArea.Autosize mah={380} type="hover" offsetScrollbars="x">
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
              {formatted}
            </Code>
          </ScrollArea.Autosize>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export { ResultDataCell };
