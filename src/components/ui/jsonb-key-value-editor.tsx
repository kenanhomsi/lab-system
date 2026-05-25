"use client";

import { ActionIcon, Button, Group, Stack, Text, Textarea, TextInput, ThemeIcon } from "@mantine/core";
import { IconBraces, IconPlus, IconTrash } from "@tabler/icons-react";

type JsonbKeyValuePair = {
  id: string;
  key: string;
  value: string;
};

const createJsonbKeyValuePair = (): JsonbKeyValuePair => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  key: "",
  value: "",
});

function ensureAtLeastOnePair(pairs: JsonbKeyValuePair[]): JsonbKeyValuePair[] {
  return pairs.length > 0 ? pairs : [createJsonbKeyValuePair()];
}

function buildJsonObjectFromPairs(pairs: JsonbKeyValuePair[]): Record<string, string> {
  return pairs.reduce<Record<string, string>>((acc, pair) => {
    const trimmedKey = pair.key.trim();
    if (!trimmedKey) return acc;
    acc[trimmedKey] = pair.value.trim();
    return acc;
  }, {});
}

function parsePairsFromJsonObjectString(raw: unknown): JsonbKeyValuePair[] {
  if (raw === null || raw === undefined) return [createJsonbKeyValuePair()];

  let trimmed = "";
  if (typeof raw !== "string") {
    if (typeof raw === "object") {
      if (Object.keys(raw).length === 0) return [createJsonbKeyValuePair()];
      if (!Array.isArray(raw)) {
        const entries = Object.entries(raw as Record<string, unknown>)
          .map(([key, value]) => ({
            id: createJsonbKeyValuePair().id,
            key,
            value: value == null ? "" : typeof value === "string" ? value : String(value),
          }))
          .filter((row) => row.key.trim().length > 0);
        return entries.length > 0 ? entries : [createJsonbKeyValuePair()];
      }
      trimmed = JSON.stringify(raw);
    } else {
      trimmed = String(raw);
    }
  } else {
    trimmed = raw.trim();
  }

  if (!trimmed || trimmed === "{}") return [createJsonbKeyValuePair()];
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const entries = Object.entries(parsed as Record<string, unknown>)
        .map(([key, value]) => ({
          id: createJsonbKeyValuePair().id,
          key,
          value: value == null ? "" : typeof value === "string" ? value : String(value),
        }))
        .filter((row) => row.key.trim().length > 0);
      return entries.length > 0 ? entries : [createJsonbKeyValuePair()];
    }
    return [createJsonbKeyValuePair()];
  } catch {
    return [createJsonbKeyValuePair()];
  }
}

type JsonbKeyValueEditorProps = {
  title?: string;
  description?: string;
  pairs: JsonbKeyValuePair[];
  onPairsChange: (pairs: JsonbKeyValuePair[]) => void;
  addButtonLabel?: string;
  keyLabel?: string;
  valueLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  previewLabel?: string;
  previewValue?: string;
};

function JsonbKeyValueEditor(props: JsonbKeyValueEditorProps) {
  const pairs = ensureAtLeastOnePair(props.pairs);

  const addPair = () => {
    props.onPairsChange([...pairs, createJsonbKeyValuePair()]);
  };

  const updatePair = (id: string, field: "key" | "value", value: string) => {
    props.onPairsChange(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removePair = (id: string) => {
    const next = pairs.filter((p) => p.id !== id);
    props.onPairsChange(next.length > 0 ? next : [createJsonbKeyValuePair()]);
  };

  const preview =
    props.previewValue ??
    JSON.stringify(buildJsonObjectFromPairs(pairs), null, 2);

  return (
    <Stack gap="md">
      {props.title ? (
        <Group justify="space-between" align="center" wrap="wrap">
          <Group align="center" gap="sm" wrap="nowrap">
            <ThemeIcon size={40} radius="md" variant="light" color="blue">
              <IconBraces size={18} />
            </ThemeIcon>
            <Stack gap={1}>
              <Text fw={700}>{props.title}</Text>
              {props.description ? (
                <Text size="sm" c="dimmed">
                  {props.description}
                </Text>
              ) : null}
            </Stack>
          </Group>
          <Button
            size="xs"
            radius="md"
            variant="light"
            leftSection={<IconPlus size={14} />}
            onClick={addPair}
          >
            {props.addButtonLabel ?? "Add field"}
          </Button>
        </Group>
      ) : (
        <Group justify="flex-end">
          <Button
            size="xs"
            radius="md"
            variant="light"
            leftSection={<IconPlus size={14} />}
            onClick={addPair}
          >
            {props.addButtonLabel ?? "Add field"}
          </Button>
        </Group>
      )}

      {pairs.map((pair, index) => (
        <Group key={pair.id} align="end" wrap="nowrap">
          <TextInput
            label={index === 0 ? (props.keyLabel ?? "Key") : undefined}
            placeholder={props.keyPlaceholder ?? "ex: key"}
            value={pair.key}
            onChange={(e) => updatePair(pair.id, "key", e.currentTarget.value)}
            size="md"
            radius="md"
            style={{ flex: 1 }}
          />
          <TextInput
            label={index === 0 ? (props.valueLabel ?? "Value") : undefined}
            placeholder={props.valuePlaceholder ?? "ex: value"}
            value={pair.value}
            onChange={(e) => updatePair(pair.id, "value", e.currentTarget.value)}
            size="md"
            radius="md"
            style={{ flex: 1 }}
          />
          <ActionIcon
            variant="subtle"
            color="red"
            size="lg"
            onClick={() => removePair(pair.id)}
            aria-label="Remove field"
            mb={index === 0 ? 4 : 2}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}

      <Textarea
        label={props.previewLabel ?? "Generated JSON preview"}
        value={preview}
        rows={6}
        readOnly
        radius="md"
      />
    </Stack>
  );
}

export type { JsonbKeyValuePair };
export {
  JsonbKeyValueEditor,
  buildJsonObjectFromPairs,
  createJsonbKeyValuePair,
  parsePairsFromJsonObjectString,
};

