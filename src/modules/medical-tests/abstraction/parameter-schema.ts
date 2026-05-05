type ParameterPrimitive = string | number | boolean | null;

type ParameterSchemaFlat = Record<string, ParameterPrimitive>;

type ParameterSchemaField = {
  key: string;
  value?: ParameterPrimitive;
  label?: string;
  type?: string;
  unit?: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
};

type ParameterSchemaAdvanced = ParameterSchemaField[];

type ParameterSchemaModel = ParameterSchemaFlat | ParameterSchemaAdvanced;

type ParameterSchemaInput = string | ParameterSchemaModel;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isParameterPrimitive = (value: unknown): value is ParameterPrimitive =>
  typeof value === "string" ||
  typeof value === "number" ||
  typeof value === "boolean" ||
  value === null;

const normalizeField = (value: unknown): ParameterSchemaField | null => {
  if (!isRecord(value)) return null;
  const key = typeof value.key === "string" ? value.key.trim() : "";
  if (!key) return null;

  const field: ParameterSchemaField = { key };

  if (isParameterPrimitive(value.value)) field.value = value.value;
  if (typeof value.label === "string") field.label = value.label;
  if (typeof value.type === "string") field.type = value.type;
  if (typeof value.unit === "string") field.unit = value.unit;
  if (typeof value.required === "boolean") field.required = value.required;
  if (typeof value.min === "number") field.min = value.min;
  if (typeof value.max === "number") field.max = value.max;
  if (Array.isArray(value.options)) {
    field.options = value.options.filter(
      (option): option is string => typeof option === "string",
    );
  }

  return field;
};

const normalizeFlat = (value: unknown): ParameterSchemaFlat | null => {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value).filter(
    ([key, item]) => key.trim().length > 0 && isParameterPrimitive(item),
  );
  if (entries.length === 0) return null;
  return Object.fromEntries(entries) as ParameterSchemaFlat;
};

const normalizeAdvanced = (value: unknown): ParameterSchemaAdvanced | null => {
  if (!Array.isArray(value)) return null;
  const fields = value
    .map((item) => normalizeField(item))
    .filter((item): item is ParameterSchemaField => item !== null);
  return fields.length > 0 ? fields : null;
};

const parseParameterSchema = (value: ParameterSchemaInput): ParameterSchemaModel => {
  const raw =
    typeof value === "string"
      ? (() => {
          const text = value.trim();
          if (!text) return {};
          try {
            return JSON.parse(text) as unknown;
          } catch {
            return {};
          }
        })()
      : value;

  const advanced = normalizeAdvanced(raw);
  if (advanced) return advanced;

  const flat = normalizeFlat(raw);
  if (flat) return flat;

  return {};
};

const stringifyParameterSchema = (value: ParameterSchemaInput): string => {
  const normalized = parseParameterSchema(value);
  return JSON.stringify(normalized);
};

export type {
  ParameterPrimitive,
  ParameterSchemaAdvanced,
  ParameterSchemaField,
  ParameterSchemaFlat,
  ParameterSchemaInput,
  ParameterSchemaModel,
};
export { parseParameterSchema, stringifyParameterSchema };
