"use client";

import { accountingService } from "@/components/features/accounting/accounting-service";
import type { UpdateAccountingSettingsInput } from "@/modules/accounting/abstraction/schemas";
import {
  Button,
  Card,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/**
 * Admin form for accounting page announcement/settings (GET/PUT /api/accounting/settings).
 */
export function AccountingSettingsForm() {
  const t = useTranslations("admin.settings.accounting");
  const queryClient = useQueryClient();
  const [form, setForm] = useState<UpdateAccountingSettingsInput>({
    announcementTextAr: "",
    announcementTextEn: "",
    titleAr: "",
    titleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    isActive: true,
  });

  const settingsQuery = useQuery({
    queryKey: ["accounting-settings"],
    queryFn: () => accountingService.getSettings(),
  });

  useEffect(() => {
    if (settingsQuery.data) {
      const { announcementTextAr, announcementTextEn, titleAr, titleEn, descriptionAr, descriptionEn, isActive } =
        settingsQuery.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        announcementTextAr,
        announcementTextEn,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        isActive,
      });
    }
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () => accountingService.updateSettings(form),
    onSuccess: () => {
      notifications.show({ color: "green", message: t("saved") });
      void queryClient.invalidateQueries({ queryKey: ["accounting-settings"] });
    },
    onError: () => {
      notifications.show({ color: "red", message: t("loadError") });
    },
  });

  if (settingsQuery.isLoading) {
    return <Text>{t("saving")}</Text>;
  }

  if (settingsQuery.isError) {
    return <Text c="red">{t("loadError")}</Text>;
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Stack gap="md">
        <div>
          <Text fw={700} size="lg">
            {t("title")}
          </Text>
          <Text size="sm" c="dimmed">
            {t("subtitle")}
          </Text>
        </div>

        <TextInput
          label={t("announcementTextAr")}
          value={form.announcementTextAr}
          onChange={(e) =>
            setForm((f) => ({ ...f, announcementTextAr: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t("announcementTextEn")}
          value={form.announcementTextEn}
          onChange={(e) =>
            setForm((f) => ({ ...f, announcementTextEn: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t("titleAr")}
          value={form.titleAr}
          onChange={(e) =>
            setForm((f) => ({ ...f, titleAr: e.currentTarget.value }))
          }
        />
        <TextInput
          label={t("titleEn")}
          value={form.titleEn}
          onChange={(e) =>
            setForm((f) => ({ ...f, titleEn: e.currentTarget.value }))
          }
        />
        <Textarea
          label={t("descriptionAr")}
          minRows={3}
          value={form.descriptionAr}
          onChange={(e) =>
            setForm((f) => ({ ...f, descriptionAr: e.currentTarget.value }))
          }
        />
        <Textarea
          label={t("descriptionEn")}
          minRows={3}
          value={form.descriptionEn}
          onChange={(e) =>
            setForm((f) => ({ ...f, descriptionEn: e.currentTarget.value }))
          }
        />
        <Switch
          label={t("isActive")}
          checked={form.isActive}
          onChange={(e) =>
            setForm((f) => ({ ...f, isActive: e.currentTarget.checked }))
          }
        />

        <Group justify="flex-end">
          <Button
            loading={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending ? t("saving") : t("save")}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
