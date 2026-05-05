"use client";

import {
  Alert,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconInfoCircle, IconUser } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMirror } from "../store";
import { DateRender } from "@/components/tables/test-requests-table/schema/columns-rendering/date-render";

const Modals = () => {
  const t = useTranslations("externalPatients");
  const { data: session, status: sessionStatus } = useSession();
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedPatient = useMirror("selectedPatient");
  const setSelectedPatient = useMirror("setSelectedPatient");
  const createMutation = useMirror("createMutation");
  const linkMutation = useMirror("linkMutation");

  const accountExternalId = session?.user?.id?.trim() ?? "";

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [directPatientUserId, setDirectPatientUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setActiveModal(null);
    setSelectedPatient(null);
    setFullName("");
    setAge("");
    setGender(null);
    setPhoneNumber("");
    setDirectPatientUserId("");
    setSubmitting(false);
  };

  const openCreate = activeModal === "create";
  const openView = activeModal === "view";
  const openLink = activeModal === "link";

  const onCreate = async () => {
    if (!accountExternalId) return;
    setSubmitting(true);
    try {
      await createMutation.mutateAsync({
        fullName: fullName.trim(),
        age: typeof age === "number" ? age : Number(age) || 0,
        gender: gender ?? "",
        phoneNumber: phoneNumber.trim(),
        externalId: accountExternalId,
      });
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const onLink = async () => {
    if (!selectedPatient) return;
    setSubmitting(true);
    try {
      await linkMutation.mutateAsync({
        id: String(selectedPatient.id),
        directPatientUserId: directPatientUserId.trim(),
      });
      closeModal();
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmitCreate =
    Boolean(fullName.trim()) &&
    Boolean(accountExternalId) &&
    sessionStatus !== "loading";

  return (
    <>
      <Modal
        opened={openCreate}
        onClose={closeModal}
        title={
          <Stack gap={4}>
            <Text fw={600} size="lg">
              {t("createTitle")}
            </Text>
            <Text size="sm" c="dimmed" fw={400} maw={420}>
              {t("createSubtitle")}
            </Text>
          </Stack>
        }
        size="lg"
        radius="lg"
        padding="xl"
        overlayProps={{ backgroundOpacity: 0.45, blur: 4 }}
        transitionProps={{ transition: "pop", duration: 200 }}
      >
        <Stack gap="lg">
          {sessionStatus === "loading" ? (
            <Alert variant="light" color="gray" title={t("sessionLoadingTitle")}>
              {t("sessionLoadingBody")}
            </Alert>
          ) : null}

          {!accountExternalId && sessionStatus === "authenticated" ? (
            <Alert color="red" variant="light" title={t("sessionMissingIdTitle")} icon={<IconInfoCircle />}>
              {t("sessionMissingIdBody")}
            </Alert>
          ) : null}

          {!accountExternalId && sessionStatus === "unauthenticated" ? (
            <Alert color="orange" variant="light" title={t("sessionUnauthenticatedTitle")} icon={<IconInfoCircle />}>
              {t("sessionUnauthenticatedBody")}
            </Alert>
          ) : null}

          {accountExternalId ? (
            <Alert
              variant="light"
              color="teal"
              icon={<IconUser size={18} />}
              title={t("externalIdAutoTitle")}
              styles={{ message: { marginTop: 6 } }}
            >
              <Text size="sm" c="dark.6">
                {t("externalIdAutoBody")}
              </Text>
              <Text
                size="sm"
                ff="monospace"
                fw={600}
                mt={8}
                px="sm"
                py={6}
                style={{
                  borderRadius: 8,
                  background: "var(--mantine-color-teal-0)",
                  wordBreak: "break-all",
                }}
              >
                {accountExternalId}
              </Text>
            </Alert>
          ) : null}

          <Divider label={t("createFormSectionLabel")} labelPosition="center" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" verticalSpacing="md">
            <TextInput
              label={t("fieldFullName")}
              placeholder={t("fieldFullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.currentTarget.value)}
              required
              radius="md"
              size="md"
            />
            <TextInput
              label={t("fieldPhone")}
              placeholder={t("fieldPhonePlaceholder")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
              radius="md"
              size="md"
            />
            <NumberInput
              label={t("fieldAge")}
              placeholder={t("fieldAgePlaceholder")}
              value={age === "" ? undefined : age}
              onChange={(v) => setAge(typeof v === "number" ? v : "")}
              min={0}
              max={150}
              radius="md"
              size="md"
            />
            <Select
              label={t("fieldGender")}
              placeholder={t("fieldGenderPlaceholder")}
              data={[
                { value: "male", label: t("genderMale") },
                { value: "female", label: t("genderFemale") },
                { value: "other", label: t("genderOther") },
              ]}
              value={gender}
              onChange={setGender}
              clearable
              radius="md"
              size="md"
            />
          </SimpleGrid>

          <Group justify="flex-end" gap="sm" mt="md" pt="sm" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
            <Button variant="default" radius="md" onClick={closeModal} size="md">
              {t("cancel")}
            </Button>
            <Button
              loading={submitting}
              radius="md"
              size="md"
              onClick={() => void onCreate()}
              disabled={!canSubmitCreate}
            >
              {t("createSubmit")}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={openView}
        onClose={closeModal}
        title={
          <Text fw={600} size="lg">
            {t("viewTitle")}
          </Text>
        }
        size="md"
        radius="lg"
        padding="lg"
        overlayProps={{ backgroundOpacity: 0.45, blur: 4 }}
      >
        {selectedPatient ? (
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  {t("fieldFullName")}
                </Text>
                <Text size="sm">{selectedPatient.fullName}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  {t("fieldPhone")}
                </Text>
                <Text size="sm">{selectedPatient.phoneNumber || "—"}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  {t("fieldAge")}
                </Text>
                <Text size="sm">{selectedPatient.age}</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  {t("fieldGender")}
                </Text>
                <Text size="sm">{selectedPatient.gender || "—"}</Text>
              </Stack>
            </SimpleGrid>
            <Divider />
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                {t("fieldExternalId")}
              </Text>
              <Text size="sm" ff="monospace" style={{ wordBreak: "break-all" }}>
                {selectedPatient.externalId || "—"}
              </Text>
              <Text size="xs" c="dimmed">
                {t("viewExternalIdHint")}
              </Text>
            </Stack>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                {t("colLinkedDirectPatientId")}
              </Text>
              <Text size="sm">{selectedPatient.linkedDirectPatientId ?? "—"}</Text>
            </Stack>
            <Group gap={6} align="center" wrap="nowrap">
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                {t("colCreatedAt")}:
              </Text>
              <DateRender value={selectedPatient.createdAt} />
            </Group>
            <Group justify="flex-end" mt="md">
              <Button radius="md" onClick={closeModal}>
                {t("close")}
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>

      <Modal
        opened={openLink}
        onClose={closeModal}
        title={
          <Stack gap={4}>
            <Text fw={600} size="lg">
              {t("linkTitle")}
            </Text>
            <Text size="sm" c="dimmed" fw={400}>
              {t("linkDescription")}
            </Text>
          </Stack>
        }
        size="md"
        radius="lg"
        padding="lg"
        overlayProps={{ backgroundOpacity: 0.45, blur: 4 }}
      >
        <Stack gap="md">
          <TextInput
            label={t("fieldDirectPatientUserId")}
            placeholder={t("fieldDirectPatientUserIdPlaceholder")}
            description={t("fieldDirectPatientUserIdDescription")}
            value={directPatientUserId}
            onChange={(e) => setDirectPatientUserId(e.currentTarget.value)}
            required
            radius="md"
            size="md"
          />
          <Group justify="flex-end" gap="sm" mt="sm">
            <Button variant="default" radius="md" onClick={closeModal}>
              {t("cancel")}
            </Button>
            <Button
              loading={submitting}
              radius="md"
              onClick={() => void onLink()}
              disabled={!directPatientUserId.trim()}
            >
              {t("linkSubmit")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
