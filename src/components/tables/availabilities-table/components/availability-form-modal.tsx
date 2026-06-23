"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCalendarTime, IconClock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import type { UpsertAvailabilityInput } from "@/modules/appointments";
import { useMirror } from "../store";
import type { AvailabilityRow } from "../types";
import { DAY_KEYS } from "../utils/format";

type Props = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  availability?: AvailabilityRow | null;
};

type FormFields = Omit<UpsertAvailabilityInput, "userId">;

const emptyForm = (): FormFields => ({
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "17:00",
  slotDuration: 30,
  isActive: true,
});

/**
 * Create/edit form modal for blood draw availability slots.
 */
const AvailabilityFormModal = ({ mode, isOpen, onClose, availability }: Props) => {
  const t = useTranslations("admin.availabilities");
  const tc = useTranslations("admin.common");
  const createAvailability = useMirror("createAvailability");
  const updateAvailability = useMirror("updateAvailability");

  const [form, setForm] = useState<FormFields>(emptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && availability) {
      setForm({
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        slotDuration: availability.slotDuration,
        isActive: availability.isActive,
      });
      return;
    }
    setForm(emptyForm());
  }, [availability, isOpen, mode]);

  const dayOptions = useMemo(
    () =>
      DAY_KEYS.map((key, index) => ({
        value: String(index),
        label: t(`days.${key}`),
      })),
    [t],
  );

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.startTime.trim() || !form.endTime.trim()) {
      return;
    }
    if (mode === "edit" && !availability) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: UpsertAvailabilityInput = { ...form, userId: null };
      if (mode === "create") {
        await createAvailability(payload);
      } else if (availability) {
        await updateAvailability({ ...payload, id: availability.id });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(form.startTime.trim() && form.endTime.trim() && !isSubmitting);

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="teal">
            <IconCalendarTime size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {mode === "create" ? t("modalCreateTitle") : t("modalEditTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {mode === "create" ? t("modalCreateDescription") : t("modalEditDescription")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={640}
      radius="lg"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <Paper withBorder radius="lg" p="md">
          <Stack gap="md">
            <Select
              label={t("dayLabel")}
              data={dayOptions}
              value={String(form.dayOfWeek)}
              onChange={(value) => setForm({ ...form, dayOfWeek: Number(value ?? 0) })}
              allowDeselect={false}
              required
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput
                label={t("startTimeLabel")}
                placeholder="09:00"
                leftSection={<IconClock size={16} />}
                value={form.startTime}
                onChange={(event) => setForm({ ...form, startTime: event.currentTarget.value })}
                required
              />
              <TextInput
                label={t("endTimeLabel")}
                placeholder="17:00"
                leftSection={<IconClock size={16} />}
                value={form.endTime}
                onChange={(event) => setForm({ ...form, endTime: event.currentTarget.value })}
                required
              />
            </SimpleGrid>
            <NumberInput
              label={t("slotDurationLabel")}
              description={t("slotDurationDescription")}
              min={5}
              max={240}
              step={5}
              suffix={` ${t("minutesShort")}`}
              value={form.slotDuration}
              onChange={(value) =>
                setForm({
                  ...form,
                  slotDuration: typeof value === "number" ? value : 30,
                })
              }
              required
            />
            <Switch
              label={t("activeLabel")}
              description={t("activeDescription")}
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.currentTarget.checked })}
            />
          </Stack>
        </Paper>
        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button color="teal" onClick={handleSubmit} loading={isSubmitting} disabled={!canSubmit}>
            {mode === "create" ? tc("create") : tc("save")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { AvailabilityFormModal };
