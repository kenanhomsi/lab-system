"use client";

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
import { useMirror } from "../store";
import { CreateMedicalTestParams } from "@/modules/medical-tests/frontend/types";
import { MedicalTestItem } from "../types";
import {
  ParameterSchemaInput,
  parseParameterSchema,
  stringifyParameterSchema,
} from "@/modules/medical-tests/abstraction";
import { JsonbKeyValueEditor } from "@/components/ui/jsonb-key-value-editor";

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
    const TOTAL_STEPS = 2;
    const [nameAr, setNameAr] = useState(props.selected?.nameAr ?? "");
    const [nameEn, setNameEn] = useState(props.selected?.nameEn ?? "");
    const [price, setPrice] = useState<number>(props.selected?.price ?? 0);
    const [category, setCategory] = useState(props.selected?.category ?? "");
    const [sampleType, setSampleType] = useState(props.selected?.sampleType ?? "");
    const [parameterPairs, setParameterPairs] = useState<ParameterPair[]>(
      parseParameterPairs(props.selected?.parameterSchema ?? ""),
    );
    const [status, setStatus] = useState<string>(props.selected?.status ?? "active");
    const [step, setStep] = useState(0);

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
        category.trim().length > 0 &&
        sampleType.trim().length > 0 &&
        status.trim().length > 0
      );
    }, [nameAr, nameEn, price, category, sampleType, status]);

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
          category: category.trim(),
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
          id: String(id),
          nameAr: nameAr.trim(),
          nameEn: nameEn.trim(),
          price,
          category: category.trim(),
          sampleType: sampleType.trim(),
          parameterSchema: parameterSchemaModel,
          status: status.trim(),
        },
      });
      closeModal();
    };

    return (
      <Stack gap="lg">
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
            {props.mode === "create" ? "New test" : "Editing test"}
          </Badge>
          <Text size="sm" c="dimmed">
            Complete all required fields before saving
          </Text>
        </Group>

        <Stepper active={step} size="sm" color="blue" mt="xs">
          <Stepper.Step label="Details" description="General test info" />
          <Stepper.Step label="Schema" description="Parameters and preview" />
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
                    Test details
                  </Text>
                  <Text size="sm" c="dimmed">
                    Main information used across requests and reports
                  </Text>
                </Stack>
              </Group>

              <TextInput
                label="Name (Arabic)"
                placeholder="Enter Arabic name"
                leftSection={<IconTestPipe2 size={16} />}
                value={nameAr}
                onChange={(e) => setNameAr(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <TextInput
                label="Name (English)"
                placeholder="Enter English name"
                leftSection={<IconTestPipe2 size={16} />}
                value={nameEn}
                onChange={(e) => setNameEn(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <NumberInput
                label="Price"
                placeholder="0"
                leftSection={<IconCurrencyDollar size={16} />}
                value={price}
                onChange={(v) => setPrice(Number(v ?? 0))}
                min={0}
                size="md"
                radius="md"
                required
              />
              <TextInput
                label="Category"
                placeholder="e.g. Hematology"
                leftSection={<IconCategory size={16} />}
                value={category}
                onChange={(e) => setCategory(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <TextInput
                label="Sample type"
                placeholder="e.g. Blood"
                leftSection={<IconOval size={16} />}
                value={sampleType}
                onChange={(e) => setSampleType(e.currentTarget.value)}
                size="md"
                radius="md"
                required
              />
              <Select
                label="Status"
                value={status}
                onChange={(v) => setStatus(v ?? "active")}
                data={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                size="md"
                radius="md"
                required
              />
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="xl" p="lg" bg="light-dark(rgba(255,255,255,0.72), rgba(255,255,255,0.02))">
            <JsonbKeyValueEditor
              title="Parameter schema"
              description="Add key/value fields to generate JSON schema"
              pairs={parameterPairs}
              onPairsChange={setParameterPairs}
              keyLabel="Key"
              valueLabel="Value"
              keyPlaceholder="ex: normal_range"
              valuePlaceholder="ex: 3.5 - 5.5"
              previewLabel="Generated JSON preview"
              previewValue={parameterSchemaPreview}
            />
          </Paper>
        )}

        <Paper withBorder radius="xl" p="md" bg="light-dark(rgba(255,255,255,0.66), rgba(255,255,255,0.025))">
          <Group justify="space-between" align="center" gap="md" wrap="wrap">
            <Stack gap={2}>
              <Text fw={600}>
                {props.mode === "create" ? "Ready to create this test?" : "Ready to save changes?"}
              </Text>
              <Text size="sm" c="dimmed">
                Review details and submit when everything looks correct.
              </Text>
            </Stack>
            <Group justify="flex-end" gap="sm" wrap="nowrap" style={{ flex: 1 }}>
              <Button variant="default" radius="md" onClick={closeModal}>
                Cancel
              </Button>
              {step > 0 && (
                <Button
                  variant="default"
                  radius="md"
                  leftSection={<IconChevronLeft size={14} />}
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Back
                </Button>
              )}
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  radius="md"
                  rightSection={<IconChevronRight size={14} />}
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={!hasValidDetails}
                >
                  Next
                </Button>
              ) : (
                <Button
                  radius="md"
                  onClick={onSubmit}
                  disabled={!canSubmit || (props.mode === "edit" && !props.selected?.id)}
                >
                  {props.mode === "create" ? "Create" : "Save"}
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
                Create Medical Test
              </Title>
              <Text size="sm" c="dimmed" lh={1.45}>
                Add a new test with pricing and parameter schema details
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
            background: "transparent",
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
                Edit Medical Test
              </Title>
              <Text size="sm" c="dimmed" lh={1.45}>
                Update metadata, schema fields, and availability status
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
            background: "transparent",
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

      <Modal opened={activeModal === "delete"} onClose={closeModal} title="Delete Medical Test" centered>
        <Stack>
          <Text>
            Are you sure you want to delete{" "}
            <Text span fw={600}>
              {selected?.nameEn || selected?.nameAr || "this medical test"}
            </Text>
            ?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal}>
              Cancel
            </Button>
            <Button color="red" onClick={onDelete} disabled={!selected?.id}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
