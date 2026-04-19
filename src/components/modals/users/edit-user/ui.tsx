"use client";

import {
  Button,
  Group,
  Modal,
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
  IconEdit,
  IconIdBadge2,
  IconMail,
  IconMapPin,
  IconPhone,
  IconSparkles,
} from "@tabler/icons-react";
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
  const isOpen = useMirror("isOpen");
  const user = useMirror("user");
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
            <IconEdit size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>Edit User</Title>
            <Text size="sm" c="dimmed">
              Update profile details while keeping the existing account access intact.
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
            label="Account Overview"
            description="Review existing access"
          />
          <Stepper.Step
            label="Profile Details"
            description="Edit personal info"
          />
        </Stepper>

        {step === 0 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconSparkles size={18} />}
                title="Account Overview"
                description="Review the existing account information before saving profile updates."
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <TextInput
                  label="Email"
                  value={user?.email ?? ""}
                  readOnly
                  leftSection={<IconMail size={16} />}
                />
                <TextInput
                  label="Phone number"
                  placeholder="+20 100 000 0000"
                  leftSection={<IconPhone size={16} />}
                  value={form.phoneNumber}
                  onChange={(e) => updateField("phoneNumber", e.target.value)}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        )}

        {step === 1 && (
          <Paper withBorder radius="lg" p="md">
            <Stack gap="md">
              <SectionHeader
                icon={<IconIdBadge2 size={18} />}
                title="Profile Details"
                description="Edit the personal and operational information shown in the system."
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                <TextInput
                  label="Full name"
                  placeholder="Dr. Sarah Ahmed"
                  withAsterisk
                  leftSection={<IconIdBadge2 size={16} />}
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                />
                <TextInput
                  label="City"
                  placeholder="Cairo"
                  leftSection={<IconMapPin size={16} />}
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </SimpleGrid>
              <Textarea
                label="Profile metadata"
                placeholder='Optional notes or JSON, for example: {"department":"Cardiology"}'
                description="Use this for extra profile details when needed."
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
            Cancel
          </Button>
          <Group gap="sm">
            {step > 0 && (
              <Button
                variant="default"
                onClick={() => setStep((s) => s - 1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <Button radius="md" onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            ) : (
              <Button
                radius="md"
                onClick={submit}
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                Save changes
              </Button>
            )}
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
