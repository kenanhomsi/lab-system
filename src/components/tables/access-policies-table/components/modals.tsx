"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tabs,
  Box,
  ActionIcon,
  Tooltip,
  Collapse,
  Code,
  Alert,
  Badge,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconShieldLock, IconCode, IconX, IconHelp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { frontendContainer } from "@/container";
import { RoleFrontendService, roleModuleNames } from "@/modules/role";
import { UserFrontendService, userModuleNames } from "@/modules/user";
import { useMirror } from "../store";
import {
  AccessPolicyTableItem,
  CreateAccessPolicyRequest,
} from "../types";

type SelectOption = { value: string; label: string };
type ActionValue = "read" | "write" | "delete" | "approve" | "assign";
type ConditionType = "all" | "any";
type ConditionRuleDraft = { field: string; operator: string; valueText: string };

const ACTION_VALUES: ActionValue[] = ["read", "write", "delete", "approve", "assign"];
const RESOURCE_PATTERN = /^[a-z]+(?:_[a-z]+)*$/;
const OPERATOR_OPTIONS = [
  { value: "eq", labelKey: "operatorEq" },
  { value: "neq", labelKey: "operatorNeq" },
  { value: "gt", labelKey: "operatorGt" },
  { value: "gte", labelKey: "operatorGte" },
  { value: "lt", labelKey: "operatorLt" },
  { value: "lte", labelKey: "operatorLte" },
  { value: "in", labelKey: "operatorIn" },
  { value: "nin", labelKey: "operatorNin" },
  { value: "contains", labelKey: "operatorContains" },
  { value: "startsWith", labelKey: "operatorStartsWith" },
  { value: "endsWith", labelKey: "operatorEndsWith" },
] as const;

const isActionValue = (value: string): value is ActionValue =>
  ACTION_VALUES.includes(value as ActionValue);

const parseConditionDraft = (
  condition: string,
): { type: ConditionType; rules: ConditionRuleDraft[]; isJsonValid: boolean } => {
  try {
    if (!condition.trim()) return { type: "all", rules: [], isJsonValid: true };
    const parsed = JSON.parse(condition) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return { type: "all", rules: [], isJsonValid: false };
    }
    const container =
      "all" in parsed
        ? (parsed as { all?: unknown }).all
        : "any" in parsed
          ? (parsed as { any?: unknown }).any
          : null;
    const type: ConditionType = "any" in parsed ? "any" : "all";
    if (!Array.isArray(container)) {
      return { type, rules: [], isJsonValid: true };
    }
    const rules = container
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const rule = item as { field?: unknown; operator?: unknown; value?: unknown };
        const field = typeof rule.field === "string" ? rule.field : "";
        const operator = typeof rule.operator === "string" ? rule.operator : "";
        const valueText =
          typeof rule.value === "string"
            ? rule.value
            : rule.value === null
              ? "null"
              : typeof rule.value === "number" || typeof rule.value === "boolean"
                ? String(rule.value)
                : typeof rule.value === "object"
                  ? JSON.stringify(rule.value)
                  : "";
        return { field, operator, valueText };
      })
      .filter((r): r is ConditionRuleDraft => Boolean(r));
    return { type, rules, isJsonValid: true };
  } catch {
    return { type: "all", rules: [], isJsonValid: false };
  }
};

