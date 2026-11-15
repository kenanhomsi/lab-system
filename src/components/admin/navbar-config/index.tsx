"use client";

import { useEffect, useState } from "react";
import { Alert, Badge, Button, Group, Loader, Stack, Switch, Table, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import {
  DEFAULT_NAVBAR_CONFIG,
  NAVBAR_GROUP_CHILDREN,
  normalizeNavbarConfig,
  validateNavbarConfig,
  type NavbarConfig,
  type NavbarItemKey,
} from "@/lib/navbar-config/types";

const ENDPOINT = "/api/admin/navbar-config";

const CHILD_KEYS = new Set<NavbarItemKey>(Object.values(NAVBAR_GROUP_CHILDREN).flat());

/** Admin panel to rename or hide fixed website navbar entries (links never change). */
export function NavbarConfigPanel() {
  const t = useTranslations("admin.settings.navbarConfig");
  const [config, setConfig] = useState<NavbarConfig>(DEFAULT_NAVBAR_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("load"))))
      .then((data) => {
        if (!cancelled) setConfig(normalizeNavbarConfig(data));
      })
      .catch(() => {
        notifications.show({ color: "red", message: t("loadError") });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  const update = (key: NavbarItemKey, patch: Partial<NavbarConfig["items"][number]>) =>
    setConfig((prev) => ({
      items: prev.items.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    }));

  const validationError = validateNavbarConfig(config);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("save");
      setConfig(normalizeNavbarConfig(await res.json()));
      notifications.show({ color: "teal", message: t("saved") });
    } catch {
      notifications.show({ color: "red", message: t("saveError") });
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    setSaving(true);
    try {
      const res = await fetch(ENDPOINT, { method: "DELETE" });
      if (!res.ok) throw new Error("reset");
      setConfig(normalizeNavbarConfig(await res.json()));
      notifications.show({ color: "teal", message: t("resetDone") });
    } catch {
      notifications.show({ color: "red", message: t("saveError") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader size="sm" />;

  return (
    <Stack gap="md">
      <div>
        <Text fw={700}>{t("title")}</Text>
        <Text c="dimmed" size="sm">
          {t("description")}
        </Text>
      </div>

      {validationError ? <Alert color="red">{t("atLeastOne")}</Alert> : null}

      <Table withTableBorder verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("colItem")}</Table.Th>
            <Table.Th>{t("colLabelAr")}</Table.Th>
            <Table.Th>{t("colLabelEn")}</Table.Th>
            <Table.Th>{t("colVisible")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {config.items.map((item) => {
            const isChild = CHILD_KEYS.has(item.key);
            return (
              <Table.Tr key={item.key}>
                <Table.Td>
                  <Group gap="xs">
                    <Text size="sm" fw={isChild ? 400 : 600} ps={isChild ? "md" : 0}>
                      {t(`items.${item.key}`)}
                    </Text>
                    {isChild ? (
                      <Badge size="xs" variant="light">
                        {t("subItem")}
                      </Badge>
                    ) : null}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <TextInput
                    size="xs"
                    maxLength={60}
                    placeholder={t("defaultLabel")}
                    value={item.labelAr}
                    onChange={(e) => update(item.key, { labelAr: e.currentTarget.value })}
                  />
                </Table.Td>
                <Table.Td>
                  <TextInput
                    size="xs"
                    maxLength={60}
                    placeholder={t("defaultLabel")}
                    value={item.labelEn}
                    onChange={(e) => update(item.key, { labelEn: e.currentTarget.value })}
                  />
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={item.visible}
                    onChange={(e) => update(item.key, { visible: e.currentTarget.checked })}
                    aria-label={t("colVisible")}
                  />
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <Text size="xs" c="dimmed">
        {t("note")}
      </Text>

      <Group>
        <Button onClick={save} loading={saving} disabled={Boolean(validationError)}>
          {t("save")}
        </Button>
        <Button variant="default" onClick={reset} disabled={saving}>
          {t("reset")}
        </Button>
      </Group>
    </Stack>
  );
}
