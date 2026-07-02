"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Image,
  Menu,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconAd2,
  IconArrowsMove,
  IconCards,
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconLayout,
  IconPhoto,
  IconPlus,
  IconStack2,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { AdItem } from "@/types/ad";
import type { BannerItem } from "@/types/banner";
import type { SlideCardItem } from "@/types/slide-card";
import type { BannerPlacement } from "@/lib/banners/locations";
import { getBannerSlots } from "@/lib/banners/slots";
import {
  getDisplayModePreviewSize,
  normalizeDisplayMode,
} from "@/lib/banners/display-mode";
import { useContentMapActions } from "./content-map-actions-context";

/** Neutral placeholder for fixed page sections not managed here. */
export function StaticSectionBlock({ label }: { label: string }) {
  const t = useTranslations("admin.settings.contentMap");

  return (
    <Paper withBorder radius="md" p="sm" bg="gray.0">
      <Group gap="xs" justify="space-between">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="gray">
            <IconLayout size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
        </Group>
        <Badge size="xs" variant="light" color="gray">
          {t("fixedSection")}
        </Badge>
      </Group>
    </Paper>
  );
}

type BannerSlotBlockProps = {
  order: number;
  placement: BannerPlacement;
  banners: BannerItem[];
  availableSlotOrders?: number[];
};

