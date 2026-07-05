"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Button, Checkbox, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("admin.roles");
  const isOpen = useMirror("isOpen");
  const onClose = useMirror("onClose");
  const user = useMirror("user");
  const permissionsText = useMirror("permissionsText");
  const setPermissionsText = useMirror("setPermissionsText");
  const loadedPermissions = useMirror("loadedPermissions");
  const isSubmitting = useMirror("isSubmitting");
  const assign = useMirror("assign");
  const replace = useMirror("replace");
  const removeOne = useMirror("removeOne");
  const checkedPermissions = useMirror("checkedPermissions");
  const setCheckedPermissions = useMirror("setCheckedPermissions");

  return (
    <Modal opened={isOpen} onClose={onClose} title={t("managePermissions")} centered>
      <Stack>
        <MutationErrorAlert />
        <Text size="sm">
          {t("userLabel")}: {user?.fullName || "-"}
        </Text>
        <Text size="sm" mb={4}>
          {t("currentPermissions")}
        </Text>
        <Stack gap={4} mb={8}>
          {loadedPermissions.length === 0 && (
            <Text size="sm">{t("noPermissions")}</Text>
          )}
          {loadedPermissions.map((perm) => (
            <Checkbox
              key={perm}
              label={perm}
              checked={checkedPermissions.includes(perm)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCheckedPermissions((prev) => [...prev, perm]);
                } else {
                  setCheckedPermissions((prev) => prev.filter((p) => p !== perm));
                }
              }}
            />
          ))}
        </Stack>
        <TextInput
          label={t("addNewPermission")}
          value={permissionsText}
          onChange={(event) => setPermissionsText(event.target.value)}
          placeholder="users.read"
        />
        <Group justify="space-between" wrap="wrap">
          <Button
            variant="default"
            onClick={() => {
              const toRemove = loadedPermissions.filter(
                (perm) => !checkedPermissions.includes(perm),
              );
              if (toRemove.length > 0) {
                removeOne();
              }
            }}
            loading={isSubmitting}
            disabled={!user || checkedPermissions.length === loadedPermissions.length}
          >
            {t("removeUncheckedPermissions")}
          </Button>
          <Group>
            <Button
              variant="default"
              onClick={replace}
              loading={isSubmitting}
              disabled={!user || checkedPermissions.length === 0}
            >
              {t("replacePermissions")}
            </Button>
            <Button
              onClick={assign}
              loading={isSubmitting}
              disabled={!user || !permissionsText.trim()}
            >
              {t("assignNewPermission")}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  );
};

export { UI };
