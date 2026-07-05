"use client";

import { useMemo } from "react";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import type { AdItem } from "@/types/ad";
import type { BannerItem } from "@/types/banner";
import type { SlideCardItem } from "@/types/slide-card";
import {
  getActiveSlideCards,
  getAdsForSurface,
  getBannersForSliderPlacement,
  groupBannersForSurface,
} from "@/lib/website-content-map/aggregate";
import type { BuiltinWebsiteSurface } from "@/lib/website-content-map/surfaces";
import { getBannerSlots } from "@/lib/banners/slots";
import {
  BannerSliderBlock,
  BannerSlotBlock,
  OverflowBannersBlock,
  PopupAdBanner,
  SlideCardsBlock,
  StaticSectionBlock,
} from "./section-blocks";

type PageWireframeProps = {
  surface: BuiltinWebsiteSurface;
  banners: BannerItem[];
  ads: AdItem[];
  slideCards: SlideCardItem[];
};

/**
 * Vertical wireframe for a built-in website route with banners, ads, and Silders.
 */
export function PageWireframe({
  surface,
  banners,
  ads,
  slideCards,
}: PageWireframeProps) {
  const t = useTranslations("admin.settings.contentMap");
  const tBanner = useTranslations("admin.settings.banners");
  const locale = useLocale();

  const slotGroups = groupBannersForSurface(banners, surface.placement);
  const pageAds = getAdsForSurface(ads, surface.placement);
  const activeSlideCards = getActiveSlideCards(slideCards);
  const slotOrders = useMemo(
    () => getBannerSlots(surface.placement).map((item) => item.order),
    [surface.placement],
  );

  const openLivePage = () => {
    const path = surface.path === "/" ? "" : surface.path;
    window.open(`/${locale}${path}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Title order={4}>
            {tBanner(`locationOptions.${surface.placement}`)}
          </Title>
          <Text size="sm" c="dimmed">
            {surface.path}
          </Text>
        </div>
        <Button
          variant="light"
          size="compact-sm"
          leftSection={<IconExternalLink size={16} />}
          onClick={openLivePage}
        >
          {t("openLivePage")}
        </Button>
      </Group>

      <Paper withBorder radius="lg" p="md" bg="gray.0">
        <Stack gap="sm">
          <PopupAdBanner ads={pageAds} placement={surface.placement} />

          {surface.sections.map((section, index) => {
            if (section.kind === "staticSection") {
              return (
                <StaticSectionBlock
                  key={`static-${section.labelKey}-${index}`}
                  label={t(`staticSections.${section.labelKey}`)}
                />
              );
            }

            if (section.kind === "bannerSlot") {
              const slotBanners = slotGroups.slots.get(section.order) ?? [];
              return (
                <BannerSlotBlock
                  key={`slot-${section.order}`}
                  order={section.order}
                  placement={surface.placement}
                  banners={slotBanners}
                  availableSlotOrders={slotOrders}
                />
              );
            }

            if (section.kind === "slideCards") {
              return <SlideCardsBlock key="slide-cards" cards={activeSlideCards} />;
            }

            if (section.kind === "bannerSlider") {
              const sliderBanners = getBannersForSliderPlacement(
                banners,
                section.placement,
              );
              return (
                <BannerSliderBlock
                  key={`slider-${section.placement}`}
                  label={t(`sliders.${section.labelKey}`)}
                  placement={section.placement}
                  banners={sliderBanners}
                />
              );
            }

            if (section.kind === "overflow") {
              return (
                <OverflowBannersBlock
                  key="overflow"
                  overflow={slotGroups.overflow}
                />
              );
            }

            return null;
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