/** Inline banner slot with thumbnails or empty dashed placeholder. */
export function BannerSlotBlock({
  order,
  placement,
  banners,
  availableSlotOrders = [],
}: BannerSlotBlockProps) {
  const t = useTranslations("admin.settings.contentMap");
  const tBanner = useTranslations("admin.settings.banners");
  const { openAction, mutations } = useContentMapActions();
  const slotDef = getBannerSlots(placement).find((item) => item.order === order);
  const slotLabel = slotDef
    ? tBanner(`slotLabels.${slotDef.labelKey}`)
    : t("bannerSlot", { order });

  const isEmpty = banners.length === 0;

  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      style={{
        borderStyle: isEmpty ? "dashed" : "solid",
        borderColor: isEmpty ? "var(--mantine-color-gray-4)" : undefined,
      }}
    >
      <Group justify="space-between" mb={isEmpty ? 0 : "xs"}>
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="teal">
            <IconPhoto size={14} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            {slotLabel}
          </Text>
          {!isEmpty && banners.length > 1 ? (
            <Badge size="xs" variant="light" color="teal">
              {t("rotationCount", { count: banners.length })}
            </Badge>
          ) : null}
        </Group>
        <Tooltip label={t("addBanner")}>
          <ActionIcon
            variant="light"
            color="teal"
            size="sm"
            onClick={() =>
              openAction({
                type: "banner-create",
                preset: { location: placement, displayOrder: order },
              })
            }
          >
            <IconPlus size={14} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {isEmpty ? (
        <Text size="xs" c="dimmed" mt={4}>
          {t("emptySlot")}
        </Text>
      ) : (
        <Stack gap="xs">
          {banners.map((banner, index) => {
            const size = getDisplayModePreviewSize(
              normalizeDisplayMode(banner.displayMode),
            );
            return (
            <Group key={banner.id} gap="sm" wrap="nowrap" align="flex-start">
              <Image
                src={banner.mediaUrl}
                alt={banner.title}
                w={size.width}
                h={size.height}
                radius="sm"
                fit="cover"
              />
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} lineClamp={1}>
                  {banner.title}
                </Text>
                <Badge
                  size="xs"
                  variant="light"
                  color={banner.isActive ? "green" : "gray"}
                >
                  {banner.isActive ? tBanner("active") : tBanner("inactive")}
                </Badge>
              </Stack>
              <Group gap={4}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => openAction({ type: "banner-edit", banner })}
                >
                  <IconEdit size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={() => openAction({ type: "banner-delete", banner })}
                >
                  <IconTrash size={14} />
                </ActionIcon>
                {availableSlotOrders.length > 0 ? (
                  <Menu withinPortal position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" size="sm">
                        <IconArrowsMove size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      {availableSlotOrders
                        .filter((slotOrder) => slotOrder !== order)
                        .map((slotOrder) => (
                          <Menu.Item
                            key={slotOrder}
                            onClick={() =>
                              void mutations.moveBannerToSlot(
                                banner,
                                placement,
                                slotOrder,
                              )
                            }
                          >
                            {t("moveToSlot", { order: slotOrder })}
                          </Menu.Item>
                        ))}
                    </Menu.Dropdown>
                  </Menu>
                ) : null}
                {index > 0 ? (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() =>
                      void mutations.swapBannerDisplayOrder(
                        banners[index - 1],
                        banner,
                      )
                    }
                  >
                    <IconChevronUp size={14} />
                  </ActionIcon>
                ) : null}
                {index < banners.length - 1 ? (
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() =>
                      void mutations.swapBannerDisplayOrder(
                        banner,
                        banners[index + 1],
                      )
                    }
                  >
                    <IconChevronDown size={14} />
                  </ActionIcon>
                ) : null}
              </Group>
            </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

type SlideCardsBlockProps = {
  cards: SlideCardItem[];
};

/** Homepage slide cards row. */
export function SlideCardsBlock({ cards }: SlideCardsBlockProps) {
  const t = useTranslations("admin.settings.contentMap");
  const { openAction, mutations } = useContentMapActions();

  return (
    <Paper withBorder radius="md" p="sm">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="violet">
            <IconCards size={14} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            {t("slideCards")}
          </Text>
          <Badge size="xs" variant="light">
            {cards.length}
          </Badge>
        </Group>
        <Button
          size="compact-xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={() =>
            openAction({
              type: "slide-card-create",
              preset: { displayOrder: cards.length },
            })
          }
        >
          {t("addSlideCard")}
        </Button>
      </Group>
      {cards.length === 0 ? (
        <Text size="xs" c="dimmed">
          {t("emptySlideCards")}
        </Text>
      ) : (
        <ScrollArea type="auto" offsetScrollbars>
          <Group gap="sm" wrap="nowrap" align="stretch">
            {cards.map((card, index) => (
              <Paper key={card.id} withBorder radius="md" p="xs" w={160}>
                <Image
                  src={card.imageUrl}
                  alt={card.title}
                  h={72}
                  radius="sm"
                  fit="cover"
                  mb={6}
                />
                <Text size="xs" fw={500} lineClamp={2} mb={6}>
                  {card.title}
                </Text>
                <Group gap={4} justify="flex-end">
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => openAction({ type: "slide-card-edit", card })}
                  >
                    <IconEdit size={14} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => openAction({ type: "slide-card-delete", card })}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                  {index > 0 ? (
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() =>
                        void mutations.swapSlideCardDisplayOrder(
                          cards[index - 1],
                          card,
                        )
                      }
                    >
                      <IconChevronUp size={14} />
                    </ActionIcon>
                  ) : null}
                  {index < cards.length - 1 ? (
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={() =>
                        void mutations.swapSlideCardDisplayOrder(
                          card,
                          cards[index + 1],
                        )
                      }
                    >
                      <IconChevronDown size={14} />
                    </ActionIcon>
                  ) : null}
                </Group>
              </Paper>
            ))}
          </Group>
        </ScrollArea>
      )}
    </Paper>
  );
}

type BannerSliderBlockProps = {
  label: string;
  placement: BannerPlacement;
  banners: BannerItem[];
};