const parseValueText = (valueText: string): unknown => {
  const trimmed = valueText.trim();
  if (trimmed === "") return "";
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && String(asNumber) === trimmed) return asNumber;
  if (/^[\[{"]/.test(trimmed)) {
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return valueText;
    }
  }
  return valueText;
};

const stringifyConditionDraft = (type: ConditionType, rules: ConditionRuleDraft[]): string => {
  const validRules = rules
    .map((r) => ({
      field: r.field.trim(),
      operator: r.operator.trim(),
      valueText: r.valueText,
    }))
    .filter((r) => r.field.length > 0 && r.operator.length > 0 && r.valueText.trim().length > 0)
    .map((r) => ({
      field: r.field,
      operator: r.operator,
      value: parseValueText(r.valueText),
    }));
  if (validRules.length === 0) return "";
  return JSON.stringify({ [type]: validRules }, null, 2);
};

const prettifyJson = (input: string): string => {
  const trimmed = input.trim();
  if (!trimmed) return "";
  try {
    return JSON.stringify(JSON.parse(trimmed) as unknown, null, 2);
  } catch {
    return input;
  }
};

const roleService = frontendContainer.get<RoleFrontendService>(roleModuleNames.service);
const userService = frontendContainer.get<UserFrontendService>(userModuleNames.service);

const toRoleOptions = (payload: unknown): SelectOption[] => {
  const fromArray = Array.isArray(payload) ? payload : null;
  const fromItems =
    !fromArray &&
      typeof payload === "object" &&
      payload !== null &&
      "items" in payload &&
      Array.isArray((payload as { items?: unknown[] }).items)
      ? ((payload as { items: unknown[] }).items ?? [])
      : null;
  const fromDataItems =
    !fromArray &&
      !fromItems &&
      typeof payload === "object" &&
      payload !== null &&
      "data" in payload &&
      typeof (payload as { data?: unknown }).data === "object" &&
      (payload as { data?: unknown }).data !== null &&
      Array.isArray(((payload as { data: { items?: unknown[] } }).data.items ?? []))
      ? ((payload as { data: { items: unknown[] } }).data.items ?? [])
      : [];

  const list = fromArray ?? fromItems ?? fromDataItems;
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = "id" in item && typeof item.id === "string" ? item.id : "";
      const name = "name" in item && typeof item.name === "string" ? item.name : "";
      if (!id) return null;
      return { value: id, label: name || id };
    })
    .filter((item): item is SelectOption => Boolean(item));
};

const toUserOptions = (payload: unknown): SelectOption[] => {
  const fromArray = Array.isArray(payload) ? payload : null;
  const fromDataItems =
    !fromArray &&
      typeof payload === "object" &&
      payload !== null &&
      "data" in payload &&
      typeof (payload as { data?: unknown }).data === "object" &&
      (payload as { data?: unknown }).data !== null &&
      Array.isArray(((payload as { data: { items?: unknown[] } }).data.items ?? []))
      ? ((payload as { data: { items: unknown[] } }).data.items ?? [])
      : [];

  const list = fromArray ?? fromDataItems;
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = "id" in item && typeof item.id === "string" ? item.id : "";
      const fullName =
        "fullName" in item && typeof item.fullName === "string" ? item.fullName : "";
      const email = "email" in item && typeof item.email === "string" ? item.email : "";
      if (!id) return null;
      return { value: id, label: fullName || email || id };
    })
    .filter((item): item is SelectOption => Boolean(item));
};

function emptyPayload(): CreateAccessPolicyRequest {
  return {
    resource: "",
    action: "",
    effect: "Deny",
    subjectType: "User",
    subjectKey: "",
    condition: "",
    priority: 0,
    isEnabled: true,
    description: "",
  };
}

function fromRow(row: AccessPolicyTableItem): CreateAccessPolicyRequest {
  const effect = row.effect === "Allow" || row.effect === "Deny" ? row.effect : "Deny";
  const subjectType =
    row.subjectType === "Role" || row.subjectType === "User" ? row.subjectType : "User";
  const action = row.action?.trim().toLowerCase() ?? "";

  return {
    resource: row.resource ?? "",
    action: isActionValue(action) ? action : "",
    effect,
    subjectType,
    subjectKey: row.subjectKey ?? "",
    condition: row.condition ?? "",
    priority: typeof row.priority === "number" ? row.priority : 0,
    isEnabled: Boolean(row.isEnabled),
    description: row.description ?? "",
  };
}

