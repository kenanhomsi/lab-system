"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import {
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconCurrencyDollar,
  IconFlask,
  IconPackage,
  IconTag,
  IconTarget,
  IconToggleRight,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { TargetAudience } from "@/components/tables/subscription-packages-table/types";
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
    <ThemeIcon size={38} radius="md" variant="light" color="indigo">
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

const TOTAL_STEPS = 2;

const UI = () => {
  const t = useTranslations("admin.subscriptions");
  const tc = useTranslations("admin.common");

  const isOpen = useMirror("isOpen");
  const subscriptionPackage = useMirror("subscriptionPackage");
  const form = useMirror("form");
  const audienceOptions = useMirror("audienceOptions");
  const isSubmitting = useMirror("isSubmitting");
  const canSubmit = useMirror("canSubmit");
  const handleClose = useMirror("handleClose");
  const updateField = useMirror("updateField");
  const submit = useMirror("submit");

  const [step, setStep] = useState(0);
  const close = () => {
    setStep(0);
    handleClose();
  };

  return (
    <Modal
      opened={isOpen}
      onClose={close}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="indigo">
            <IconPackage size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {subscriptionPackage ? t("editTitle") : t("createModalTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {subscriptionPackage
                ? t("editModalSubtitle")
                : t("createModalSubtitle")}
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
          <MutationErrorAlert />
        <Stepper active={step} size="sm" color="indigo" mt="md">
          <Stepper.Step
            label={t("stepPackageInfo")}
            description={t("stepPackageInfoDesc")}
          />
          <Stepper.Step
            label={t("stepPricing")}
            description={t("stepPricingDesc")}
          />
        </Stepper>

        {step === 0 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
        <MutationErrorAlert />
              <SectionHeader
                icon={<IconPackage size={18} />}
                title={t("packageInfoSection")}
                description={t("packageInfoSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label={t("name")}
                  placeholder={t("namePlaceholder")}
                  leftSection={<IconTag size={16} />}
                  value={form.name}
                  onChange={(e) => updateField("name", e.currentTarget.value)}
                  required
                />
                <TextInput
                  label={t("includedTests")}
                  placeholder={t("includedTestsPlaceholder")}
                  leftSection={<IconFlask size={16} />}
                  value={form.includedTests}
                  onChange={(e) => updateField("includedTests", e.currentTarget.value)}
                  required
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
        <MutationErrorAlert />
              <SectionHeader
                icon={<IconCurrencyDollar size={18} />}
                title={t("stepPricing")}
                description={t("pricingSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <NumberInput
                  label={t("price")}
                  placeholder={t("pricePlaceholder")}
                  leftSection={<IconCurrencyDollar size={16} />}
                  value={form.price}
                  min={0}
                  onChange={(value) => updateField("price", Number(value || 0))}
                  required
                />
                <NumberInput
                  label={t("validityDays")}
                  placeholder={t("validityDaysPlaceholder")}
                  leftSection={<IconCalendarTime size={16} />}
                  value={form.validityDays}
                  min={0}
                  onChange={(value) => updateField("validityDays", Number(value || 0))}
                  required
                />
                <Select
                  label={t("targetAudience")}
                  leftSection={<IconTarget size={16} />}
                  value={form.targetAudience}
                  onChange={(value) =>
                    updateField("targetAudience", (value as TargetAudience) || "All")
                  }
                  data={audienceOptions.map((audience) => ({
                    value: audience,
                    label: audience,
                  }))}
                  required
                />
                <Group align="flex-end" pb={4}>
                  <IconToggleRight size={16} color="var(--mantine-color-indigo-6)" />
                  <Checkbox
                    label={tc("active")}
                    checked={form.isActive}
                    onChange={(e) => updateField("isActive", e.currentTarget.checked)}
                  />
                </Group>
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        <Group justify="space-between">
          <Button variant="subtle" color="gray" onClick={close} disabled={isSubmitting}>
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
              <Button radius="md" color="indigo" onClick={() => setStep((s) => s + 1)}>
                {tc("next")}
              </Button>
            ) : (
              <Button
                radius="md"
                color="indigo"
                onClick={submit}
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                {tc("save")}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