/** Specialized card-slider section (medical advice, equipment, etc.). */
export function BannerSliderBlock({
  label,
  placement,
  banners,
}: BannerSliderBlockProps) {
  const t = useTranslations("admin.settings.contentMap");
  const { openAction, mutations } = useContentMapActions();

  return (
    <Paper withBorder radius="md" p="sm" bg="blue.0">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="blue">
            <IconStack2 size={14} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            {label}
          </Text>
          <Badge size="xs" variant="light">
            {banners.length}
          </Badge>
        </Group>
        <Button
          size="compact-xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={() =>
            openAction({
              type: "banner-create",
              preset: { location: placement, displayOrder: banners.length + 1 },
            })
          }
        >
          {t("addBanner")}
        </Button>
      </Group>
      {banners.length === 0 ? (
        <Text size="xs" c="dimmed">
          {t("emptySlider")}
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="xs">
          {banners.map((banner, index) => {
            const size = getDisplayModePreviewSize(
              normalizeDisplayMode(banner.displayMode),
            );
            return (
            <Box key={banner.id}>
              <Image
                src={banner.mediaUrl}
                alt={banner.title}
                h={size.height}
                radius="sm"
                fit="cover"
                mb={4}
              />
              <Group justify="space-between" wrap="nowrap">
                <Text size="xs" lineClamp={1} style={{ flex: 1 }}>
                  {banner.title}
                </Text>
                <Group gap={2}>
                  <ActionIcon
                    variant="subtle"
                    size="xs"
                    onClick={() => openAction({ type: "banner-edit", banner })}
                  >
                    <IconEdit size={12} />
                  </ActionIcon>
                  {index > 0 ? (
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      onClick={() =>
                        void mutations.swapBannerDisplayOrder(
                          banners[index - 1],
                          banner,
                        )
                      }
                    >
                      <IconChevronUp size={12} />
                    </ActionIcon>
                  ) : null}
                  {index < banners.length - 1 ? (
                    <ActionIcon
                      variant="subtle"
                      size="xs"
                      onClick={() =>
                        void mutations.swapBannerDisplayOrder(
                          banner,
                          banners[index + 1],
                        )
                      }
                    >
                      <IconChevronDown size={12} />
                    </ActionIcon>
                  ) : null}
                </Group>
              </Group>
            </Box>
            );
          })}
        </SimpleGrid>
      )}
    </Paper>
  );
}

type PopupAdBannerProps = {
  ads: AdItem[];
  placement: BannerPlacement;
};

/** Pop-up ads pinned at the top of a page wireframe. */
export function PopupAdBanner({ ads, placement }: PopupAdBannerProps) {
  const t = useTranslations("admin.settings.contentMap");
  const { openAction } = useContentMapActions();

  return (
    <Paper withBorder radius="md" p="sm" bg="orange.0">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="orange">
            <IconAd2 size={14} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            {t("popupAd")}
          </Text>
        </Group>
        <Button
          size="compact-xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={() =>
            openAction({
              type: "ad-create",
              preset: { addressName: placement },
            })
          }
        >
          {t("addAd")}
        </Button>
      </Group>
      {ads.length === 0 ? (
        <Text size="xs" c="dimmed">
          {t("emptyPopupAds")}
        </Text>
      ) : (
        <Stack gap="xs">
          {ads.map((ad) => {
            const size = getDisplayModePreviewSize(
              normalizeDisplayMode(ad.displayMode),
            );
            return (
            <Group key={ad.id} gap="sm" wrap="nowrap">
              <Image
                src={ad.mediaUrl}
                alt={ad.name}
                w={size.width}
                h={size.height}
                radius="sm"
                fit="cover"
              />
              <Text size="sm" fw={500} lineClamp={2} style={{ flex: 1 }}>
                {ad.name}
              </Text>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => openAction({ type: "ad-edit", ad })}
              >
                <IconEdit size={14} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => openAction({ type: "ad-delete", ad })}
              >
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

type OverflowBannersBlockProps = {
  overflow: ReadonlyArray<readonly [number, BannerItem[]]>;
};

/** Banners with display orders outside the declared slot registry. */
export function OverflowBannersBlock({ overflow }: OverflowBannersBlockProps) {
  const t = useTranslations("admin.settings.contentMap");
  const { openAction } = useContentMapActions();

  if (overflow.length === 0) return null;

  return (
    <Paper withBorder radius="md" p="sm" style={{ borderStyle: "dashed" }}>
      <Text size="sm" fw={600} c="dimmed" mb="xs">
        {t("overflowBanners")}
      </Text>
      <Stack gap="xs">
        {overflow.map(([order, group]) => (
          <Stack key={order} gap={4}>
            <Text size="xs" c="dimmed">
              {t("overflowOrder", { order, count: group.length })}
            </Text>
            {group.map((banner) => (
              <Group key={banner.id} gap="xs">
                <Text size="xs" style={{ flex: 1 }}>
                  {banner.title}
                </Text>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => openAction({ type: "banner-edit", banner })}
                >
                  <IconEdit size={14} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
