"use client";

import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { WEBSITE_PAGE_BLOCK_TYPES } from "@/lib/website-pages/constants";
import {
  WEBSITE_PAGE_LANGUAGE_LABELS,
  WEBSITE_PAGE_LANGUAGES,
} from "@/lib/website-pages/language";
import type {
  BlockLocalizationForm,
  CardItemForm,
  ContentBlockForm,
} from "@/lib/website-pages/form-state";
import { emptyCard } from "@/lib/website-pages/form-state";
import type { WebsitePageBlockType, WebsitePageLanguage } from "@/types/website-page";

type ContentBlockEditorProps = {
  block: ContentBlockForm;
  blockIndex: number;
  onChange: (next: ContentBlockForm) => void;
  onRemove: () => void;
};

/**
 * Inline editor for a single CMS content block.
 */
export function ContentBlockEditor({
  block,
  blockIndex,
  onChange,
  onRemove,
}: ContentBlockEditorProps) {
  const t = useTranslations("admin.settings.websitePages");

  const updateBlock = (patch: Partial<ContentBlockForm>) => {
    onChange({ ...block, ...patch });
  };

  const updateBlockLocalization = (
    language: WebsitePageLanguage,
    patch: Partial<BlockLocalizationForm>,
  ) => {
    onChange({
      ...block,
      localizations: {
        ...block.localizations,
        [language]: { ...block.localizations[language], ...patch },
      },
    });
  };

  const updateCard = (cardIndex: number, patch: Partial<CardItemForm>) => {
    const cards = block.cards.map((card, index) =>
      index === cardIndex ? { ...card, ...patch } : card,
    );
    updateBlock({ cards });
  };

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Text fw={600}>{t("blockTitle", { index: blockIndex + 1 })}</Text>
          <ActionIcon variant="subtle" color="red" onClick={onRemove}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <Select
            label={t("blockTypeLabel")}
            data={WEBSITE_PAGE_BLOCK_TYPES.map((type) => ({
              value: type,
              label: t(`blockTypes.${type}`),
            }))}
            value={block.blockType}
            onChange={(value) =>
              updateBlock({
                blockType: (value as WebsitePageBlockType | null) ?? "hero",
              })
            }
            allowDeselect={false}
          />
          <NumberInput
            label={t("blockOrderLabel")}
            min={0}
            value={block.order}
            onChange={(value) => updateBlock({ order: Number(value) || 0 })}
          />
          <TextInput
            label={t("animationLabel")}
            value={block.animation}
            onChange={(event) => updateBlock({ animation: event.currentTarget.value })}
          />
          <TextInput
            label={t("customCssClassLabel")}
            value={block.customCssClass}
            onChange={(event) =>
              updateBlock({ customCssClass: event.currentTarget.value })
            }
          />
          <Switch
            label={t("blockIsActiveLabel")}
            checked={block.isActive}
            onChange={(event) => updateBlock({ isActive: event.currentTarget.checked })}
          />
        </SimpleGrid>
        <Tabs defaultValue="en-US">
          <Tabs.List>
            {WEBSITE_PAGE_LANGUAGES.map((language) => (
              <Tabs.Tab key={language} value={language}>
                {WEBSITE_PAGE_LANGUAGE_LABELS[language]}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {WEBSITE_PAGE_LANGUAGES.map((language) => {
            const localization = block.localizations[language];
            return (
              <Tabs.Panel key={language} value={language} pt="md">
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label={t("headingLabel")}
                      value={localization.heading}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          heading: event.currentTarget.value,
                        })
                      }
                    />
                    <TextInput
                      label={t("subheadingLabel")}
                      value={localization.subheading}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          subheading: event.currentTarget.value,
                        })
                      }
                    />
                  </SimpleGrid>
                  <Textarea
                    label={t("descriptionLabel")}
                    value={localization.description}
                    onChange={(event) =>
                      updateBlockLocalization(language, {
                        description: event.currentTarget.value,
                      })
                    }
                    minRows={3}
                  />
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label={t("mediaUrlLabel")}
                      value={localization.mediaUrl}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          mediaUrl: event.currentTarget.value,
                        })
                      }
                    />
                    <TextInput
                      label={t("mediaAltTextLabel")}
                      value={localization.mediaAltText}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          mediaAltText: event.currentTarget.value,
                        })
                      }
                    />
                    <TextInput
                      label={t("buttonTextLabel")}
                      value={localization.buttonText}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          buttonText: event.currentTarget.value,
                        })
                      }
                    />
                    <TextInput
                      label={t("buttonLinkLabel")}
                      value={localization.buttonLink}
                      onChange={(event) =>
                        updateBlockLocalization(language, {
                          buttonLink: event.currentTarget.value,
                        })
                      }
                    />
                  </SimpleGrid>
                </Stack>
              </Tabs.Panel>
            );
          })}
        </Tabs>
        {block.blockType === "cards" ? (
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={600}>
                {t("cardsLabel")}
              </Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={() => updateBlock({ cards: [...block.cards, emptyCard()] })}
              >
                {t("addCard")}
              </Button>
            </Group>
            {block.cards.map((card, cardIndex) => (
              <Paper key={cardIndex} withBorder radius="md" p="sm">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>
                      {t("cardTitle", { index: cardIndex + 1 })}
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() =>
                        updateBlock({
                          cards: block.cards.filter((_item, index) => index !== cardIndex),
                        })
                      }
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                    <TextInput
                      label={t("cardItemTitleLabel")}
                      value={card.title}
                      onChange={(event) =>
                        updateCard(cardIndex, { title: event.currentTarget.value })
                      }
                    />
                    <TextInput
                      label={t("cardItemImageUrlLabel")}
                      value={card.imageUrl}
                      onChange={(event) =>
                        updateCard(cardIndex, { imageUrl: event.currentTarget.value })
                      }
                    />
                    <TextInput
                      label={t("cardItemLinkLabel")}
                      value={card.link}
                      onChange={(event) =>
                        updateCard(cardIndex, { link: event.currentTarget.value })
                      }
                    />
                  </SimpleGrid>
                  <Textarea
                    label={t("cardItemDescriptionLabel")}
                    value={card.description}
                    onChange={(event) =>
                      updateCard(cardIndex, { description: event.currentTarget.value })
                    }
                    minRows={2}
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Paper>
  );
}
