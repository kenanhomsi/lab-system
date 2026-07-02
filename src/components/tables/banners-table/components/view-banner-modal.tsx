"use client";

import { Badge, Group, Modal, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconBrandAndroid } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import {
  getDisplayModeAspectRatio,
  getDisplayModeDetailSize,
  normalizeDisplayMode,
} from "@/lib/banners/display-mode";
import {
  formatPageTargetLabel,
  isPathTarget,
} from "@/lib/banners/locations";
import { getBannerSlots } from "@/lib/banners/slots";
import type { BannerItem } from "../types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  banner: BannerItem | null;
};

const ViewBannerModal = ({ isOpen, onClose, banner }: Props) => {
  const t = useTranslations("admin.settings.banners");
  const tPageTarget = useTranslations("admin.settings.pageTarget");
  const displayMode = normalizeDisplayMode(banner?.displayMode);
  const displaySize = getDisplayModeDetailSize(displayMode);

  const locationLabel = banner
    ? formatPageTargetLabel(
        banner.location,
        (value) => t(`locationOptions.${value}`),
        (key, params) => tPageTarget(key, params),
      )
    : "";

  const slot =
    banner && !isPathTarget(banner.location)
      ? getBannerSlots(banner.location).find((item) => item.order === banner.displayOrder)
      : undefined;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size={42} radius="md" variant="light" color="blue">
            <IconBrandAndroid size={22} />
          </ThemeIcon>
          <Stack gap={0}>
            <Title order={4}>{t("modalViewTitle")}</Title>
            <Text size="sm" c="dimmed">
              {banner?.title ?? ""}
            </Text>
          </Stack>
        </Group>
      }
      centered
      size={Math.min(displaySize.maxWidth + 160, 1100)}
      radius="lg"
      padding="lg"
      overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
    >
      {banner ? (
        <Stack gap="md">
          <Group gap="sm" wrap="wrap">
            <Badge variant="light" color="cyan">
              {t(`displayModeOptions.${displayMode}`)}
            </Badge>
            <Badge variant="light" color={banner.isActive ? "green" : "gray"}>
              {banner.isActive ? t("active") : t("inactive")}
            </Badge>
            <Badge variant="light" color="blue">
              {banner.type || t("titleLabel")}
            </Badge>
          </Group>
          <Stack gap={4}>
            <Text size="sm" fw={600}>
              {t("mediaLabel")}
            </Text>
            {banner.mediaUrl ? (
              banner.mediaUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                <video
                  src={banner.mediaUrl}
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
                  src={banner.mediaUrl}
                  alt={banner.title}
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
              )
            ) : null}
          </Stack>
          <Group gap="sm" align="flex-start">
            <Text size="sm" fw={600}>
              {t("locationLabel")}:
            </Text>
            <Text size="sm" c="dimmed">
              {locationLabel}
              {slot ? ` · ${banner.displayOrder} - ${t(`slotLabels.${slot.labelKey}`)}` : ""}
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <Text size="sm" fw={600}>
              {t("targetTypeLabel")}:
            </Text>
            <Text size="sm" c="dimmed">
              {banner.targetType || "-"}
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <Text size="sm" fw={600}>
              {t("internalLinkLabel")}:
            </Text>
            <Text size="sm" c="dimmed">
              {banner.internalLink || "-"}
            </Text>
          </Group>
          <Group gap="sm" align="flex-start">
            <Text size="sm" fw={600}>
              {t("externalLinkLabel")}:
            </Text>
            <Text size="sm" c="dimmed">
              {banner.externalLink || "-"}
            </Text>
          </Group>
        </Stack>
      ) : null}
    </Modal>
  );
};

export { ViewBannerModal };
