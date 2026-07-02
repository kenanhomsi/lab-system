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
import { PageTargetSelect } from "@/components/admin/page-target-select";
import {
  BANNER_PLACEMENT,
  isPathTarget,
  normalizeBannerPlacement,
} from "@/lib/banners/locations";
import {
  DISPLAY_MODE,
  DISPLAY_MODE_VALUES,
  getDisplayModeAspectRatio,
  type DisplayMode,
  normalizeDisplayMode,
} from "@/lib/banners/display-mode";
import type { AdItem, AdMediaType, CreateAdRequest, UpdateAdRequest } from "@/types/ad";
import { useMirror } from "../store";

export type AdFormPreset = {
  addressName?: string;
};

export type AdMutationOverrides = {
  onCreate?: (payload: CreateAdRequest) => Promise<void>;
  onUpdate?: (payload: UpdateAdRequest) => Promise<void>;
};

type Props = {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  ad?: AdItem | null;
  preset?: AdFormPreset;
  mutations?: AdMutationOverrides;
};

const isValidFileForMediaType = (file: File, mediaType: AdMediaType) => {
  const expectedPrefix = mediaType === "Image" ? "image/" : "video/";
  return file.type.startsWith(expectedPrefix) && file.size <= 50 * 1024 * 1024;
};

const resolvePageTarget = (value?: string): string => {
  if (!value) return BANNER_PLACEMENT.HOME_PAGE;
  if (isPathTarget(value)) return value;
  return normalizeBannerPlacement(value) ?? BANNER_PLACEMENT.HOME_PAGE;
};

/**
 * Create/edit form modal for ads.
 */
const AdFormModal = ({ mode, isOpen, onClose, ad, preset, mutations }: Props) => {
  const t = useTranslations("admin.settings.ads");
  const tc = useTranslations("admin.common");
  const createAdMirror = useMirror("createAd");
  const updateAdMirror = useMirror("updateAd");
  const createAd = mutations?.onCreate ?? createAdMirror;
  const updateAd = mutations?.onUpdate ?? updateAdMirror;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DISPLAY_MODE.FULL);
  const [pageName, setPageName] = useState<string>(BANNER_PLACEMENT.HOME_PAGE);
  const [mediaType, setMediaType] = useState<AdMediaType>("Image");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(ad?.name ?? "");
    setDescription(ad?.description ?? "");
    setDisplayMode(normalizeDisplayMode(ad?.displayMode));
    setPageName(
      mode === "create" && preset?.addressName
        ? preset.addressName
        : resolvePageTarget(ad?.addressName),
    );
    setMediaType(ad?.mediaType ?? "Image");
    setMediaFile(null);
  }, [ad, isOpen, mode, preset]);

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
          displayMode,
          mediaType,
          media: mediaFile,
          addressName: pageName,
        });
      } else if (mode === "edit" && ad) {
        await updateAd({
          id: ad.id,
          name,
          description,
          displayMode,
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
    displayMode &&
    pageName &&
    (mode === "edit" || mediaFile) &&
    !isSubmitting,
  );

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      keepMounted={false}
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
          label={t("displayModeLabel")}
          placeholder={t("displayModePlaceholder")}
          data={DISPLAY_MODE_VALUES.map((value) => ({
            value,
            label: t(`displayModeOptions.${value}`),
          }))}
          value={displayMode}
          onChange={(value) => setDisplayMode(normalizeDisplayMode(value))}
          allowDeselect={false}
          required
        />
        <PageTargetSelect
          description={t("pageDescription")}
          value={pageName}
          onChange={setPageName}
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
                  aspectRatio: getDisplayModeAspectRatio(displayMode),
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
                  aspectRatio: getDisplayModeAspectRatio(displayMode),
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
