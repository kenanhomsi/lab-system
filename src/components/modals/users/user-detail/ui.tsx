"use client";

import {
  Badge,
  Box,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconShieldCheck } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/tables/users-table/schema/columns-rendering/user-avatar";
import { StatusBadge } from "@/components/tables/users-table/schema/columns-rendering/status-badge";
import { useMirror } from "./store";
import { PolicyGraph } from "@/components/policy-graph";

const ROLE_COLORS: Record<string, string> = {
  admin: "red",
  doctor: "blue",
  patient: "teal",
  lab: "grape",
  secretary: "orange",
};

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const UI = () => {
  const t = useTranslations("admin.users");
  const tc = useTranslations("admin.common");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");

  if (!user) {
    return (
      <Modal opened={isOpen} onClose={onClose} title={t("detailModalTitle")} size="xl" centered>
        <Text size="sm" c="dimmed">
          {t("notFound")}
        </Text>
      </Modal>
    );
  }

  const roles = user.roles?.filter(Boolean) ?? [];
  const policies = user.accessPolicies ?? [];

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={t("detailModalTitle")}
      size="xl"
      centered
    >
      <Box mih={0} style={{ maxHeight: "min(70vh, 720px)", overflowY: "auto" }}>
      <Stack gap="lg">
        <Group gap="md" wrap="nowrap" align="flex-start">
          <UserAvatar fullName={user.fullName} />
          <Stack gap={4} style={{ flex: 1 }}>
            <Title order={4}>{user.fullName}</Title>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
            <Group gap="xs" mt={4}>
              <StatusBadge
                value={user.isActive}
                trueLabel={tc("active")}
                falseLabel={tc("inactive")}
                type="status"
              />
              <StatusBadge
                value={user.emailConfirmed}
                trueLabel={tc("confirmed")}
                falseLabel={tc("unconfirmed")}
                type="confirmed"
              />
            </Group>
          </Stack>
        </Group>

        <Divider />

        <Box>
          <Text size="sm" fw={600} mb="sm">
            {t("sectionProfile")}
          </Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                {t("city")}
              </Text>
              <Text size="sm">{user.city || "—"}</Text>
            </Stack>
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                {t("phone")}
              </Text>
              <Text size="sm" dir="ltr" style={{ textAlign: "start" }}>
                {user.phoneNumber || "—"}
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                {t("colCreatedAt")}
              </Text>
              <Text size="sm">{formatDate(user.createdAt)}</Text>
            </Stack>
          </SimpleGrid>
        </Box>

        <Divider />

        <Box>
          <Group gap="xs" mb="sm">
            <IconShieldCheck size={18} />
            <Text size="sm" fw={600}>
              {t("sectionRoles")}
            </Text>
          </Group>
          {roles.length === 0 ? (
            <Text size="sm" c="dimmed">
              —
            </Text>
          ) : (
            <Group gap="xs">
              {roles.map((role) => (
                <Badge
                  key={role}
                  size="lg"
                  variant="light"
                  color={ROLE_COLORS[role.toLowerCase()] ?? "blue"}
                >
                  {role}
                </Badge>
              ))}
            </Group>
          )}
        </Box>

        <Divider />

        <Box>
          <Text size="sm" fw={600} mb="xs">
            {t("sectionAccessPolicies")}
          </Text>
          {policies.length === 0 ? (
            <Text size="sm" c="dimmed">
              {t("policyNoData")}
            </Text>
          ) : (
            <>
              <Text size="xs" c="dimmed" mb="md">
                {t("policyMatrixHint")}
              </Text>
              <PolicyGraph policies={policies} roles={roles} t={t} />
            </>
          )}
        </Box>
      </Stack>
      </Box>
    </Modal>
  );
};

export { UI };
