"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconHandClick, IconUpload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import type {
  CreateWelcomePageRequest,
  UpdateWelcomePageRequest,
  WelcomePageItem,
  WelcomePageMediaType,
} from "@/types/welcome-page";

type Props = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  item?: WelcomePageItem | null;
  onSubmit: (
    payload: CreateWelcomePageRequest | UpdateWelcomePageRequest,
  ) => Promise<void>;
};

export function WelcomePageFormModal({ mode, isOpen, onClose, item, onSubmit }: Props) {
  const t = useTranslations("admin.settings.welcomePages");
  const tc = useTranslations("admin.common");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<WelcomePageMediaType>("Image");
  const [media, setMedia] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(item?.name ?? "");
    setDescription(item?.description ?? "");
    setMediaType(item?.mediaType ?? "Image");
    setIsActive(item?.isActive ?? true);
    setMedia(null);
  }, [isOpen, item]);

  const previewUrl = useMemo(() => {
    if (media) return URL.createObjectURL(media);
    return item?.mediaUrl ?? "";
  }, [item?.mediaUrl, media]);

  useEffect(() => {
    if (!media) return undefined;
    return () => URL.revokeObjectURL(previewUrl);
  }, [media, previewUrl]);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) return;
    if (mode === "create" && !media) return;
    setIsSubmitting(true);
    try {
      if (mode === "create" && media) {
        await onSubmit({ name, description, mediaType, media, isActive });
      } else if (mode === "edit" && item) {
        await onSubmit({
          id: item.id,
          name,
          description,
          mediaType,
          media: media ?? undefined,
          isActive,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon size={42} radius="md" variant="light" color="grape">
            <IconHandClick size={22} />
          </ThemeIcon>
          <Title order={4}>{mode === "create" ? t("modalCreateTitle") : t("modalEditTitle")}</Title>
        </Group>
      }
      centered
      size={640}
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput label={t("nameLabel")} value={name} onChange={(e) => setName(e.currentTarget.value)} required />
        <Textarea label={t("descriptionLabel")} value={description} onChange={(e) => setDescription(e.currentTarget.value)} minRows={3} required />
        <Select
          label={t("mediaTypeLabel")}
          data={[
            { value: "Image", label: t("mediaTypeOptions.Image") },
            { value: "Video", label: t("mediaTypeOptions.Video") },
          ]}
          value={mediaType}
          onChange={(value) => setMediaType(value === "Video" ? "Video" : "Image")}
          allowDeselect={false}
        />
        <FileInput label={t("mediaLabel")} accept={mediaType === "Image" ? "image/*" : "video/*"} value={media} onChange={setMedia} leftSection={<IconUpload size={14} />} required={mode === "create"} clearable />
        {previewUrl ? (
          mediaType === "Video" ? (
            <video src={previewUrl} controls muted playsInline style={{ width: "100%", maxHeight: 200, borderRadius: 8 }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={name} style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8 }} />
          )
        ) : null}
        <Switch label={t("isActiveLabel")} checked={isActive} onChange={(e) => setIsActive(e.currentTarget.checked)} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={isSubmitting}>{tc("cancel")}</Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>{mode === "create" ? tc("create") : tc("save")}</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
