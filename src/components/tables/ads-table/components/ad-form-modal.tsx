"use client";

import {
  Button,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAd2, IconPhoto, IconUpload } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  BANNER_PLACEMENT,
  BANNER_PLACEMENT_VALUES,
  normalizeBannerPlacement,
  type BannerPlacement,
} from "@/lib/banners/locations";
import type { AdItem, AdMediaType } from "@/types/ad";
import { useMirror } from "../store";

type Props = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  ad?: AdItem | null;
};

const isValidFileForMediaType = (file: File, mediaType: AdMediaType) => {
  const expectedPrefix = mediaType === "Image" ? "image/" : "video/";
  return file.type.startsWith(expectedPrefix) && file.size <= 50 * 1024 * 1024;
};

const resolvePagePlacement = (value?: string): BannerPlacement => {
  if (!value) return BANNER_PLACEMENT.HOME_PAGE;
  return normalizeBannerPlacement(value) ?? BANNER_PLACEMENT.HOME_PAGE;
};

/**
 * Create/edit form modal for ads.
 */
const AdFormModal = ({ mode, isOpen, onClose, ad }: Props) => {
  const t = useTranslations("admin.settings.ads");
  const tBanner = useTranslations("admin.settings.banners");
  const tc = useTranslations("admin.common");
  const createAd = useMirror("createAd");
  const updateAd = useMirror("updateAd");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pageName, setPageName] = useState<BannerPlacement>(BANNER_PLACEMENT.HOME_PAGE);
  const [mediaType, setMediaType] = useState<AdMediaType>("Image");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSelectData = useMemo(
    () =>
      BANNER_PLACEMENT_VALUES.map((value) => ({
        value,
        label: tBanner(`locationOptions.${value}`),
      })),
    [tBanner],
  );

  useEffect(() => {
    if (!isOpen) return;
    setName(ad?.name ?? "");
    setDescription(ad?.description ?? "");
    setPageName(resolvePagePlacement(ad?.addressName));
    setMediaType(ad?.mediaType ?? "Image");
    setMediaFile(null);
  }, [ad, isOpen]);

  const previewUrl = useMemo(() => {
    if (!mediaFile) return ad?.mediaUrl ?? "";
    return URL.createObjectURL(mediaFile);
  }, [ad?.mediaUrl, mediaFile]);

  useEffect(() => {
    if (!mediaFile || !previewUrl) return undefined;
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [mediaFile, previewUrl]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !pageName) {
      alert(t("errorRequiredFields"));
      return;
    }
    if (mode === "create" && !mediaFile) {
      alert(t("errorMediaRequired"));
      return;
    }
    if (mediaFile && !isValidFileForMediaType(mediaFile, mediaType)) {
      alert(t("errorInvalidMedia"));
      return;
    }
    if (mode === "edit" && !ad) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "create" && mediaFile) {
        await createAd({
          name,
          description,
          mediaType,
          media: mediaFile,
          addressName: pageName,
        });
      } else if (mode === "edit" && ad) {
        await updateAd({
          id: ad.id,
          name,
          description,
          mediaType,
          media: mediaFile ?? undefined,
          addressName: pageName,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const mediaTypeOptions = [
    { value: "Image", label: t("mediaTypeOptions.Image") },
    { value: "Video", label: t("mediaTypeOptions.Video") },
  ];

  const canSubmit = Boolean(
    name.trim() &&
    description.trim() &&
    pageName &&
    (mode === "edit" || mediaFile) &&
    !isSubmitting,
  );

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconAd2 size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>
              {mode === "create" ? t("modalCreateTitle") : t("modalEditTitle")}
            </Title>
            <Text size="sm" c="dimmed">
              {mode === "create" ? t("modalCreateDescription") : t("modalEditDescription")}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={760}
      radius="lg"
      padding="lg"
      closeOnClickOutside={!isSubmitting}
      closeOnEscape={!isSubmitting}
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
    >
      <Stack gap="md">
        <MutationErrorAlert />
        <TextInput
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          required
        />
        <Textarea
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          minRows={3}
          required
        />
        <Select
          label={t("pageLabel")}
          placeholder={t("pagePlaceholder")}
          description={t("pageDescription")}
          data={pageSelectData}
          value={pageName}
          onChange={(value) =>
            setPageName((value as BannerPlacement) ?? BANNER_PLACEMENT.HOME_PAGE)
          }
          allowDeselect={false}
          searchable
          required
        />
        <Select
          label={t("mediaTypeLabel")}
          data={mediaTypeOptions}
          value={mediaType}
          onChange={(value) => setMediaType(value === "Video" ? "Video" : "Image")}
          allowDeselect={false}
          required
        />
        <FileInput
          label={t("mediaLabel")}
          placeholder={mode === "edit" ? t("mediaReplacePlaceholder") : t("mediaPlaceholder")}
          leftSection={<IconUpload size={14} />}
          accept={mediaType === "Image" ? "image/*" : "video/*"}
          value={mediaFile}
          onChange={setMediaFile}
          required={mode === "create"}
          clearable
          description={t("mediaDescription")}
        />
        {previewUrl ? (
          <Stack gap={6}>
            <Text size="sm" fw={600}>
              {t("preview")}
            </Text>
            {mediaType === "Video" ? (
              <video
                src={previewUrl}
                controls
                muted
                playsInline
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#0f172a",
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={name || t("preview")}
                style={{
                  width: "100%",
                  maxHeight: 260,
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#0f172a",
                }}
              />
            )}
          </Stack>
        ) : (
          <Group gap="xs" c="dimmed">
            <IconPhoto size={16} />
            <Text size="sm">{t("noPreview")}</Text>
          </Group>
        )}
        <Group justify="flex-end">
          <Button variant="default" onClick={handleClose} disabled={isSubmitting}>
            {tc("cancel")}
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting} disabled={!canSubmit}>
            {mode === "create" ? tc("create") : tc("save")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export { AdFormModal };
