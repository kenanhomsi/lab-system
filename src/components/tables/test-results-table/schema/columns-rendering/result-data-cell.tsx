"use client";

import { Box, Code, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import classes from "./result-data-cell.module.css";
import { parseResultData, stringifyPreview } from "./parse-result-data";

const MAX_PARTS = 8;
const MAX_VAL_LEN = 16;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, Math.max(0, max - 1))}…`;
}

function displayKey(rawKey: string): string {
  const spaced = rawKey.replace(/[_-]+/g, " ").trim();
  if (!spaced) return rawKey;
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}

function joinEntriesToolTip(entries: [string, unknown][]): string {
  return entries.map(([k, v]) => `${k}: ${stringifyPreview(v)}`).join("\n");
}

/** Compact 1–2 line summary for lab result JSON (full detail on row click / tooltip) */
function ResultDataCell({ value }: { value: unknown }) {
  const t = useTranslations("admin.testResults");
  const parsed = parseResultData(value);

  if (parsed.kind === "empty") {
    return (
      <Text size="sm" c="dimmed" py={4}>
        —
      </Text>
    );
  }

  if (parsed.kind === "object") {
    const shown = parsed.entries.slice(0, MAX_PARTS);
    const hiddenCount = parsed.entries.length - shown.length;
    const segments = shown.map(
      ([k, v]) => `${displayKey(k)} ${truncate(stringifyPreview(v), MAX_VAL_LEN)}`,
    );
    if (hiddenCount > 0) {
      segments.push(t("resultDataMoreCount", { count: hiddenCount }));
    }
    const line = segments.join(" · ");
    const title = joinEntriesToolTip(parsed.entries);

    return (
      <Box className={classes.box} py={4} px={6} style={{ borderRadius: 6, maxWidth: 400 }}>
        <Text size="xs" lh={1.35} lineClamp={2} title={title}>
          {line}
        </Text>
      </Box>
    );
  }

  const summary =
    parsed.kind === "json" && Array.isArray(parsed.value)
      ? t("resultDataArrayPreview", { count: parsed.value.length })
      : parsed.kind === "json"
        ? t("resultDataStructuredPreview")
        : t("resultDataRawPreview");

  const compactPreview = truncate(
    parsed.kind === "json" ? stringifyPreview(parsed.value) : parsed.text,
    140,
  );

  return (
    <Box className={classes.box} py={4} px={6} style={{ borderRadius: 6, maxWidth: 400 }}>
      <Code
        fz={11}
        fw={500}
        px={8}
        py={6}
        block
        title={`${summary}\n${compactPreview}`}
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 40,
          overflow: "hidden",
          lineHeight: 1.35,
          borderRadius: 6,
        }}
      >
        {compactPreview}
      </Code>
    </Box>
  );
}

export { ResultDataCell };
