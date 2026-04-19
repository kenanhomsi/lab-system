"use client";

import {
  Button,
  Group,
  Modal,
  Paper,
  PasswordInput,
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
  IconIdBadge2,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
  IconUserPlus,
  IconUsersGroup,
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

const TOTAL_STEPS = 2;

const UI = () => {
  const t = useTranslations("admin.users");
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
            <IconUserPlus size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("createModalTitle")}</Title>
            <Text size="sm" c="dimmed">
              {t("createModalSubtitle")}
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
            label={t("stepAccount")}
            description={t("stepAccountDesc")}
          />
          <Stepper.Step
            label={t("stepProfile")}
            description={t("stepProfileDesc")}
          />
        </Stepper>

        {step === 0 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconLock size={18} />}
                title={t("stepAccountSection")}
                description={t("stepAccountSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <TextInput
                  label={t("email")}
                  placeholder={t("emailPlaceholder")}
                  type="email"
                  withAsterisk
                  leftSection={<IconMail size={16} />}
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
                <PasswordInput
                  label={t("password")}
                  placeholder={t("passwordPlaceholder")}
                  withAsterisk
                  leftSection={<IconLock size={16} />}
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                />
                <TextInput
                  label={t("roles")}
                  placeholder={t("rolesPlaceholder")}
                  description={t("rolesDescription")}
                  leftSection={<IconUsersGroup size={16} />}
                  value={form.roles.join(", ")}
                  onChange={(e) =>
                    updateField(
                      "roles",
                      e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconSparkles size={18} />}
                title={t("stepProfileSection")}
                description={t("stepProfileSectionDesc")}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <TextInput
                  label={t("fullName")}
                  placeholder={t("fullNamePlaceholder")}
                  withAsterisk
                  leftSection={<IconIdBadge2 size={16} />}
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <TextInput
                  label={t("phoneNumberLabel")}
                  placeholder={t("phoneNumberPlaceholder")}
                  leftSection={<IconPhone size={16} />}
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                />
                <TextInput
                  label={t("city")}
                  placeholder={t("cityPlaceholder")}
                  leftSection={<IconMapPin size={16} />}
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </SimpleGrid>
              <Textarea
                label={t("profileMetadataLabel")}
                placeholder={t("profileMetadataPlaceholder")}
                description={t("profileMetadataDescription")}
                autosize
                minRows={3}
                value={form.profileMetadata}
                onChange={(e) => updateField("profileMetadata", e.target.value)}
              />
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
                {t("createUser")}
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
