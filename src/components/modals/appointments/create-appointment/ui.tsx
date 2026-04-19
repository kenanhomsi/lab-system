"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlignLeft,
  IconCalendarPlus,
  IconClockHour4,
  IconHash,
  IconMapPin,
  IconMapPin2,
  IconStethoscope,
  IconTag,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { useMirror } from "./store";

const SectionHeader = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <Group align="flex-start" gap="sm">
    <ThemeIcon size={38} radius="md" variant="light" color="blue">
      {icon}
    </ThemeIcon>
    <Stack gap={2}>
      <Text fw={600}>{title}</Text>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </Stack>
  </Group>
);

const TOTAL_STEPS = 3;

const UI = () => {
  const t = useTranslations("admin.appointments");
  const tc = useTranslations("admin.common");

  const isOpen = useMirror("isOpen");
  const form = useMirror("form");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
  const submit = useMirror("submit");

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) setStep(0);
  }, [isOpen]);

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconCalendarPlus size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("createTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("createSubtitle")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={820}
      radius="xl"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
      styles={{
        content: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "light-dark(rgba(255,255,255,0.82), rgba(18,18,23,0.78))",
          border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
        body: { scrollbarWidth: "none", msOverflowStyle: "none" },
      }}
    >
      <Stack gap="lg">
        <Stepper active={step} size="sm" color="blue" mt="md">
          <Stepper.Step
            label={t("stepDetails")}
            description={t("stepDetailsDesc")}
          />
          <Stepper.Step
            label={t("stepLocation")}
            description={t("stepLocationDesc")}
          />
          <Stepper.Step
            label={t("stepAssignment")}
            description={t("stepAssignmentDesc")}
          />
        </Stepper>

        {step === 0 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconCalendarPlus size={18} />}
                title={t("stepDetailsSection")}
                description={t("stepDetailsSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <NumberInput
                  label={t("appointmentTypeId")}
                  placeholder={t("appointmentTypeIdPlaceholder")}
                  leftSection={<IconHash size={16} />}
                  value={form.appointmentTypeId}
                  onChange={(value) => updateField("appointmentTypeId", Number(value || 0))}
                  min={0}
                  required
                />
                <TextInput
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  leftSection={<IconTag size={16} />}
                  value={form.name}
                  onChange={(e) => updateField("name", e.currentTarget.value)}
                  required
                />
                <TextInput
                  label={t("slot")}
                  type="datetime-local"
                  leftSection={<IconClockHour4 size={16} />}
                  value={form.slot}
                  onChange={(e) => updateField("slot", e.currentTarget.value)}
                  required
                />
              </SimpleGrid>
              <Textarea
                label={t("descriptionField")}
                placeholder={t("descriptionPlaceholder")}
                leftSection={<IconAlignLeft size={16} />}
                value={form.description}
                onChange={(e) => updateField("description", e.currentTarget.value)}
                minRows={2}
                autosize
              />
              <Textarea
                label={t("notes")}
                placeholder={t("notesPlaceholder")}
                leftSection={<IconAlignLeft size={16} />}
                value={form.notes}
                onChange={(e) => updateField("notes", e.currentTarget.value)}
                minRows={2}
                autosize
              />
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconMapPin size={18} />}
                title={t("stepLocationSection")}
                description={t("stepLocationSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={t("locationType")}
                  placeholder={t("locationTypePlaceholder")}
                  leftSection={<IconMapPin2 size={16} />}
                  value={form.locationType}
                  onChange={(e) => updateField("locationType", e.currentTarget.value)}
                  required
                />
                <TextInput
                  label={t("address")}
                  placeholder={t("addressPlaceholder")}
                  leftSection={<IconMapPin size={16} />}
                  value={form.address}
                  onChange={(e) => updateField("address", e.currentTarget.value)}
                  required
                />
                <NumberInput
                  label={t("latitude")}
                  placeholder="0.000000"
                  value={form.latitude}
                  onChange={(value) => updateField("latitude", Number(value || 0))}
                  decimalScale={6}
                />
                <NumberInput
                  label={t("longitude")}
                  placeholder="0.000000"
                  value={form.longitude}
                  onChange={(value) => updateField("longitude", Number(value || 0))}
                  decimalScale={6}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        {step === 2 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconUsers size={18} />}
                title={t("stepAssignmentSection")}
                description={t("stepAssignmentSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <TextInput
                  label={t("patientId")}
                  placeholder={t("patientIdPlaceholder")}
                  leftSection={<IconUser size={16} />}
                  value={form.patientId}
                  onChange={(e) => updateField("patientId", e.currentTarget.value)}
                />
                <TextInput
                  label={t("doctorId")}
                  placeholder={t("doctorIdPlaceholder")}
                  leftSection={<IconStethoscope size={16} />}
                  value={form.doctorId}
                  onChange={(e) => updateField("doctorId", e.currentTarget.value)}
                />
                <TextInput
                  label={t("labPartnerId")}
                  placeholder={t("labPartnerIdPlaceholder")}
                  leftSection={<IconHash size={16} />}
                  value={form.labPartnerId}
                  onChange={(e) => updateField("labPartnerId", e.currentTarget.value)}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        <Group justify="space-between">
          <Button variant="subtle" color="gray" onClick={handleClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Group gap="sm">
            {step > 0 && (
              <Button
                variant="default"
                onClick={() => setStep((s) => s - 1)}
                disabled={isSubmitting}
              >
                {tc("back")}
              </Button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <Button radius="md" onClick={() => setStep((s) => s + 1)}>
                {tc("next")}
              </Button>
            ) : (
              <Button
                radius="md"
                onClick={submit}
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                {t("create")}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
