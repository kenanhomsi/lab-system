"use client";

import { Alert, Checkbox, Loader, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import type { ParameterSchemaInput } from "@/modules/medical-tests/abstraction";
import {
  defaultValuesFromResultFields,
  parameterSchemaToResultFields,
  type ParameterResultFieldDescriptor,
} from "@/modules/medical-tests/abstraction";

type ResultDataFromSchemaProps = {
  parameterSchema: ParameterSchemaInput | undefined | null;
  /** When fetching the medical test for the selected request */
  schemaLoading?: boolean;
  schemaError?: boolean;
  /** Mirrors the latest value map upward (controlled read model for submit). */
  onValuesChange: (values: Record<string, unknown>) => void;
};

const setKey = (
  prev: Record<string, unknown>,
  key: string,
  value: unknown,
): Record<string, unknown> => ({
  ...prev,
  [key]: value,
});

const DescriptionLine = ({
  descriptor,
}: {
  descriptor: ParameterResultFieldDescriptor;
}) => {
  const parts = [descriptor.unit ? `Unit: ${descriptor.unit}` : null].filter(Boolean);
  if (parts.length === 0) return null;
  return (
    <Text size="xs" c="dimmed">
      {parts.join(" · ")}
    </Text>
  );
};

const FieldControl = ({
  descriptor,
  values,
  onChange,
}: {
  descriptor: ParameterResultFieldDescriptor;
  values: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) => {
  const key = descriptor.key;
  const raw = values[key];
  const t = descriptor.type;
  const hasOptions = Boolean(descriptor.options && descriptor.options.length > 0);

  if (hasOptions && descriptor.options) {
    return (
      <Select
        label={descriptor.label}
        description={<DescriptionLine descriptor={descriptor} />}
        withAsterisk={descriptor.required}
        data={descriptor.options.map((o) => ({ value: o, label: o }))}
        placeholder="Choose value"
        value={typeof raw === "string" && raw.length > 0 ? raw : null}
        onChange={(v) => onChange(setKey(values, key, v ?? ""))}
        searchable
        clearable
      />
    );
  }

  if (t === "boolean" || t === "bool") {
    return (
      <Checkbox
        label={descriptor.label}
        description={<DescriptionLine descriptor={descriptor} />}
        checked={Boolean(raw)}
        onChange={(e) => onChange(setKey(values, key, e.currentTarget.checked))}
      />
    );
  }

  if (
    t === "number" ||
    t === "integer" ||
    t === "int" ||
    t === "float" ||
    t === "decimal"
  ) {
    const asNum =
      typeof raw === "number" && Number.isFinite(raw)
        ? raw
        : typeof raw === "string" && raw.trim() !== ""
          ? Number(raw.trim())
          : undefined;
    return (
      <NumberInput
        label={descriptor.label}
        description={<DescriptionLine descriptor={descriptor} />}
        withAsterisk={descriptor.required}
        value={asNum}
        onChange={(v) => onChange(setKey(values, key, v === "" || v === undefined ? "" : v))}
        clampBehavior="strict"
      />
    );
  }

  return (
    <TextInput
      label={descriptor.label}
      description={<DescriptionLine descriptor={descriptor} />}
      withAsterisk={descriptor.required}
      value={typeof raw === "string" ? raw : raw == null ? "" : String(raw)}
      onChange={(e) => onChange(setKey(values, key, e.currentTarget.value))}
    />
  );
};

/** Renders controls derived from {@link ParameterSchemaInput} for JSON result payload (`resultData`). */
function ResultDataFromSchema({
  parameterSchema,
  schemaLoading,
  schemaError,
  onValuesChange,
}: ResultDataFromSchemaProps) {
  const fields = useMemo(
    () => parameterSchemaToResultFields(parameterSchema),
    [parameterSchema],
  );

  const [values, setValues] = useState(() => defaultValuesFromResultFields(fields));

  useLayoutEffect(() => {
    onValuesChange(values);
  }, [onValuesChange, values]);

  const bumpValues = useCallback(
    (next: Record<string, unknown>) => {
      setValues(next);
    },
    [],
  );

  if (schemaLoading) {
    return (
      <Stack align="center" py="md" gap="sm">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          Loading parameter schema…
        </Text>
      </Stack>
    );
  }

  if (schemaError) {
    return (
      <Alert color="red" variant="light" title="Could not load test schema">
        Select a test request again or retry. Result values need the linked medical test.
      </Alert>
    );
  }

  if (fields.length === 0) {
    return (
      <Alert color="blue" variant="light" title="No parameters defined">
        This medical test has no parameter schema. Result data will be saved as{" "}
        <code>{"{}"}</code>.
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      {fields.map((descriptor) => (
        <FieldControl
          key={descriptor.key}
          descriptor={descriptor}
          values={values}
          onChange={(next) => bumpValues(next)}
        />
      ))}
    </Stack>
  );
}

export { ResultDataFromSchema };
