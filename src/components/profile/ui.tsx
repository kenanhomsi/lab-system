"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconIdBadge2,
  IconKey,
  IconLock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShieldLock,
  IconSparkles,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMirror } from "./store";
import { ChangePasswordRequest, UpdateMeRequest } from "./types";
import { useTranslations, useLocale } from "next-intl";

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
};

const UI = () => {
  const t = useTranslations("dashboard.profile");
  const locale = useLocale();
  const rtl = locale === "ar";
  const me = useMirror("me");
  const isPending = useMirror("isPending");
  const updateMe = useMirror("updateMe");
  const changePassword = useMirror("changePassword");
  const requestDeletion = useMirror("requestDeletion");
  const activeTab = useMirror("activeTab");
  const setActiveTab = useMirror("setActiveTab");

  const [profileForm, setProfileForm] = useState<UpdateMeRequest>({
    fullName: "",
    city: "",
    phoneNumber: "",
    profileMetadata: "",
  });
  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false);

  useEffect(() => {
    if (!me) return;
    setProfileForm({
      fullName: me.fullName ?? "",
      city: me.city ?? "",
      phoneNumber: me.phoneNumber ?? "",
      profileMetadata: me.profileMetadata ?? "",
    });
  }, [me]);

  const canSaveProfile = useMemo(() => Boolean(profileForm.fullName.trim()), [profileForm.fullName]);

  const canChangePassword = useMemo(
    () => Boolean(passwordForm.currentPassword.trim() && passwordForm.newPassword.trim()),
    [passwordForm.currentPassword, passwordForm.newPassword],
  );

  const submitProfile = async () => {
    if (!canSaveProfile) return;
    setIsSavingProfile(true);
    try {
      await updateMe({
        ...profileForm,
        fullName: profileForm.fullName.trim(),
        city: profileForm.city.trim(),
        phoneNumber: profileForm.phoneNumber.trim(),
        profileMetadata: profileForm.profileMetadata.trim(),
      });
      notifications.show({
        title: "Profile updated",
        message: "Your profile details have been saved.",
        color: "teal",
      });
    } catch {
      notifications.show({
        title: "Update failed",
        message: "Please try again.",
        color: "red",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const submitPassword = async () => {
    if (!canChangePassword) return;
    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      notifications.show({
        title: "Password changed",
        message: "Your password has been updated successfully.",
        color: "teal",
      });
    } catch {
      notifications.show({
        title: "Change failed",
        message: "Current password might be incorrect.",
        color: "red",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const confirmDeletion = () => {
    modals.openConfirmModal({
      title: (
        <Group gap="sm">
          <ThemeIcon variant="light" color="red" radius="md">
            <IconTrash size={18} />
          </ThemeIcon>
          <Text fw={700}>Request account deletion</Text>
        </Group>
      ),
      centered: true,
      radius: "lg",
      children: (
        <Stack gap="xs">
          <Text size="sm">
            We will record your request and process it according to your organization policy.
          </Text>
          <Text size="sm" c="dimmed">
            You can continue using your account until the deletion is confirmed by an administrator.
          </Text>
        </Stack>
      ),
      labels: { confirm: "Request deletion", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        setIsRequestingDeletion(true);
        try {
          await requestDeletion();
          notifications.show({
            title: "Request submitted",
            message: "Your deletion request has been submitted.",
            color: "teal",
          });
        } catch {
          notifications.show({
            title: "Request failed",
            message: "Please try again later.",
            color: "red",
          });
        } finally {
          setIsRequestingDeletion(false);
        }
      },
    });
  };

  return (
    <Stack gap="lg">
      <Paper withBorder radius="xl" p="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            {isPending ? (
              <Skeleton height={52} width={52} radius="xl" />
            ) : (
              <Avatar radius="xl" size={52} color="cyan">
                {initials(me?.fullName ?? "U")}
              </Avatar>
            )}

            <Stack gap={2}>
              {isPending ? (
                <>
                  <Skeleton height={18} width={220} radius="sm" />
                  <Skeleton height={14} width={280} radius="sm" />
                </>
              ) : (
                <>
                  <Group gap="sm" wrap="wrap">
                    <Title order={3}>{me?.fullName}</Title>
                    {me?.roles?.map((r) => (
                      <Badge key={r} variant="light" radius="sm">
                        {r}
                      </Badge>
                    ))}
                  </Group>
                  <Group gap="xs" wrap="wrap">
                    <Group gap={6}>
                      <IconMail size={14} />
                      <Text size="sm" c="dimmed">
                        {me?.email}
                      </Text>
                    </Group>
                    <Divider orientation="vertical" />
                    <Badge
                      color={me?.isActive ? "teal" : "gray"}
                      variant="light"
                      radius="sm"
                    >
                      {me?.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      color={me?.emailConfirmed ? "teal" : "yellow"}
                      variant="light"
                      radius="sm"
                    >
                      {me?.emailConfirmed ? "Email verified" : "Email not verified"}
                    </Badge>
                  </Group>
                </>
              )}
            </Stack>
          </Group>

          <Badge variant="light" radius="sm" color="blue">
            Profile
          </Badge>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" verticalSpacing="lg">
        <Paper withBorder radius="xl" p="lg">
          <Stack gap="md">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={40} radius="md" variant="light" color="blue">
                <IconUser size={18} />
              </ThemeIcon>
              <Stack gap={2}>
                <Text fw={700}>{t("account")}</Text>
                <Text size="sm" c="dimmed">
                  {t("accountDesc")}
                </Text>
              </Stack>
            </Group>

            {isPending ? (
              <Stack gap="sm">
                <Skeleton height={12} width="90%" />
                <Skeleton height={12} width="70%" />
                <Skeleton height={12} width="80%" />
              </Stack>
            ) : (
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {t("userId")}
                  </Text>
                  <Text size="sm" fw={600}>
                    {me?.id}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {t("created")}
                  </Text>
                  <Text size="sm" fw={600} dir="ltr">
                    {me?.createdAt ? new Date(me.createdAt).toLocaleString(locale) : "-"}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {t("updated")}
                  </Text>
                  <Text size="sm" fw={600} dir="ltr">
                    {me?.updatedAt ? new Date(me.updatedAt).toLocaleString(locale) : "—"}
                  </Text>
                </Group>
                <Divider />
                <Group gap="xs">
                  <ThemeIcon variant="light" radius="md" color="grape">
                    <IconShieldLock size={16} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="sm" fw={600}>
                      {t("lockout")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {me?.lockoutEnabled
                        ? me.lockoutEnd
                          ? t("lockoutEnabled").replace("{date}", new Date(me.lockoutEnd).toLocaleString(locale))
                          : t("lockoutActive")
                        : t("lockoutDisabled")}
                    </Text>
                  </Stack>
                </Group>
              </Stack>
            )}
          </Stack>
        </Paper>

        <Paper withBorder radius="xl" p="lg" style={{ gridColumn: "span 2" }}>
          <Tabs
            value={activeTab}
            onChange={(value) => {
              if (value === "profile" || value === "security" || value === "danger") {
                setActiveTab(value);
              }
            }}
            keepMounted={false}
          >
            <Tabs.List>
              <Tabs.Tab value="profile" leftSection={<IconSparkles size={16} />}>
                {t("tabProfile")}
              </Tabs.Tab>
              <Tabs.Tab value="security" leftSection={<IconKey size={16} />}>
                {t("tabSecurity")}
              </Tabs.Tab>
              <Tabs.Tab value="danger" leftSection={<IconAlertTriangle size={16} />}>
                {t("tabDanger")}
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="profile" pt="lg">
              <Stack gap="lg">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon size={40} radius="md" variant="light" color="blue">
                    <IconIdBadge2 size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={700}>{t("profileDetails")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("profileDetailsDesc")}
                    </Text>
                  </Stack>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                  <TextInput
                    label={t("fullName")}
                    withAsterisk
                    leftSection={<IconIdBadge2 size={16} />}
                    value={profileForm.fullName}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setProfileForm((p) => ({ ...p, fullName: value }));
                    }}
                    placeholder={t("fullNamePlaceholder")}
                  />
                  <TextInput
                    label={t("phoneNumber")}
                    leftSection={<IconPhone size={16} />}
                    value={profileForm.phoneNumber}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setProfileForm((p) => ({ ...p, phoneNumber: value }));
                    }}
                    placeholder={t("phoneNumberPlaceholder")}
                    style={{ direction: "ltr", textAlign: rtl ? "right" : "left" }}
                  />
                  <TextInput
                    label={t("city")}
                    leftSection={<IconMapPin size={16} />}
                    value={profileForm.city}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setProfileForm((p) => ({ ...p, city: value }));
                    }}
                    placeholder={t("cityPlaceholder")}
                  />
                  <TextInput
                    label={t("email")}
                    leftSection={<IconMail size={16} />}
                    value={me?.email ?? ""}
                    readOnly
                    disabled
                  />
                </SimpleGrid>

                <Textarea
                  label={t("profileMetadata")}
                  description={t("profileMetadataDesc")}
                  autosize
                  minRows={4}
                  value={profileForm.profileMetadata}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setProfileForm((p) => ({ ...p, profileMetadata: value }));
                  }}
                  placeholder={t("profileMetadataPlaceholder")}
                  style={{ direction: "ltr", textAlign: rtl ? "right" : "left" }}
                />

                <Group justify="flex-end">
                  <Button
                    onClick={submitProfile}
                    loading={isSavingProfile}
                    disabled={!canSaveProfile || isPending}
                    radius="md"
                  >
                    {t("saveChanges")}
                  </Button>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="security" pt="lg">
              <Stack gap="lg">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon size={40} radius="md" variant="light" color="grape">
                    <IconLock size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={700}>{t("changePassword")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("changePasswordDesc")}
                    </Text>
                  </Stack>
                </Group>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
                  <PasswordInput
                    label={t("currentPassword")}
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setPasswordForm((p) => ({
                        ...p,
                        currentPassword: value,
                      }));
                    }}
                  />
                  <PasswordInput
                    label={t("newPassword")}
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      const value = e.currentTarget.value;
                      setPasswordForm((p) => ({ ...p, newPassword: value }));
                    }}
                  />
                </SimpleGrid>

                <Group justify="flex-end">
                  <Button
                    onClick={submitPassword}
                    loading={isChangingPassword}
                    disabled={!canChangePassword}
                    radius="md"
                    variant="light"
                  >
                    {t("updatePassword")}
                  </Button>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="danger" pt="lg">
              <Stack gap="lg">
                <Group gap="sm" wrap="nowrap">
                  <ThemeIcon size={40} radius="md" variant="light" color="red">
                    <IconAlertTriangle size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={700}>{t("dangerZone")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("dangerZoneDesc")}
                    </Text>
                  </Stack>
                </Group>

                <Paper withBorder radius="lg" p="md">
                  <Group justify="space-between" align="flex-start">
                    <Stack gap={2}>
                      <Text fw={700}>{t("requestDeletion")}</Text>
                      <Text size="sm" c="dimmed">
                        {t("requestDeletionDesc")}
                      </Text>
                    </Stack>
                    <Button
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={confirmDeletion}
                      loading={isRequestingDeletion}
                      radius="md"
                      variant="light"
                    >
                      {t("requestDeletionBtn")}
                    </Button>
                  </Group>
                </Paper>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
};

export { UI };

