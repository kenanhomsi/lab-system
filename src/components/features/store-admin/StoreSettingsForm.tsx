"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  Button,
  Group,
  NumberInput,
  Paper,
  Skeleton,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { storeService } from "@/components/features/store";
import type { StoreSettings, UpdateStoreSettingsInput } from "@/modules/store/abstraction/schemas";

function settingsToForm(data: StoreSettings): UpdateStoreSettingsInput {
  return {
    announcementHeader: data.announcementHeader,
    serviceTitle: data.serviceTitle,
    serviceDescription: data.serviceDescription,
    deliveryFee: data.deliveryFee,
    deliveryDurationText: data.deliveryDurationText,
    cashOnDeliveryEnabled: data.cashOnDeliveryEnabled,
    onlinePaymentEnabled: data.onlinePaymentEnabled,
  };
}

type SettingsFieldsProps = {
  initial: UpdateStoreSettingsInput;
};

function SettingsFields({ initial }: SettingsFieldsProps) {
  const t = useTranslations("labStore.admin");
  const queryClient = useQueryClient();
  const [form, setForm] = useState(initial);

  const saveMutation = useMutation({
    mutationFn: () => storeService.updateSettings(form),
    onSuccess: () => {
      notifications.show({ title: t("saved"), message: t("settingsUpdated"), color: "green" });
      void queryClient.invalidateQueries({ queryKey: ["store", "admin", "settings"] });
    },
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} fw={700}>
          {t("settingsLabel")}
        </Title>
        <Text size="sm" c="dimmed" mt={4}>
          {t("settingsDesc")}
        </Text>
      </div>
      <MutationErrorAlert />
      <TextInput
        label={t("announcementHeader")}
        value={form.announcementHeader}
        onChange={(e) => setForm((f) => ({ ...f, announcementHeader: e.currentTarget.value }))}
      />
      <TextInput
        label={t("serviceTitle")}
        value={form.serviceTitle}
        onChange={(e) => setForm((f) => ({ ...f, serviceTitle: e.currentTarget.value }))}
      />
      <Textarea
        label={t("serviceDescription")}
        value={form.serviceDescription}
        onChange={(e) => setForm((f) => ({ ...f, serviceDescription: e.currentTarget.value }))}
        minRows={3}
      />
      <NumberInput
        label={t("deliveryFee")}
        value={form.deliveryFee}
        onChange={(v) => setForm((f) => ({ ...f, deliveryFee: Number(v) || 0 }))}
        min={0}
        decimalScale={2}
      />
      <TextInput
        label={t("deliveryDurationText")}
        value={form.deliveryDurationText}
        onChange={(e) => setForm((f) => ({ ...f, deliveryDurationText: e.currentTarget.value }))}
      />
      <Switch
        label={t("cashOnDeliveryEnabled")}
        checked={form.cashOnDeliveryEnabled}
        onChange={(e) => setForm((f) => ({ ...f, cashOnDeliveryEnabled: e.currentTarget.checked }))}
      />
      <Switch
        label={t("onlinePaymentEnabled")}
        checked={form.onlinePaymentEnabled}
        onChange={(e) => setForm((f) => ({ ...f, onlinePaymentEnabled: e.currentTarget.checked }))}
      />
      <Group justify="flex-end">
        <Button color="teal" loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
          {t("save")}
        </Button>
      </Group>
    </Stack>
  );
}

/**
 * Structured form for editing store-wide settings (replaces raw JSON editor).
 */
export function StoreSettingsForm() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["store", "admin", "settings"],
    queryFn: () => storeService.getSettings(),
  });

  if (isError) {
    return null;
  }

  if (isLoading || !data) {
    return (
      <Paper withBorder radius="lg" p="lg">
        <Stack gap="md">
          <Skeleton height={28} width="40%" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={40} radius="md" />
          ))}
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="lg" p="lg">
      <SettingsFields key={data.id} initial={settingsToForm(data)} />
    </Paper>
  );
}