const Modals = () => {
  const t = useTranslations("admin.settings.accessPolicies");
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedPolicy = useMirror("selectedPolicy");
  const setSelectedPolicy = useMirror("setSelectedPolicy");
  const createPolicy = useMirror("createAccessPolicy") as (
    p: CreateAccessPolicyRequest,
  ) => Promise<unknown>;
  const updatePolicy = useMirror("updateAccessPolicy") as (
    id: string,
    p: CreateAccessPolicyRequest,
  ) => Promise<unknown>;
  const deletePolicy = useMirror("deleteAccessPolicy") as (id: string) => Promise<unknown>;
  const validatePolicy = useMirror("validateAccessPolicy") as (
    p: CreateAccessPolicyRequest,
  ) => Promise<unknown>;

  const [form, setForm] = useState<CreateAccessPolicyRequest>(emptyPayload);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [conditionTab, setConditionTab] = useState<"builder" | "json">("builder");
  const [conditionHelpOpen, setConditionHelpOpen] = useState(false);
  const [conditionType, setConditionType] = useState<ConditionType>("all");
  const [conditionRules, setConditionRules] = useState<ConditionRuleDraft[]>([]);

  const isEdit = activeModal === "edit";
  const formOpen = activeModal === "create" || isEdit;
  const isRoleSubject = form.subjectType === "Role";

  const { data: roleOptions = [], isFetching: isLoadingRoles } = useQuery({
    queryKey: ["access-policy-role-options"],
    queryFn: async () => {
      const payload = await roleService.findAll({ query: { Page: "1", PageSize: "100" } });
      return toRoleOptions(payload);
    },
    enabled: formOpen && isRoleSubject,
    staleTime: 1000 * 60 * 5,
  });

  const { data: userOptions = [], isFetching: isLoadingUsers } = useQuery({
    queryKey: ["access-policy-user-options"],
    queryFn: async () => {
      const payload = await userService.findAll({ query: { Page: "1", PageSize: "100" } });
      return toUserOptions(payload);
    },
    enabled: formOpen && !isRoleSubject,
    staleTime: 1000 * 60 * 5,
  });

  const subjectOptions = isRoleSubject ? roleOptions : userOptions;
  const subjectOptionsWithCurrent = useMemo(() => {
    if (!form.subjectKey) return subjectOptions;
    if (subjectOptions.some((option) => option.value === form.subjectKey)) return subjectOptions;
    return [{ value: form.subjectKey, label: form.subjectKey }, ...subjectOptions];
  }, [form.subjectKey, subjectOptions]);

  useEffect(() => {
    if (activeModal === "create") {
      const payload = emptyPayload();
      setForm(payload);
      setConditionTab("builder");
      setConditionHelpOpen(false);
      setConditionType("all");
      setConditionRules([]);
    } else if (activeModal === "edit" && selectedPolicy) {
      const payload = fromRow(selectedPolicy);
      setForm(payload);
      const parsed = parseConditionDraft(payload.condition);
      setConditionType(parsed.type);
      setConditionRules(parsed.rules);
      setConditionHelpOpen(false);
      setConditionTab(parsed.isJsonValid ? "builder" : "json");
    }
  }, [activeModal, selectedPolicy]);

  const close = () => {
    setActiveModal(null);
    setSelectedPolicy(null);
    setIsSubmitting(false);
    setShowErrors(false);
    setConditionHelpOpen(false);
  };

  const resourceValue = form.resource.trim();
  const actionValue = form.action.trim().toLowerCase();
  const subjectKeyValue = form.subjectKey.trim();
  const conditionValue = form.condition.trim();

  const resourceError =
    resourceValue.length === 0
      ? t("errorResourceRequired")
      : RESOURCE_PATTERN.test(resourceValue)
        ? null
        : t("errorResourceFormat");

  const actionError =
    actionValue.length === 0
      ? t("errorActionRequired")
      : isActionValue(actionValue)
        ? null
        : t("errorActionInvalid");

  const conditionError = (() => {
    if (!conditionValue) return null;
    try {
      const parsed = JSON.parse(conditionValue) as unknown;
      if (!parsed || typeof parsed !== "object") return t("errorConditionInvalidJson");
      const container =
        "all" in parsed
          ? (parsed as { all?: unknown }).all
          : "any" in parsed
            ? (parsed as { any?: unknown }).any
            : null;
      if (!Array.isArray(container) || container.length === 0) {
        return t("errorConditionInvalidShape");
      }
      const isValidRule = container.every((item) => {
        if (!item || typeof item !== "object") return false;
        const rule = item as { field?: unknown; operator?: unknown; value?: unknown };
        return (
          typeof rule.field === "string" &&
          rule.field.trim().length > 0 &&
          typeof rule.operator === "string" &&
          rule.operator.trim().length > 0 &&
          "value" in rule
        );
      });
      return isValidRule ? null : t("errorConditionRuleKeys");
    } catch {
      return t("errorConditionInvalidJson");
    }
  })();

  const canSubmit =
    !resourceError &&
    !actionError &&
    !conditionError &&
    subjectKeyValue.length > 0;

  const operatorOptions = OPERATOR_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  const conditionStatus: "empty" | "valid" | "invalid" =
    conditionValue.length === 0 ? "empty" : conditionError ? "invalid" : "valid";

  const conditionInlineError =
    conditionValue.length > 0 && conditionError ? conditionError : null;

  const setConditionFromBuilder = (nextType: ConditionType, nextRules: ConditionRuleDraft[]) => {
    setConditionType(nextType);
    setConditionRules(nextRules);
    const condition = stringifyConditionDraft(nextType, nextRules);
    setForm((f) => ({ ...f, condition }));
  };

  const onConditionTabChange = (value: string | null) => {
    const next = value === "json" ? "json" : "builder";
    setConditionTab(next);
    setConditionHelpOpen(false);
    if (next === "builder") {
      const parsed = parseConditionDraft(form.condition);
      if (!form.condition.trim() || parsed.isJsonValid) {
        setConditionType(parsed.type);
        setConditionRules(parsed.rules);
      }
    }
  };

  const addConditionRule = () => {
    const nextRules: ConditionRuleDraft[] = [
      ...conditionRules,
      { field: "", operator: "eq", valueText: "" },
    ];
    setConditionFromBuilder(conditionType, nextRules);
  };

  const removeConditionRule = (index: number) => {
    const nextRules = conditionRules.filter((_, i) => i !== index);
    setConditionFromBuilder(conditionType, nextRules);
  };

  const updateConditionRule = (index: number, patch: Partial<ConditionRuleDraft>) => {
    const nextRules = conditionRules.map((r, i) => (i === index ? { ...r, ...patch } : r));
    setConditionFromBuilder(conditionType, nextRules);
  };

  const clearCondition = () => {
    setConditionHelpOpen(false);
    setConditionType("all");
    setConditionRules([]);
    setForm((f) => ({ ...f, condition: "" }));
  };

  const prettifyCondition = () => {
    setForm((f) => ({ ...f, condition: prettifyJson(f.condition) }));
  };

  const submit = async () => {
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }
    const normalizedForm: CreateAccessPolicyRequest = {
      ...form,
      resource: resourceValue,
      action: actionValue,
      subjectKey: subjectKeyValue,
      condition: conditionValue,
    };
    setIsSubmitting(true);
    try {
      if (isEdit && selectedPolicy?.id) {
        await updatePolicy(selectedPolicy.id, normalizedForm);
        notifications.show({ title: t("toastSavedTitle"), message: t("toastSavedMessage"), color: "green" });
      } else {
        await createPolicy(normalizedForm);
        notifications.show({ title: t("toastCreatedTitle"), message: t("toastCreatedMessage"), color: "green" });
      }
      close();
    } catch {
      notifications.show({ title: t("toastErrorTitle"), message: t("toastErrorMessage"), color: "red" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onValidate = async () => {
    if (!canSubmit) {
      setShowErrors(true);
      notifications.show({
        title: t("toastErrorTitle"),
        message: t("toastValidationInputMessage"),
        color: "red",
      });
      return;
    }
    const normalizedForm: CreateAccessPolicyRequest = {
      ...form,
      resource: resourceValue,
      action: actionValue,
      subjectKey: subjectKeyValue,
      condition: conditionValue,
    };
    setIsSubmitting(true);
    try {
      await validatePolicy(normalizedForm);
      notifications.show({
        title: t("toastValidateOkTitle"),
        message: t("toastValidateOkMessage"),
        color: "teal",
      });
    } catch {
      notifications.show({
        title: t("toastValidateFailTitle"),
        message: t("toastValidateFailMessage"),
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    const id = selectedPolicy?.id;
    if (!id) return;
    setIsSubmitting(true);
    try {
      await deletePolicy(id);
      notifications.show({
        title: t("toastDeletedTitle"),
        message: t("toastDeletedMessage"),
        color: "green",
      });
      close();
    } catch {
      notifications.show({ title: t("toastErrorTitle"), message: t("toastErrorMessage"), color: "red" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        opened={formOpen}
        onClose={() => (!isSubmitting ? close() : undefined)}
        title={
          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
            <ThemeIcon size={46} radius="lg" variant="light" color="indigo">
              <IconShieldLock size={22} />
            </ThemeIcon>
            <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
              <Title order={4} lh={1.2}>
                {isEdit ? t("modalEditTitle") : t("modalCreateTitle")}
              </Title>
              <Text size="sm" c="dimmed" lh={1.45}>
                {isEdit ? t("modalEditDescription") : t("modalCreateDescription")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size="xl"
        radius="xl"
        padding="lg"
        closeOnClickOutside={!isSubmitting}
        closeOnEscape={!isSubmitting}
        overlayProps={{ blur: 12, backgroundOpacity: 0.24 }}
        styles={{
          content: {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
            border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
            scrollbarWidth: "none",
          },
          body: {
            overflow: "visible",
          },
        }}
      >
        <Stack gap="md">
          <Group grow>
            <TextInput
              label={t("resourceLabel")}
              placeholder={t("resourcePlaceholder")}
              value={form.resource}
              onChange={(e) => {
                const value = e.currentTarget.value.toLowerCase().replace(/\s+/g, "_");
                setForm((f) => ({ ...f, resource: value }));
              }}
              error={showErrors ? resourceError : null}
              required
              radius="md"
            />
            <Select
              label={t("actionLabel")}
              placeholder={t("actionPlaceholder")}
              data={[
                { value: "read", label: t("actionRead") },
                { value: "write", label: t("actionWrite") },
                { value: "delete", label: t("actionDelete") },
                { value: "approve", label: t("actionApprove") },
                { value: "assign", label: t("actionAssign") },
              ]}
              value={isActionValue(actionValue) ? actionValue : null}
              onChange={(value) => setForm((f) => ({ ...f, action: value ?? "" }))}
              error={showErrors ? actionError : null}
              required
              radius="md"
            />
          </Group>
          <Group grow>
            <Select
              label={t("effectLabel")}
              data={[
                { value: "Allow", label: t("effectAllow") },
                { value: "Deny", label: t("effectDeny") },
              ]}
              value={form.effect || null}
              onChange={(v) =>
                setForm((f) => ({ ...f, effect: v && v.length ? v : "Deny" }))
              }
              radius="md"
            />
            <Select
              label={t("subjectTypeLabel")}
              data={[
                { value: "User", label: "User" },
                { value: "Role", label: "Role" },
              ]}
              value={form.subjectType || null}
              onChange={(v) =>
                setForm((f) => ({
                  ...f,
                  subjectType: v === "Role" ? "Role" : "User",
                  subjectKey: "",
                }))
              }
              radius="md"
            />
          </Group>
          <Select
            label={t("subjectKeyLabel")}
            placeholder={t("subjectKeyPlaceholder")}
            data={subjectOptionsWithCurrent}
            value={form.subjectKey || null}
            onChange={(value) => setForm((f) => ({ ...f, subjectKey: value ?? "" }))}
            searchable
            nothingFoundMessage="No options"
            disabled={isRoleSubject ? isLoadingRoles : isLoadingUsers}
            required
            radius="md"
          />
          <Box>
            <Group justify="space-between" align="center" mb={6}>
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  {t("conditionLabel")}
                </Text>
                <Badge
                  color={
                    conditionStatus === "valid"
                      ? "teal"
                      : conditionStatus === "invalid"
                        ? "red"
                        : "gray"
                  }
                  variant={conditionStatus === "empty" ? "light" : "filled"}
                >
                  {conditionStatus === "valid"
                    ? t("conditionStatusValid")
                    : conditionStatus === "invalid"
                      ? t("conditionStatusInvalid")
                      : t("conditionStatusEmpty")}
                </Badge>
              </Group>
              <Group gap="xs">
                <Tooltip label={t("conditionHelpToggle")}>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setConditionHelpOpen((v) => !v)}
                    aria-label={t("conditionHelpToggle")}
                  >
                    <IconHelp size={18} />
                  </ActionIcon>
                </Tooltip>
                {conditionTab === "json" ? (
                  <Tooltip label={t("conditionPrettify")}>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={prettifyCondition}
                      disabled={!form.condition.trim().length}
                      aria-label={t("conditionPrettify")}
                    >
                      <IconCode size={18} />
                    </ActionIcon>
                  </Tooltip>
                ) : null}
                <Tooltip label={t("conditionClear")}>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={clearCondition}
                    disabled={!form.condition.trim().length && conditionRules.length === 0}
                    aria-label={t("conditionClear")}
                  >
                    <IconX size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <Collapse expanded={conditionHelpOpen}>
              <Alert color="gray" variant="light" radius="md" mb="xs">
                <Text size="sm">{t("conditionHelpText")}</Text>
                <Box mt="xs">
                  <Code block>
                    {
                      '{"all":[{"field":"isActive","operator":"eq","value":false}]}'
                    }
                  </Code>
                </Box>
                <Box mt="xs">
                  <Code block>
                    {
                      '{"any":[{"field":"role","operator":"eq","value":"Doctor"},{"field":"role","operator":"eq","value":"Nurse"}]}'
                    }
                  </Code>
                </Box>
              </Alert>
            </Collapse>

            <Tabs
              value={conditionTab}
              onChange={onConditionTabChange}
              variant="outline"
              radius="md"
            >
              <Tabs.List>
                <Tabs.Tab value="builder">{t("conditionTabBuilder")}</Tabs.Tab>
                <Tabs.Tab value="json">JSON</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="builder" pt="xs">
                <Stack gap="xs">
                  <Group grow>
                    <Select
                      label={t("conditionGroupTypeLabel")}
                      data={[
                        { value: "all", label: t("conditionTypeAll") },
                        { value: "any", label: t("conditionTypeAny") },
                      ]}
                      value={conditionType}
                      onChange={(v) => {
                        const nextType: ConditionType = v === "any" ? "any" : "all";
                        setConditionFromBuilder(nextType, conditionRules);
                      }}
                      radius="md"
                    />
                    <Box />
                  </Group>

                  {conditionRules.length === 0 ? (
                    <Alert color="gray" variant="light" radius="md">
                      <Text size="sm">{t("conditionEmptyHint")}</Text>
                    </Alert>
                  ) : null}

                  {conditionRules.map((rule, index) => (
                    <Group key={`${index}`} align="flex-end" wrap="nowrap">
                      <TextInput
                        label={index === 0 ? t("conditionFieldLabel") : undefined}
                        placeholder={t("conditionFieldPlaceholder")}
                        value={rule.field}
                        onChange={(e) =>
                          updateConditionRule(index, { field: e.currentTarget.value })
                        }
                        error={
                          showErrors && !rule.field.trim().length
                            ? t("conditionFieldRequired")
                            : null
                        }
                        radius="md"
                        style={{ flex: 1 }}
                      />
                      <Select
                        label={index === 0 ? t("conditionOperatorLabel") : undefined}
                        data={operatorOptions}
                        value={rule.operator || null}
                        onChange={(v) =>
                          updateConditionRule(index, { operator: v && v.length ? v : "" })
                        }
                        error={
                          showErrors && !rule.operator.trim().length
                            ? t("conditionOperatorRequired")
                            : null
                        }
                        radius="md"
                        style={{ width: 220 }}
                      />
                      <TextInput
                        label={index === 0 ? t("conditionValueLabel") : undefined}
                        placeholder={t("conditionValuePlaceholder")}
                        value={rule.valueText}
                        onChange={(e) =>
                          updateConditionRule(index, { valueText: e.currentTarget.value })
                        }
                        error={
                          showErrors && !rule.valueText.trim().length
                            ? t("conditionValueRequired")
                            : null
                        }
                        radius="md"
                        style={{ flex: 1 }}
                      />
                      <Tooltip label={t("conditionRemoveRule")}>
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => removeConditionRule(index)}
                          aria-label={t("conditionRemoveRule")}
                        >
                          <IconX size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  ))}

                  <Group justify="space-between" align="center">
                    <Button variant="light" radius="md" onClick={addConditionRule}>
                      {t("conditionAddRule")}
                    </Button>
                    <Text size="sm" c="dimmed">
                      {t("conditionValueHint")}
                    </Text>
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="json" pt="xs">
                <Textarea
                  placeholder={t("conditionPlaceholder")}
                  value={form.condition}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setForm((f) => ({ ...f, condition: value }));
                  }}
                  error={conditionInlineError}
                  autosize
                  minRows={4}
                  radius="md"
                />
              </Tabs.Panel>
            </Tabs>
          </Box>
          <Group grow>
            <NumberInput
              label={t("priorityLabel")}
              value={form.priority}
              onChange={(v) => setForm((f) => ({ ...f, priority: typeof v === "number" ? v : 0 }))}
              min={0}
              radius="md"
            />
            <Switch
              label={t("enabledLabel")}
              checked={form.isEnabled}
              onChange={(e) => {
                const checked = e.currentTarget.checked;
                setForm((f) => ({ ...f, isEnabled: checked }));
              }}
              mt="lg"
            />
          </Group>
          <Textarea
            label={t("descriptionLabel")}
            placeholder={t("descriptionPlaceholder")}
            value={form.description}
            minRows={2}
            radius="md"
            onChange={(e) => {
              const value = e.currentTarget.value;
              setForm((f) => ({ ...f, description: value }));
            }}
          />
          <Group justify="flex-end" wrap="wrap" gap="sm">
            <Button variant="default" radius="md" onClick={close} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button variant="light" radius="md" color="cyan" onClick={onValidate} disabled={isSubmitting}>
              {t("validate")}
            </Button>
            <Button radius="md" onClick={() => void submit()} disabled={!canSubmit || isSubmitting}>
              {t("save")}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={activeModal === "delete"}
        onClose={() => (!isSubmitting ? close() : undefined)}
        title={t("modalDeleteTitle")}
        centered
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm">
            {t("modalDeleteBody", {
              resource: selectedPolicy?.resource?.trim() || "—",
              action: selectedPolicy?.action?.trim() || "—",
            })}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button color="red" onClick={() => void onDelete()} disabled={isSubmitting || !selectedPolicy?.id}>
              {t("delete")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
