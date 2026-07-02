"use client";

import { Badge, Group, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconAd2 } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  getDisplayModeDetailSize,
  getDisplayModeAspectRatio,
  normalizeDisplayMode,
} from "@/lib/banners/display-mode";
import { formatPageTargetLabel } from "@/lib/banners/locations";
import type { AdItem } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  ad: AdItem | null;
};

/**
 * Read-only detail modal for an ad.
 */
const ViewAdModal = ({ isOpen, onClose, ad }: Props) => {
  const t = useTranslations("admin.settings.ads");
  const tBanner = useTranslations("admin.settings.banners");
  const tPageTarget = useTranslations("admin.settings.pageTarget");
  const displayMode = normalizeDisplayMode(ad?.displayMode);
  const displaySize = getDisplayModeDetailSize(displayMode);
  const pageLabel = ad?.addressName
    ? formatPageTargetLabel(
        ad.addressName,
        (value) => tBanner(`locationOptions.${value}`),
        (key, params) => tPageTarget(key, params),
      )
    : null;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconAd2 size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("modalViewTitle")}</Title>
            <Text size="sm" c="dimmed">
              {ad?.name ?? ""}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={760}
      radius="lg"
      padding="lg"
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
    >
          {ad ? (
        <Stack gap="md">
          <Group gap="sm" wrap="wrap">
            <Badge variant="light" color="cyan">
              {t(`displayModeOptions.${displayMode}`)}
            </Badge>
            <Badge variant="light" color={ad.mediaType === "Image" ? "blue" : "violet"}>
              {t(`mediaTypeOptions.${ad.mediaType}`)}
            </Badge>
          </Group>
          {ad.mediaType === "Video" ? (
            <video
              src={ad.mediaUrl}
              controls
              muted
              playsInline
              style={{
                width: "100%",
                maxWidth: displaySize.maxWidth,
                aspectRatio: getDisplayModeAspectRatio(displayMode),
                maxHeight: displaySize.maxHeight,
                objectFit: "cover",
                borderRadius: 8,
                background: "#0f172a",
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.mediaUrl}
              alt={ad.name}
              style={{
                width: "100%",
                maxWidth: displaySize.maxWidth,
                aspectRatio: getDisplayModeAspectRatio(displayMode),
                maxHeight: displaySize.maxHeight,
                objectFit: "cover",
                borderRadius: 8,
                background: "#0f172a",
              }}
            />
          )}
          <Group gap="sm">
            <Title order={4}>{ad.name}</Title>
          </Group>
          <Text c="dimmed">{ad.description}</Text>
          {pageLabel ? (
            <Group gap="xs">
              <Text size="sm" fw={600}>
                {t("pageLabel")}:
              </Text>
              <Text size="sm" c="dimmed">
                {pageLabel}
              </Text>
            </Group>
          ) : null}
        </Stack>
      ) : null}
    </Modal>
  );
};

export { ViewAdModal };
