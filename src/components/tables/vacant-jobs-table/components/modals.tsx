"use client";

import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconBriefcase } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useMirror } from "../store";
import { CreateVacantJobParams } from "@/modules/vacant-jobs/frontend/types";
import { VacantJobItem } from "../types";

const Modals = () => {
  const t = useTranslations("admin.vacantJobs");
  const tc = useTranslations("admin.common");
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const closeModal = () => setActiveModal(null);
  const selectedVacantJob = useMirror("selectedVacantJob");
  const createMutation = useMirror("createMutation") as {
    mutateAsync: (data: CreateVacantJobParams) => Promise<unknown>;
  };
  const updateMutation = useMirror("updateMutation") as {
    mutateAsync: (params: { id: string; data: unknown }) => Promise<unknown>;
  };
  const deleteMutation = useMirror("deleteMutation") as {
    mutateAsync: (id: string) => Promise<unknown>;
  };

  const selected = selectedVacantJob as VacantJobItem | null;

  const Form = (props: { mode: "create" | "edit"; selected: VacantJobItem | null }) => {
    const tm = useTranslations("admin.vacantJobs");
    const tcForm = useTranslations("admin.common");
    const [titleAr, setTitleAr] = useState(props.selected?.titleAr ?? "");
    const [titleEn, setTitleEn] = useState(props.selected?.titleEn ?? "");
    const [descriptionAr, setDescriptionAr] = useState(props.selected?.descriptionAr ?? "");
    const [descriptionEn, setDescriptionEn] = useState(props.selected?.descriptionEn ?? "");
    const [sortOrder, setSortOrder] = useState<number>(props.selected?.sortOrder ?? 0);
    const [isActive, setIsActive] = useState(props.selected?.isActive ?? true);

    const canSubmit = useMemo(() => {
      return (
        titleAr.trim().length > 0 &&
        titleEn.trim().length > 0 &&
        descriptionAr.trim().length > 0 &&
        descriptionEn.trim().length > 0
      );
    }, [titleAr, titleEn, descriptionAr, descriptionEn]);

    useEffect(() => {
      setTitleAr(props.selected?.titleAr ?? "");
      setTitleEn(props.selected?.titleEn ?? "");
      setDescriptionAr(props.selected?.descriptionAr ?? "");
      setDescriptionEn(props.selected?.descriptionEn ?? "");
      setSortOrder(props.selected?.sortOrder ?? 0);
      setIsActive(props.selected?.isActive ?? true);
    }, [props.mode, props.selected]);

    const onSubmit = async () => {
      if (!canSubmit) return;

      const body = {
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim(),
        descriptionAr: descriptionAr.trim(),
        descriptionEn: descriptionEn.trim(),
        isActive,
        sortOrder,
      };

      if (props.mode === "create") {
        await createMutation.mutateAsync(body);
        closeModal();
        return;
      }

      const id = props.selected?.id;
      if (!id) return;
      await updateMutation.mutateAsync({
        id: String(id),
        data: body,
      });
      closeModal();
    };

    return (
      <Stack gap="lg">
        <MutationErrorAlert />
        <TextInput
          label={tm("titleArLabel")}
          placeholder={tm("titleArPlaceholder")}
          value={titleAr}
          onChange={(e) => setTitleAr(e.currentTarget.value)}
          required
        />
        <TextInput
          label={tm("titleEnLabel")}
          placeholder={tm("titleEnPlaceholder")}
          value={titleEn}
          onChange={(e) => setTitleEn(e.currentTarget.value)}
          required
        />
        <Textarea
          label={tm("descriptionArLabel")}
          placeholder={tm("descriptionArPlaceholder")}
          value={descriptionAr}
          onChange={(e) => setDescriptionAr(e.currentTarget.value)}
          minRows={3}
          required
        />
        <Textarea
          label={tm("descriptionEnLabel")}
          placeholder={tm("descriptionEnPlaceholder")}
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.currentTarget.value)}
          minRows={3}
          required
        />
        <NumberInput
          label={tm("sortOrderLabel")}
          value={sortOrder}
          onChange={(v) => setSortOrder(Number(v ?? 0))}
          min={0}
        />
        <Switch
          label={tm("isActiveLabel")}
          checked={isActive}
          onChange={(e) => setIsActive(e.currentTarget.checked)}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={closeModal}>
            {tcForm("cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={!canSubmit}>
            {props.mode === "create" ? tcForm("create") : tcForm("save")}
          </Button>
        </Group>
      </Stack>
    );
  };

  const onDelete = async () => {
    if (!selected?.id) return;
    await deleteMutation.mutateAsync(String(selected.id));
    closeModal();
  };

  const modalStyles = {
    content: {
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: "light-dark(rgba(255,255,255,0.94), rgba(18,18,23,0.9))",
      border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
      boxShadow: "0 24px 80px rgba(15, 23, 42, 0.24)",
    },
  };

  return (
    <>
      <Modal
        opened={activeModal === "create"}
        onClose={closeModal}
        title={
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={46} radius="lg" variant="light" color="blue">
              <IconBriefcase size={22} />
            </ThemeIcon>
            <Stack gap={3}>
              <Title order={4}>{t("modalCreateTitle")}</Title>
              <Text size="sm" c="dimmed">
                {t("modalCreateSubtitle")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size="lg"
        radius="xl"
        styles={modalStyles}
      >
        <Form key="create" mode="create" selected={null} />
      </Modal>

      <Modal
        opened={activeModal === "edit"}
        onClose={closeModal}
        title={
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={46} radius="lg" variant="light" color="blue">
              <IconBriefcase size={22} />
            </ThemeIcon>
            <Stack gap={3}>
              <Title order={4}>{t("modalEditTitle")}</Title>
              <Text size="sm" c="dimmed">
                {t("modalEditSubtitle")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size="lg"
        radius="xl"
        styles={modalStyles}
      >
        <Form key={selected?.id ?? "edit"} mode="edit" selected={selected} />
      </Modal>

      <Modal opened={activeModal === "delete"} onClose={closeModal} title={t("deleteModalTitle")} centered>
        <Stack>
          <MutationErrorAlert />
          <Text size="sm" dir="auto">
            {t("deleteConfirmMessage", {
              name:
                selected?.titleEn?.trim() ||
                selected?.titleAr?.trim() ||
                t("deleteFallbackJob"),
            })}
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={closeModal}>
              {tc("cancel")}
            </Button>
            <Button color="red" onClick={onDelete} disabled={!selected?.id}>
              {tc("delete")}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export { Modals };
