"use client";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";

import {
  Button,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
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
import { ReactNode, useState } from "react";
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
  const roleOptions = useMirror("roleOptions");
  const isLoadingRoles = useMirror("isLoadingRoles");
  const canSubmit = useMirror("canSubmit");
  const updateField = useMirror("updateField");
  const handleClose = useMirror("handleClose");
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
          <MutationErrorAlert />
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
        <MutationErrorAlert />
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
                <Select
                  label={t("roles")}
                  placeholder={t("rolesPlaceholder")}
                  description={t("rolesDescription")}
                  data={roleOptions}
                  searchable
                  clearable
                  nothingFoundMessage={t("noRolesFound")}
                  leftSection={<IconUsersGroup size={16} />}
                  value={form.roles[0] ?? null}
                  onChange={(value) => updateField("roles", value ? [value] : [])}
                  disabled={isLoadingRoles}
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
