"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  CopyButton,
  Divider,
  Grid,
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
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronRight,
  IconClipboardCheck,
  IconClipboardList,
  IconCopy,
  IconExternalLink,
  IconHome,
  IconIdBadge2,
  IconKey,
  IconLayoutDashboard,
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
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { showSuccessNotification } from "@/lib/error";
import { useTranslations, useLocale } from "next-intl";

import { Link } from "@/i18n/navigation";

import { useMirror } from "./store";
import { hasAdminRole, hasPatientRole, resolveDashboardBaseFromRoles } from "./role-path";
import type { ChangePasswordRequest, UpdateMeRequest } from "./types";
import styles from "./styles.module.scss";

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || name.slice(0, 2).toUpperCase();
};

/**
 * Dashboard profile surface: identity summary, account metadata, and editable tabs.
 */
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
      showSuccessNotification(
        t("notifyProfileUpdatedTitle"),
        t("notifyProfileUpdatedMessage"),
      );
    } catch {
      // Errors are surfaced via MutationErrorAlert and global notifications.
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
      showSuccessNotification(
        t("notifyPasswordChangedTitle"),
        t("notifyPasswordChangedMessage"),
      );
    } catch {
      // Errors are surfaced via MutationErrorAlert and global notifications.
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
          <Text fw={700}>{t("deletionModalTitle")}</Text>
        </Group>
      ),
      centered: true,
      radius: "lg",
      children: (
        <Stack gap="xs">
          <Text size="sm">{t("deletionModalBody1")}</Text>
          <Text size="sm" c="dimmed">
            {t("deletionModalBody2")}
          </Text>
        </Stack>
      ),
      labels: { confirm: t("deletionConfirm"), cancel: t("deletionCancel") },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        setIsRequestingDeletion(true);
        try {
          await requestDeletion();
          showSuccessNotification(
            t("notifyDeletionSubmittedTitle"),
            t("notifyDeletionSubmittedMessage"),
          );
        } catch {
          // Errors are surfaced via MutationErrorAlert and global notifications.
        } finally {
          setIsRequestingDeletion(false);
        }
      },
    });
  };

  const dashboardBase = useMemo(() => resolveDashboardBaseFromRoles(me?.roles), [me?.roles]);
  const patientAccount = useMemo(() => hasPatientRole(me?.roles), [me?.roles]);
  const adminAccount = useMemo(() => hasAdminRole(me?.roles), [me?.roles]);

  return (
    <Container size="xl" px={{ base: "xs", sm: "md" }} py={{ base: "sm", md: "lg" }}>
      <Stack gap="xl">
        <Stack gap={6}>
          <Title order={2} fz={{ base: 22, sm: 28 }}>
            {t("pageTitle")}
          </Title>
          <Text c="dimmed" size="sm" maw={520}>
            {t("heroSubtitle")}
          </Text>
        </Stack>

        <Box className={styles.hero} p={{ base: "md", sm: "xl" }}>
          <Box className={styles.heroPattern} aria-hidden />
          <Group className={styles.heroContent} justify="space-between" align="flex-start" wrap="wrap" gap="lg">
            <Group gap="md" wrap="nowrap" align="flex-start">
              {isPending ? (
                <Skeleton height={78} width={78} circle />
              ) : (
                <Box
                  p={3}
                  style={{
                    borderRadius: "9999px",
                    background:
                      "linear-gradient(135deg, var(--mantine-color-cyan-5), var(--mantine-color-blue-6))",
                  }}
                >
                  <Avatar radius="xl" size={72} color="cyan">
                    {initials(me?.fullName ?? "U")}
                  </Avatar>
                </Box>
              )}

              <Stack gap={6}>
                {isPending ? (
                  <>
                    <Skeleton height={22} width={220} radius="sm" />
                    <Skeleton height={14} width={280} radius="sm" />
                  </>
                ) : (
                  <>
                    <Group gap="sm" wrap="wrap" align="center">
                      <Title order={3} fz={{ base: 18, sm: 22 }}>
                        {me?.fullName}
                      </Title>
                      {me?.roles?.map((r) => (
                        <Badge key={r} variant="light" radius="md" size="sm">
                          {r}
                        </Badge>
                      ))}
                    </Group>
                    <Group gap="xs" wrap="wrap">
                      <Group gap={6} wrap="nowrap">
                        <ThemeIcon size={28} radius="md" variant="light" color="gray">
                          <IconMail size={14} />
                        </ThemeIcon>
                        <Text size="sm" c="dimmed" style={{ wordBreak: "break-word" }}>
                          {me?.email}
                        </Text>
                      </Group>
                    </Group>
                    {(me?.phoneNumber?.trim() || me?.city?.trim()) ? (
                      <Group gap="md" wrap="wrap" mt={4}>
                        {me?.phoneNumber?.trim() ? (
                          <Group gap={6} wrap="nowrap">
                            <ThemeIcon size={28} radius="md" variant="light" color="teal">
                              <IconPhone size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="dimmed" dir="ltr">
                              {me.phoneNumber.trim()}
                            </Text>
                          </Group>
                        ) : null}
                        {me?.city?.trim() ? (
                          <Group gap={6} wrap="nowrap">
                            <ThemeIcon size={28} radius="md" variant="light" color="blue">
                              <IconMapPin size={14} />
                            </ThemeIcon>
                            <Text size="sm" c="dimmed">
                              {me.city.trim()}
                            </Text>
                          </Group>
                        ) : null}
                      </Group>
                    ) : null}
                    <Group gap="xs" mt={4}>
                      <Badge color={me?.isActive ? "teal" : "gray"} variant="light" radius="md" size="sm">
                        {me?.isActive ? t("statusActive") : t("statusInactive")}
                      </Badge>
                      <Badge
                        color={me?.emailConfirmed ? "teal" : "yellow"}
                        variant="light"
                        radius="md"
                        size="sm"
                      >
                        {me?.emailConfirmed ? t("emailVerifiedBadge") : t("emailUnverifiedBadge")}
                      </Badge>
                    </Group>
                  </>
                )}
              </Stack>
            </Group>

            <Badge variant="light" color="blue" radius="md" size="lg">
              {t("heroBadge")}
            </Badge>
          </Group>
        </Box>

        <Grid gap={{ base: "md", lg: "xl" }}>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              <Card shadow="sm" padding="lg" radius="xl" withBorder>
                <Stack gap="md">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ from: "blue", to: "cyan", deg: 135 }}>
                      <IconUser size={20} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={700}>{t("account")}</Text>
                      <Text size="sm" c="dimmed" lineClamp={3}>
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
                      <Paper p="sm" radius="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                        <Stack gap="xs">
                          <Group justify="space-between" gap="xs" wrap="nowrap" align="flex-start">
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                              {t("userId")}
                            </Text>
                            <Group gap={6} wrap="nowrap" justify="flex-end" style={{ flex: 1, minWidth: 0 }}>
                              <Text
                                size="sm"
                                fw={600}
                                style={{
                                  wordBreak: "break-all",
                                  textAlign: rtl ? "left" : "right",
                                }}
                              >
                                {me?.id}
                              </Text>
                              <CopyButton value={me?.id ?? ""} timeout={1800}>
                                {({ copied, copy }) => (
                                  <Tooltip label={copied ? t("userIdCopied") : t("copyUserId")}>
                                    <ActionIcon
                                      variant="subtle"
                                      color={copied ? "teal" : "gray"}
                                      radius="md"
                                      aria-label={copied ? t("userIdCopied") : t("copyUserId")}
                                      onClick={copy}
                                    >
                                      {copied ? <IconCheck size={16} aria-hidden /> : <IconCopy size={16} aria-hidden />}
                                    </ActionIcon>
                                  </Tooltip>
                                )}
                              </CopyButton>
                            </Group>
                          </Group>
                          <Divider variant="dashed" />
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                              {t("created")}
                            </Text>
                            <Text size="sm" fw={600} dir="ltr">
                              {me?.createdAt ? new Date(me.createdAt).toLocaleString(locale) : "—"}
                            </Text>
                          </Group>
                          <Group justify="space-between" wrap="nowrap" gap="xs">
                            <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                              {t("updated")}
                            </Text>
                            <Text size="sm" fw={600} dir="ltr">
                              {me?.updatedAt ? new Date(me.updatedAt).toLocaleString(locale) : "—"}
                            </Text>
                          </Group>
                        </Stack>
                      </Paper>

                      <Divider />

                      <Group gap="sm" wrap="nowrap" align="flex-start">
                        <ThemeIcon variant="light" radius="md" color="grape" size={36}>
                          <IconShieldLock size={18} />
                        </ThemeIcon>
                        <Stack gap={4}>
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
              </Card>

              <Card shadow="sm" padding="lg" radius="xl" withBorder>
                <Stack gap="md">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ from: "teal", to: "cyan", deg: 135 }}>
                      <IconHome size={20} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={700}>{t("sectionQuick")}</Text>
                      <Text size="sm" c="dimmed" lineClamp={4}>
                        {t("quickLinksIntro")}
                      </Text>
                    </Stack>
                  </Group>

                  {isPending ? (
                    <Stack gap="sm">
                      <Skeleton height={40} radius="md" />
                      <Skeleton height={40} radius="md" />
                      <Skeleton height={40} radius="md" />
                    </Stack>
                  ) : (
                    <Stack gap={4}>
                      <UnstyledButton
                        component={Link}
                        href={`${dashboardBase}/dashboard`}
                        className={styles.quickLink}
                      >
                        <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size={34} radius="md" variant="light" color="blue">
                              <IconLayoutDashboard size={18} aria-hidden />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              {t("backToDashboard")}
                            </Text>
                          </Group>
                          <IconChevronRight
                            size={18}
                            style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                            aria-hidden
                          />
                        </Group>
                      </UnstyledButton>
                      <UnstyledButton
                        component={Link}
                        href={`${dashboardBase}/test-results`}
                        className={styles.quickLink}
                      >
                        <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size={34} radius="md" variant="light" color="green">
                              <IconClipboardCheck size={18} aria-hidden />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              {t("goToResults")}
                            </Text>
                          </Group>
                          <IconChevronRight
                            size={18}
                            style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                            aria-hidden
                          />
                        </Group>
                      </UnstyledButton>
                      <UnstyledButton
                        component={Link}
                        href={`${dashboardBase}/test-requests`}
                        className={styles.quickLink}
                      >
                        <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size={34} radius="md" variant="light" color="orange">
                              <IconClipboardList size={18} aria-hidden />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              {t("quickLinkTestRequests")}
                            </Text>
                          </Group>
                          <IconChevronRight
                            size={18}
                            style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                            aria-hidden
                          />
                        </Group>
                      </UnstyledButton>
                      {patientAccount ? (
                        <UnstyledButton component={Link} href="/plans" className={styles.quickLink}>
                          <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                            <Group gap="sm" wrap="nowrap">
                              <ThemeIcon size={34} radius="md" variant="light" color="violet">
                                <IconExternalLink size={18} aria-hidden />
                              </ThemeIcon>
                              <Text size="sm" fw={600}>
                                {t("goToSubscriptions")}
                              </Text>
                            </Group>
                            <IconChevronRight
                              size={18}
                              style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                              aria-hidden
                            />
                          </Group>
                        </UnstyledButton>
                      ) : null}
                      {adminAccount ? (
                        <UnstyledButton
                          component={Link}
                          href="/admin/subscription-packages"
                          className={styles.quickLink}
                        >
                          <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                            <Group gap="sm" wrap="nowrap">
                              <ThemeIcon size={34} radius="md" variant="light" color="indigo">
                                <IconExternalLink size={18} aria-hidden />
                              </ThemeIcon>
                              <Text size="sm" fw={600}>
                                {t("manageSubscription")}
                              </Text>
                            </Group>
                            <IconChevronRight
                              size={18}
                              style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                              aria-hidden
                            />
                          </Group>
                        </UnstyledButton>
                      ) : null}
                      <UnstyledButton component={Link} href="/contact-us" className={styles.quickLink}>
                        <Group justify="space-between" p="sm" wrap="nowrap" gap="sm">
                          <Group gap="sm" wrap="nowrap">
                            <ThemeIcon size={34} radius="md" variant="light" color="gray">
                              <IconMail size={18} aria-hidden />
                            </ThemeIcon>
                            <Text size="sm" fw={600}>
                              {t("goToBook")}
                            </Text>
                          </Group>
                          <IconChevronRight
                            size={18}
                            style={{ opacity: 0.5, transform: rtl ? "scaleX(-1)" : undefined }}
                            aria-hidden
                          />
                        </Group>
                      </UnstyledButton>
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card shadow="sm" p={{ base: "md", sm: "lg" }} radius="xl" withBorder>
            <MutationErrorAlert />
            <Tabs
              value={activeTab}
              onChange={(value) => {
                if (value === "profile" || value === "security" || value === "danger") {
                  setActiveTab(value);
                }
              }}
              keepMounted={false}
              variant="outline"
              radius="md"
            >
              <Tabs.List grow>
                <Tabs.Tab value="profile" leftSection={<IconSparkles size={16} aria-hidden />}>
                  {t("tabProfile")}
                </Tabs.Tab>
                <Tabs.Tab value="security" leftSection={<IconKey size={16} aria-hidden />}>
                  {t("tabSecurity")}
                </Tabs.Tab>
                <Tabs.Tab value="danger" leftSection={<IconAlertTriangle size={16} aria-hidden />} color="red">
                  {t("tabDanger")}
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="profile" pt="lg" className={styles.tabPanel}>
                <Stack gap="lg">
                  <Group gap="sm" wrap="nowrap" align="flex-start">
                    <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ from: "cyan", to: "blue", deg: 135 }}>
                      <IconIdBadge2 size={20} />
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
                      leftSection={<IconIdBadge2 size={16} aria-hidden />}
                      value={profileForm.fullName}
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        setProfileForm((p) => ({ ...p, fullName: value }));
                      }}
                      placeholder={t("fullNamePlaceholder")}
                    />
                    <TextInput
                      label={t("phoneNumber")}
                      leftSection={<IconPhone size={16} aria-hidden />}
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
                      leftSection={<IconMapPin size={16} aria-hidden />}
                      value={profileForm.city}
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        setProfileForm((p) => ({ ...p, city: value }));
                      }}
                      placeholder={t("cityPlaceholder")}
                    />
                    <TextInput
                      label={t("email")}
                      leftSection={<IconMail size={16} aria-hidden />}
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

                  <Paper withBorder radius="md" p="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                    <Group justify="space-between" align="center" gap="md" wrap="wrap">
                      <Text size="sm" c="dimmed" maw={360}>
                        {t("saveHint")}
                      </Text>
                      <Button
                        onClick={submitProfile}
                        loading={isSavingProfile}
                        disabled={!canSaveProfile || isPending}
                        radius="md"
                        variant="gradient"
                        gradient={{ from: "cyan", to: "blue", deg: 135 }}
                      >
                        {t("saveChanges")}
                      </Button>
                    </Group>
                  </Paper>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="security" pt="lg" className={styles.tabPanel}>
                <Stack gap="lg">
                  <Group gap="sm" wrap="nowrap" align="flex-start">
                    <ThemeIcon size={44} radius="md" variant="gradient" gradient={{ from: "grape", to: "violet", deg: 135 }}>
                      <IconLock size={20} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={700}>{t("changePassword")}</Text>
                      <Text size="sm" c="dimmed">
                        {t("changePasswordDesc")}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {t("changePasswordHint")}
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

                  <Paper withBorder radius="md" p="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                    <Group justify="flex-end">
                      <Button
                        onClick={submitPassword}
                        loading={isChangingPassword}
                        disabled={!canChangePassword}
                        radius="md"
                        variant="light"
                        color="grape"
                      >
                        {t("updatePassword")}
                      </Button>
                    </Group>
                  </Paper>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="danger" pt="lg" className={styles.tabPanel}>
                <Stack gap="lg">
                  <Group gap="sm" wrap="nowrap" align="flex-start">
                    <ThemeIcon size={44} radius="md" variant="light" color="red">
                      <IconAlertTriangle size={20} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text fw={700}>{t("dangerZone")}</Text>
                      <Text size="sm" c="dimmed">
                        {t("dangerZoneDesc")}
                      </Text>
                    </Stack>
                  </Group>

                  <Paper withBorder radius="lg" p="lg" style={{ borderColor: "var(--mantine-color-red-3)" }}>
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                        <Stack gap={6} maw={440}>
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
                          variant="filled"
                        >
                          {t("requestDeletionBtn")}
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export { UI };
