"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import {
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  Stepper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCategory,
  IconCurrencyDollar,
  IconFlask,
  IconTestPipe2,
  IconOval,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { frontendContainer } from "@/container";
import { useMirror } from "../store";
import { CreateMedicalTestParams } from "@/modules/medical-tests/frontend/types";
import {
  MedicalTestCategoryFrontendService,
  medicalTestCategoryModuleNames,
} from "@/modules/medical-test-categories";
import { MedicalTestItem } from "../types";
import {
  ParameterSchemaInput,
  parseParameterSchema,
  stringifyParameterSchema,
} from "@/modules/medical-tests/abstraction";
import { JsonbKeyValueEditor } from "@/components/ui/jsonb-key-value-editor";

const categoryService = frontendContainer.get<MedicalTestCategoryFrontendService>(
  medicalTestCategoryModuleNames.service,
);

type ParameterPair = {
  id: string;
  key: string;
  value: string;
};

const createParameterPair = (): ParameterPair => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  key: "",
  value: "",
});

const parseParameterPairs = (schema: ParameterSchemaInput): ParameterPair[] => {
  const normalized = parseParameterSchema(schema);

  if (Array.isArray(normalized)) {
    const fromAdvanced = normalized
      .map((field) => ({
        id: createParameterPair().id,
        key: field.key,
        value:
          field.value == null
            ? ""
            : typeof field.value === "string"
              ? field.value
              : String(field.value),
      }))
      .filter((row) => row.key.trim().length > 0);

    return fromAdvanced.length > 0 ? fromAdvanced : [createParameterPair()];
  }

  const fromFlat = Object.entries(normalized)
    .map(([key, value]) => ({
      id: createParameterPair().id,
      key,
      value: value == null ? "" : String(value),
    }))
    .filter((row) => row.key.trim().length > 0);

  return fromFlat.length > 0 ? fromFlat : [createParameterPair()];
};

const buildParameterSchemaModel = (pairs: ParameterPair[]): Record<string, string> => {
  return pairs.reduce<Record<string, string>>((acc, pair) => {
    const trimmedKey = pair.key.trim();
    if (!trimmedKey) return acc;
    acc[trimmedKey] = pair.value.trim();
    return acc;
  }, {});
};

