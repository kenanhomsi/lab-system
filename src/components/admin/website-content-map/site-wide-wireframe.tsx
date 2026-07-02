"use client";

import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconAd2, IconEdit, IconHandClick, IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { BannerItem } from "@/types/banner";
import type { WelcomePageItem } from "@/types/welcome-page";
import { BANNER_PLACEMENT } from "@/lib/banners/locations";
import { getAdBarBanners } from "@/lib/website-content-map/aggregate";
import { BannerSliderBlock } from "./section-blocks";
import { useContentMapActions } from "./content-map-actions-context";

type SiteWideWireframeProps = {
  banners: BannerItem[];
  welcomePages: WelcomePageItem[];
};

/**
 * Site-wide promotional surfaces: global ad bar and welcome modal entry.
 */
export function SiteWideWireframe({
  banners,
  welcomePages,
}: SiteWideWireframeProps) {
  const t = useTranslations("admin.settings.contentMap");
  const { openAction } = useContentMapActions();
  const adBarBanners = getAdBarBanners(banners);

  return (
    <Stack gap="md">
      <div>
        <Title order={4}>{t("siteWide")}</Title>
        <Text size="sm" c="dimmed">
          {t("siteWideSubtitle")}
        </Text>
      </div>

      <Paper withBorder radius="lg" p="md" bg="gray.0">
        <Stack gap="md">
          <BannerSliderBlock
            label={t("globalAdBar")}
            placement={BANNER_PLACEMENT.AD_BAR}
            banners={adBarBanners}
          />

          <Paper withBorder radius="md" p="sm">
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <ThemeIcon size="sm" variant="light" color="grape">
                  <IconHandClick size={14} />
                </ThemeIcon>
                <Stack gap={0}>
                  <Text size="sm" fw={600}>
                    {t("welcomeModal")}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {t("welcomeModalHint")}
                  </Text>
                </Stack>
              </Group>
              <Button
                size="compact-xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={() => openAction({ type: "welcome-create" })}
              >
                {t("addWelcomePage")}
              </Button>
            </Group>
            {welcomePages.length === 0 ? (
              <Text size="xs" c="dimmed">
                {t("emptyWelcomePages")}
              </Text>
            ) : (
              <Stack gap="xs">
                {welcomePages.map((item) => (
                  <Group key={item.id} justify="space-between">
                    <Text size="sm">{item.name}</Text>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => openAction({ type: "welcome-edit", item })}
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => openAction({ type: "welcome-delete", item })}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper withBorder radius="md" p="sm" bg="orange.0">
            <Group gap="xs">
              <ThemeIcon size="sm" variant="light" color="orange">
                <IconAd2 size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                {t("popupAdsHint")}
              </Text>
            </Group>
          </Paper>
        </Stack>
      </Paper>
    </Stack>
  );
}
