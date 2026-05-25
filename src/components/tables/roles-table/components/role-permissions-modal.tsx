"use client";

import { Box, Group, Modal, Stack, Text } from "@mantine/core";
import { IconShieldLock } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { PolicyGraph } from "@/components/policy-graph";
import { RoleTableItem } from "../types";

type Props = {
  opened: boolean;
  onClose: () => void;
  role: RoleTableItem | null;
};

const RolePermissionsModal = ({ opened, onClose, role }: Props) => {
  const tRoles = useTranslations("admin.settings.roles");
  const t = useTranslations("admin.users");
  const policies = role?.accessPolicies ?? [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconShieldLock size={20} />
          <Text fw={600}>
            {role
              ? tRoles("viewPoliciesTitle", { role: role.name })
              : tRoles("viewPoliciesTitleFallback")}
          </Text>
        </Group>
      }
      size="xl"
      centered
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
    >
      <Stack gap="md">
        <Box>
          <Text size="sm" fw={600} mb="xs">
            {t("sectionAccessPolicies")}
          </Text>
          {policies.length === 0 ? (
            <Text size="sm" c="dimmed">
              {tRoles("noPoliciesAssigned")}
            </Text>
          ) : (
            <>
              <Text size="xs" c="dimmed" mb="md">
                {t("policyMatrixHint")}
              </Text>
              {role ? (
                <PolicyGraph
                  policies={policies}
                  roles={[role.name]}
                  t={t as (key: string) => string}
                />
              ) : null}
            </>
          )}
        </Box>
      </Stack>
    </Modal>
  );
};

export { RolePermissionsModal };