const Modals = () => {
  const t = useTranslations("admin.medicalTests");
  const tc = useTranslations("admin.common");
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const closeModal = () => setActiveModal(null);
  const selectedMedicalTest = useMirror("selectedMedicalTest");
  const createMutation = useMirror("createMutation") as {
    mutateAsync: (data: CreateMedicalTestParams) => Promise<unknown>;
  };
  const updateMutation = useMirror("updateMutation") as {
    mutateAsync: (params: { id: string; data: unknown }) => Promise<unknown>;
  };
  const deleteMutation = useMirror("deleteMutation") as {
    mutateAsync: (id: string) => Promise<unknown>;
  };

  const selected = selectedMedicalTest as MedicalTestItem | null;

  const Form = (props: { mode: "create" | "edit"; selected: MedicalTestItem | null }) => {
    const tm = useTranslations("admin.medicalTests");
    const tcForm = useTranslations("admin.common");
    const TOTAL_STEPS = 2;
    const [nameAr, setNameAr] = useState(props.selected?.nameAr ?? "");
    const [nameEn, setNameEn] = useState(props.selected?.nameEn ?? "");
    const [price, setPrice] = useState<number>(props.selected?.price ?? 0);
    const [categoryMedicalId, setCategoryMedicalId] = useState<string>(
      props.selected?.categoryMedicalId ? String(props.selected.categoryMedicalId) : "",
    );
    const [sampleType, setSampleType] = useState(props.selected?.sampleType ?? "");
    const [parameterPairs, setParameterPairs] = useState<ParameterPair[]>(
      parseParameterPairs(props.selected?.parameterSchema ?? ""),
    );
    const [status, setStatus] = useState<string>(() => {
      const raw = (props.selected?.status ?? "active").trim();
      const lower = raw.toLowerCase();
      return lower === "inactive" ? "inactive" : "active";
    });
    const [step, setStep] = useState(0);
    const { data: categories = [], isPending: isCategoriesPending } = useQuery({
      queryKey: ["medical-test-categories", "all"],
      queryFn: () => categoryService.listAll(),
      staleTime: 1000 * 60,
    });
    const categoryOptions = useMemo(
      () =>
        categories
          .filter((category) => category.isActive || String(category.id) === categoryMedicalId)
          .sort((a, b) => a.displayOrder - b.displayOrder || a.nameEn.localeCompare(b.nameEn))
          .map((category) => ({
            value: String(category.id),
            label: `${category.nameAr} / ${category.nameEn}`,
          })),
      [categories, categoryMedicalId],
    );

    const parameterSchemaModel = useMemo(
      () => buildParameterSchemaModel(parameterPairs),
      [parameterPairs],
    );
    const parameterSchemaPreview = useMemo(
      () => stringifyParameterSchema(parameterSchemaModel),
      [parameterSchemaModel],
    );
    const hasValidParameterSchema = useMemo(
      () => parameterPairs.some((pair) => pair.key.trim().length > 0),
      [parameterPairs],
    );
    const hasValidDetails = useMemo(() => {
      return (
        nameAr.trim().length > 0 &&
        nameEn.trim().length > 0 &&
        Number.isFinite(price) &&
        price >= 0 &&
        Number.isFinite(Number(categoryMedicalId)) &&
        Number(categoryMedicalId) > 0 &&
        sampleType.trim().length > 0 &&
        status.trim().length > 0
      );
    }, [nameAr, nameEn, price, categoryMedicalId, sampleType, status]);

    const canSubmit = useMemo(() => {
      return hasValidDetails && hasValidParameterSchema;
    }, [hasValidDetails, hasValidParameterSchema]);

    useEffect(() => {
      setStep(0);
    }, [props.mode, props.selected?.id]);

    const onSubmit = async () => {
      if (!canSubmit) return;

      if (props.mode === "create") {
        await createMutation.mutateAsync({
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          price,
          categoryMedicalId: Number(categoryMedicalId),
          sampleType: sampleType.trim(),
          parameterSchema: parameterSchemaModel,
          status: status.trim(),
        });
        closeModal();
        return;
      }

      const id = props.selected?.id;
      if (!id) return;
      await updateMutation.mutateAsync({
        id: String(id),
        data: {
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          price,
          categoryMedicalId: Number(categoryMedicalId),
          sampleType: sampleType.trim(),
          parameterSchema: parameterSchemaModel,
          status: status.trim(),
        },
      });
      closeModal();
    };

    return (
      <Stack gap="lg">
          <MutationErrorAlert />
        <Group
          justify="space-between"
          align="center"
          gap="sm"
          wrap="wrap"
          p="sm"
          style={{
            borderRadius: "var(--mantine-radius-lg)",
            background: "light-dark(rgba(37,99,235,0.06), rgba(59,130,246,0.08))",
          }}
        >
          <Badge variant="light" color="blue" radius="sm">
            {props.mode === "create" ? tm("badgeNew") : tm("badgeEditing")}
          </Badge>
          <Text size="sm" c="dimmed">
            {tm("completeRequiredHint")}
          </Text>
        </Group>

        <Stepper active={step} size="sm" color="blue" mt="xs">
          <Stepper.Step label={tm("stepDetails")} description={tm("stepDetailsDesc")} />
          <Stepper.Step label={tm("stepSchema")} description={tm("stepSchemaDesc")} />
        </Stepper>

        {step === 0 && (
          <Paper withBorder radius="xl" p="lg" bg="light-dark(rgba(255,255,255,0.78), rgba(255,255,255,0.03))">
            <Stack gap="lg">
              <Group align="flex-start" gap="sm" wrap="nowrap">
                <ThemeIcon size={44} radius="lg" variant="light" color="blue">
                  <IconFlask size={20} />
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text fw={700} size="lg">
                    {tm("sectionTestDetails")}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {tm("sectionTestDetailsDesc")}
                  </Text>
                </Stack>
              </Group>

              <TextInput
                label={tm("nameArLabel")}
                placeholder={tm("nameArPlaceholder")}
                leftSection={<IconTestPipe2 size={16} />}
                value={nameAr}
                onChange={(e) => setNameAr(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <TextInput
                label={tm("nameEnLabel")}
                placeholder={tm("nameEnPlaceholder")}
                leftSection={<IconTestPipe2 size={16} />}
                value={nameEn}
                onChange={(e) => setNameEn(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <NumberInput
                label={tm("priceLabel")}
                placeholder={tm("pricePlaceholder")}
                leftSection={<IconCurrencyDollar size={16} />}
                value={price}
                onChange={(v) => setPrice(Number(v ?? 0))}
                min={0}
                size="md"
                radius="md"
                required
              />
              <Select
                label={tm("categoryLabel")}
                placeholder={tm("categorySelectPlaceholder")}
                leftSection={<IconCategory size={16} />}
                value={categoryMedicalId}
                onChange={(value) => setCategoryMedicalId(value ?? "")}
                data={categoryOptions}
                searchable
                nothingFoundMessage={tm("categoryNothingFound")}
                disabled={isCategoriesPending}
                size="md"
                radius="md"
                required
              />
              {props.selected?.category && !props.selected?.categoryMedicalId ? (
                <Text size="xs" c="dimmed">
                  {tm("legacyCategoryHint", { category: props.selected.category })}
                </Text>
              ) : null}
              <TextInput
                label={tm("sampleTypeLabel")}
                placeholder={tm("sampleTypePlaceholder")}
                leftSection={<IconOval size={16} />}
                value={sampleType}
                onChange={(e) => setSampleType(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              {props.mode === "edit" && (
                <Select
                  label={tm("statusLabel")}
                  value={status}
                  onChange={(v) => setStatus(v ?? "active")}
                  data={[
                    { value: "active", label: tm("statusActive") },
                    { value: "inactive", label: tm("statusInactive") },
                  ]}
                  size="md"
                  radius="md"
                  required
                />
              )}
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="xl" p="lg" bg="light-dark(rgba(255,255,255,0.72), rgba(255,255,255,0.02))">
            <JsonbKeyValueEditor
              title={tm("parameterSchemaTitle")}
              description={tm("parameterSchemaDesc")}
              pairs={parameterPairs}
              onPairsChange={setParameterPairs}
              keyLabel={tm("keyLabel")}
              valueLabel={tm("valueLabel")}
              keyPlaceholder={tm("keyPlaceholder")}
              valuePlaceholder={tm("valuePlaceholder")}
              previewLabel={tm("previewLabel")}
              previewValue={parameterSchemaPreview}
            />
          </Paper>
        )}

        <Paper withBorder radius="xl" p="md" bg="light-dark(rgba(255,255,255,0.66), rgba(255,255,255,0.025))">
          <Group justify="space-between" align="center" gap="md" wrap="wrap">
            <Stack gap={2}>
              <Text fw={600}>
                {props.mode === "create" ? tm("readyCreateTitle") : tm("readySaveTitle")}
              </Text>
              <Text size="sm" c="dimmed">
                {tm("readySubtitle")}
              </Text>
            </Stack>
            <Group justify="flex-end" gap="sm" wrap="nowrap" style={{ flex: 1 }}>
              <Button variant="default" radius="md" onClick={closeModal}>
                {tcForm("cancel")}
              </Button>
              {step > 0 && (
                <Button
                  variant="default"
                  radius="md"
                  leftSection={<IconChevronLeft size={14} />}
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  {tcForm("back")}
                </Button>
              )}
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  radius="md"
                  rightSection={<IconChevronRight size={14} />}
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={!hasValidDetails}
                >
                  {tcForm("next")}
                </Button>
              ) : (
                <Button
                  radius="md"
                  onClick={onSubmit}
                  disabled={!canSubmit || (props.mode === "edit" && !props.selected?.id)}
                >
                  {props.mode === "create" ? tcForm("create") : tcForm("save")}
                </Button>
              )}
            </Group>
          </Group>
        </Paper>
      </Stack>
    );
  };

  const onDelete = async () => {
    const id = selected?.id;
    if (!id) return;
    await deleteMutation.mutateAsync(String(id));
    closeModal();
  };

  return (
    <>
      <Modal
        opened={activeModal === "create"}
        onClose={closeModal}
        title={
          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
            <ThemeIcon size={46} radius="lg" variant="light" color="blue">
              <IconFlask size={22} />
            </ThemeIcon>
            <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
              <Title order={4} lh={1.2}>
                {t("modalCreateTitle")}
              </Title>
              <Text size="sm" c="dimmed" lh={1.45}>
                {t("modalCreateSubtitle")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size="lg"
        radius="xl"
        padding={0}
        styles={{
          content: {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
            border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          header: {
            borderBottom: "1px solid light-dark(rgba(15,23,42,0.06), rgba(255,255,255,0.07))",
            padding: "var(--mantine-spacing-lg)",
            paddingBottom: "var(--mantine-spacing-md)",
          },
          title: { flex: 1 },
          body: {
            padding: "var(--mantine-spacing-lg)",
            paddingTop: "var(--mantine-spacing-md)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        <Form key="create" mode="create" selected={null} />
      </Modal>

      <Modal
        opened={activeModal === "edit"}
        onClose={closeModal}
        title={
          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
            <ThemeIcon size={46} radius="lg" variant="light" color="blue">
              <IconFlask size={22} />
            </ThemeIcon>
            <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
              <Title order={4} lh={1.2}>
                {t("modalEditTitle")}
              </Title>
              <Text size="sm" c="dimmed" lh={1.45}>
                {t("modalEditSubtitle")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size="lg"
        radius="xl"
        padding={0}
        styles={{
          content: {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
            border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
            boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          header: {
            borderBottom: "1px solid light-dark(rgba(15,23,42,0.06), rgba(255,255,255,0.07))",
            padding: "var(--mantine-spacing-lg)",
            paddingBottom: "var(--mantine-spacing-md)",
          },
          title: { flex: 1 },
          body: {
            padding: "var(--mantine-spacing-lg)",
            paddingTop: "var(--mantine-spacing-md)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        }}
      >
        <Form key={selected?.id ?? "edit"} mode="edit" selected={selected} />
      </Modal>

      <Modal opened={activeModal === "delete"} onClose={closeModal} title={t("deleteModalTitle")} centered>
        <Stack>
          <MutationErrorAlert />
          <Text size="sm" dir="auto">
            {t("deleteConfirmMessage", {
              name:
                selected?.nameEn?.trim() ||
                selected?.nameAr?.trim() ||
                t("deleteFallbackTest"),
            })}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal}>
              {tc("cancel")}
            </Button>
            <Button color="red" onClick={onDelete} disabled={!selected?.id}>
              {tc("delete")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
