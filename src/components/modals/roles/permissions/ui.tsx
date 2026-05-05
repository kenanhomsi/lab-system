"use client";

import {
  Badge,
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconSearch, IconShieldCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.settings.roles");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const role = useMirror("role");
  const search = useMirror("search");
  const setSearch = useMirror("setSearch");
  const checkedIds = useMirror("checkedIds");
  const filteredPermissions = useMirror("filteredPermissions");
  const isCatalogLoading = useMirror("isCatalogLoading");
  const isRolePermissionsLoading = useMirror("isRolePermissionsLoading");
  const isSubmitting = useMirror("isSubmitting");
  const hasChanges = useMirror("hasChanges");
  const toggle = useMirror("toggle");
  const selectAll = useMirror("selectAll");
  const clearAll = useMirror("clearAll");
  const submit = useMirror("submit");

  const isLoading = isCatalogLoading || isRolePermissionsLoading;
  const checkedSet = new Set(checkedIds);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
          <ThemeIcon size={46} radius="lg" variant="light" color="violet">
            <IconShieldCheck size={22} />
          </ThemeIcon>
          <Stack gap={3} style={{ flex: 1, minWidth: 0 }}>
            <Title order={4} lh={1.2}>
              {t("permissionsModalTitle", { role: role?.name ?? "" })}
            </Title>
            <Text size="sm" c="dimmed" lh={1.45}>
              {t("permissionsModalDescription")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size="lg"
      radius="xl"
      padding={0}
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 12, backgroundOpacity: 0.24 }}
      styles={{
        content: {
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
          border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90dvh",
          overflow: "hidden",
        },
        header: {
          background: "transparent",
          borderBottom:
            "1px solid light-dark(rgba(15,23,42,0.06), rgba(255,255,255,0.07))",
          padding: "var(--mantine-spacing-lg)",
          paddingBottom: "var(--mantine-spacing-md)",
          flexShrink: 0,
        },
        title: { flex: 1 },
        body: {
          padding: "var(--mantine-spacing-lg)",
          paddingTop: "var(--mantine-spacing-md)",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
        <Group justify="space-between" align="center" wrap="wrap" gap="xs">
          <Badge variant="light" color="violet" radius="sm">
            {t("permissionsSelectedBadge", { count: checkedIds.length })}
          </Badge>
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              onClick={selectAll}
              disabled={isLoading || filteredPermissions.length === 0}
            >
              {t("selectAll")}
            </Button>
            <Button
              variant="subtle"
              color="gray"
              size="xs"
              onClick={clearAll}
              disabled={isLoading || checkedIds.length === 0}
            >
              {t("clearAll")}
            </Button>
          </Group>
        </Group>

        <TextInput
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          placeholder={t("searchPermissions")}
          leftSection={<IconSearch size={16} />}
          radius="md"
        />

        <Paper
          withBorder
          radius="lg"
          p="xs"
          bg="light-dark(rgba(255,255,255,0.78), rgba(255,255,255,0.03))"
        >
          {isLoading ? (
            <Group justify="center" p="xl">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                {t("loadingPermissions")}
              </Text>
            </Group>
          ) : filteredPermissions.length === 0 ? (
            <Stack align="center" gap="xs" p="xl">
              <Text size="sm" c="dimmed">
                {t("noPermissions")}
              </Text>
            </Stack>
          ) : (
            <ScrollArea.Autosize mah={360} type="auto" offsetScrollbars>
              <Stack gap={4} p={4}>
                {filteredPermissions.map((permission) => (
                  <Paper
                    key={permission.id}
                    p="sm"
                    radius="md"
                    withBorder={checkedSet.has(permission.id)}
                    bg={
                      checkedSet.has(permission.id)
                        ? "light-dark(rgba(124,58,237,0.05), rgba(167,139,250,0.07))"
                        : undefined
                    }
                  >
                    <Checkbox
                      checked={checkedSet.has(permission.id)}
                      onChange={() => toggle(permission.id)}
                      label={
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>
                            {permission.name}
                          </Text>
                          {permission.description ? (
                            <Text size="xs" c="dimmed">
                              {permission.description}
                            </Text>
                          ) : null}
                        </Stack>
                      }
                    />
                  </Paper>
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
        </Paper>

        <Group justify="flex-end" gap="sm" wrap="nowrap">
          <Button
            variant="default"
            onClick={onClose}
            disabled={isSubmitting}
            radius="md"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={submit}
            loading={isSubmitting}
            disabled={!role || isLoading || !hasChanges}
            radius="md"
            px="xl"
          >
            {t("save")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
