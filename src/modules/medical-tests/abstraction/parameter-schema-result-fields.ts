import { parseParameterSchema, type ParameterSchemaInput } from "./parameter-schema";

/**
 * One entry in the medical test parameter schema, normalized for capturing a lab result value.
 */
type ParameterResultFieldDescriptor = {
  key: string;
  label: string;
  type: string | undefined;
  unit: string | undefined;
  options: string[] | undefined;
  defaultValue: string | number | boolean | null | undefined;
  required: boolean;
};

const normalizeFieldType = (raw: string | undefined): string | undefined => {
  if (raw === undefined) return undefined;
  const t = raw.trim().toLowerCase();
  return t.length > 0 ? t : undefined;
};

/**
 * Parse a medical test {@link ParameterSchemaInput} into ordered field descriptors for UI.
 */
function parameterSchemaToResultFields(
  schema: ParameterSchemaInput | undefined | null,
): ParameterResultFieldDescriptor[] {
  if (schema === undefined || schema === null) {
    return [];
  }
  const model = parseParameterSchema(schema);

  if (Array.isArray(model)) {
    return model
      .filter((field) => field.key.trim().length > 0)
      .map((field) => ({
        key: field.key.trim(),
        label: field.label?.trim() || field.key.trim(),
        type: normalizeFieldType(field.type),
        unit:
          typeof field.unit === "string" && field.unit.trim().length > 0 ? field.unit.trim() : undefined,
        options:
          Array.isArray(field.options) && field.options.length > 0 ? [...field.options] : undefined,
        defaultValue: field.value,
        required: field.required ?? false,
      }));
  }

  const entries = Object.entries(model).filter(([k]) => k.trim().length > 0);
  return entries.map(([key, defaultValue]) => {
    let inferredType: string | undefined;
    if (typeof defaultValue === "number" && Number.isFinite(defaultValue)) {
      inferredType = "number";
    } else if (typeof defaultValue === "boolean") {
      inferredType = "boolean";
    }
    return {
      key: key.trim(),
      label: key.trim(),
      type: inferredType,
      unit: undefined,
      options: undefined,
      defaultValue,
      required: false,
    };
  });
}

/**
 * Seed form state from schema defaults when the selected medical test changes.
 */
function defaultValuesFromResultFields(
  fields: ParameterResultFieldDescriptor[],
): Record<string, unknown> {
  const acc: Record<string, unknown> = {};
  for (const f of fields) {
    if (f.defaultValue !== undefined && f.defaultValue !== null) {
      acc[f.key] = f.defaultValue;
      continue;
    }
    const t = f.type;
    if (t === "boolean" || t === "bool") {
      acc[f.key] = false;
      continue;
    }
    if (
      t === "number" ||
      t === "integer" ||
      t === "int" ||
      t === "float" ||
      t === "decimal"
    ) {
      acc[f.key] = "";
      continue;
    }
    if (f.options && f.options.length > 0) {
      acc[f.key] = "";
      continue;
    }
    acc[f.key] = "";
  }
  return acc;
}

/**
 * Coerce current UI values into a JSON-serializable plain object ({@link ParameterResultFieldDescriptor} keys only).
 */
/** Returns an error message when a required field is empty, otherwise `null`. */
function validateRequiredResultFields(
  fields: ParameterResultFieldDescriptor[],
  values: Record<string, unknown>,
): string | null {
  for (const f of fields) {
    if (!f.required) continue;
    const raw = values[f.key];
    const hasOptions = f.options !== undefined && f.options.length > 0;

    if (f.type === "boolean" || f.type === "bool") {
      continue;
    }

    if (hasOptions) {
      const s = typeof raw === "string" ? raw.trim() : raw == null ? "" : String(raw).trim();
      if (!s.length) {
        return `"${f.label}" is required.`;
      }
      continue;
    }

    if (
      f.type === "number" ||
      f.type === "integer" ||
      f.type === "int" ||
      f.type === "float" ||
      f.type === "decimal"
    ) {
      if (raw === "" || raw === undefined || raw === null) {
        return `"${f.label}" is required.`;
      }
      const n =
        typeof raw === "number"
          ? raw
          : typeof raw === "string"
            ? Number(raw.trim())
            : NaN;
      if (!Number.isFinite(n)) {
        return `"${f.label}" must be a valid number.`;
      }
      continue;
    }

    const s =
      typeof raw === "string"
        ? raw.trim()
        : raw === null || raw === undefined
          ? ""
          : String(raw).trim();
    if (!s.length) {
      return `"${f.label}" is required.`;
    }
  }
  return null;
}

function buildResultObjectFromDescriptors(
  fields: ParameterResultFieldDescriptor[],
  values: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = values[f.key];

    const t = f.type;
    const hasOptions = f.options !== undefined && f.options.length > 0;

    if (hasOptions) {
      const s =
        typeof raw === "string"
          ? raw.trim()
          : raw === null || raw === undefined
            ? ""
            : String(raw).trim();
      if (!s.length) continue;
      out[f.key] = s;
      continue;
    }

    if (t === "boolean" || t === "bool") {
      out[f.key] = Boolean(raw);
      continue;
    }

    if (
      t === "number" ||
      t === "integer" ||
      t === "int" ||
      t === "float" ||
      t === "decimal"
    ) {
      if (raw === "" || raw === undefined || raw === null) continue;
      const n =
        typeof raw === "number"
          ? raw
          : typeof raw === "string"
            ? Number(raw.trim())
            : NaN;
      if (!Number.isFinite(n)) continue;
      out[f.key] = t === "integer" || t === "int" ? Math.trunc(n) : n;
      continue;
    }

    /* string-ish default */
    const s =
      typeof raw === "string"
        ? raw.trim()
        : raw === null || raw === undefined
          ? ""
          : String(raw).trim();
    if (!s.length) continue;
    out[f.key] = s;
  }
  return out;
}

export type { ParameterResultFieldDescriptor };
export {
  buildResultObjectFromDescriptors,
  defaultValuesFromResultFields,
  parameterSchemaToResultFields,
  validateRequiredResultFields,
};
