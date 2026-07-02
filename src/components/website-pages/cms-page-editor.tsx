"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconDeviceFloppy,
  IconExternalLink,
  IconPlus,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { ContentBlockEditor } from "@/components/website-pages/content-block-editor";
import {
  WEBSITE_PAGE_PUBLISH_STATUSES,
} from "@/lib/website-pages/constants";
import {
  WEBSITE_PAGE_LANGUAGE_LABELS,
  WEBSITE_PAGE_LANGUAGES,
} from "@/lib/website-pages/language";
import {
  createBlock,
  formToPayload,
  hasRequiredTranslations,
  pageToForm,
  reorderBlocks,
  renumberBlocks,
  type PageFormState,
} from "@/lib/website-pages/form-state";
import { PageFrontendService, pageModuleNames } from "@/modules/pages";
import type { PageListItemDto } from "@/types/website-page";
import type { WebsitePagePublishStatus } from "@/types/website-page";
import { useContentMapActions } from "@/components/admin/website-content-map/content-map-actions-context";

type CmsPageEditorProps = {
  page: PageListItemDto;
};

/**
 * Full inline CMS page editor for the content map.
 */
export function CmsPageEditor({ page }: CmsPageEditorProps) {
  const t = useTranslations("admin.settings.contentMap");
  const tPages = useTranslations("admin.settings.websitePages");
  const locale = useLocale();
  const { mutations } = useContentMapActions();
  const pageService = frontendContainer.get<PageFrontendService>(
    pageModuleNames.service,
  );

  const [form, setForm] = useState<PageFormState | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["admin-content-map-page", page.id],
    queryFn: () => pageService.findOne({ id: page.id }),
    enabled: page.id > 0,
  });

  useEffect(() => {
    if (!data || typeof data !== "object") return;
    setForm(pageToForm(data as Parameters<typeof pageToForm>[0]));
    setIsDirty(false);
  }, [data]);

  const openLivePage = () => {
    const slug = page.displaySlug?.trim();
    if (!slug) return;
    window.open(`/${locale}/${slug}`, "_blank", "noopener,noreferrer");
  };

  const handleSave = async () => {
    if (!form || !hasRequiredTranslations(form)) return;
    setIsSaving(true);
    try {
      await mutations.updatePage({ id: page.id, ...formToPayload(form) });
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const addBlock = () => {
    if (!form) return;
    setForm({
      ...form,
      contentBlocks: renumberBlocks([
        ...form.contentBlocks,
        createBlock(form.contentBlocks.length),
      ]),
    });
    setIsDirty(true);
  };

  return (
    <MutationErrorProvider>
      <Stack gap="md">
        <Group justify="space-between">
          <div>
            <Title order={4}>{page.displayTitle || page.displaySlug || "—"}</Title>
            <Text size="sm" c="dimmed">
              /{page.displaySlug ?? ""}
            </Text>
          </div>
          <Group gap="xs">
            {isDirty ? (
              <Text size="xs" c="orange">
                {t("unsavedChanges")}
              </Text>
            ) : null}
            <Button
              variant="light"
              size="compact-sm"
              leftSection={<IconExternalLink size={16} />}
              onClick={openLivePage}
              disabled={!page.displaySlug?.trim()}
            >
              {t("openLivePage")}
            </Button>
            <Button
              size="compact-sm"
              leftSection={<IconDeviceFloppy size={16} />}
              onClick={handleSave}
              loading={isSaving}
              disabled={!form || !hasRequiredTranslations(form)}
            >
              {t("savePage")}
            </Button>
          </Group>
        </Group>

        <Alert color="blue" variant="light">
          {t("cmsNoBannerSlots")}
        </Alert>

        {isPending ? (
          <Group justify="center" py="xl">
            <Loader size="sm" />
          </Group>
        ) : null}

        {isError ? <Alert color="red">{t("cmsLoadError")}</Alert> : null}

        {form ? (
          <Stack gap="md">
            <MutationErrorAlert />
            <Accordion variant="contained">
              <Accordion.Item value="metadata">
                <Accordion.Control>{tPages("publishSection")}</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md" pt="sm">
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                      <Select
                        label={tPages("publishStatusLabel")}
                        data={WEBSITE_PAGE_PUBLISH_STATUSES.map((status) => ({
                          value: status,
                          label: tPages(`publishStatuses.${status}`),
                        }))}
                        value={form.publishStatus}
                        onChange={(value) => {
                          setForm({
                            ...form,
                            publishStatus:
                              (value as WebsitePagePublishStatus | null) ?? "Draft",
                          });
                          setIsDirty(true);
                        }}
                        allowDeselect={false}
                      />
                      <NumberInput
                        label={tPages("orderLabel")}
                        value={form.order}
                        onChange={(value) => {
                          setForm({ ...form, order: Number(value) || 0 });
                          setIsDirty(true);
                        }}
                      />
                      <Switch
                        label={tPages("isVisibleInNavLabel")}
                        checked={form.isVisibleInNav}
                        onChange={(event) => {
                          setForm({
                            ...form,
                            isVisibleInNav: event.currentTarget.checked,
                          });
                          setIsDirty(true);
                        }}
                      />
                      <Switch
                        label={tPages("isActiveLabel")}
                        checked={form.isActive}
                        onChange={(event) => {
                          setForm({ ...form, isActive: event.currentTarget.checked });
                          setIsDirty(true);
                        }}
                      />
                    </SimpleGrid>
                    {WEBSITE_PAGE_LANGUAGES.map((language) => (
                      <Stack key={language} gap="xs">
                        <Text size="sm" fw={600}>
                          {WEBSITE_PAGE_LANGUAGE_LABELS[language]}
                        </Text>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                          <TextInput
                            label={tPages("titleLabel")}
                            value={form.translations[language].title}
                            onChange={(event) => {
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  [language]: {
                                    ...form.translations[language],
                                    title: event.currentTarget.value,
                                  },
                                },
                              });
                              setIsDirty(true);
                            }}
                          />
                          <TextInput
                            label={tPages("slugLabel")}
                            value={form.translations[language].slug}
                            onChange={(event) => {
                              setForm({
                                ...form,
                                translations: {
                                  ...form.translations,
                                  [language]: {
                                    ...form.translations[language],
                                    slug: event.currentTarget.value,
                                  },
                                },
                              });
                              setIsDirty(true);
                            }}
                          />
                        </SimpleGrid>
                      </Stack>
                    ))}
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Group justify="space-between">
              <Text fw={600}>{tPages("blocksSection")}</Text>
              <Button
                size="xs"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={addBlock}
              >
                {t("addBlock")}
              </Button>
            </Group>

            {form.contentBlocks.length === 0 ? (
              <Text size="sm" c="dimmed">
                {t("cmsNoBlocks")}
              </Text>
            ) : (
              form.contentBlocks.map((block, blockIndex) => (
                <Stack key={`${blockIndex}-${block.order}`} gap="xs">
                  <Group justify="flex-end" gap="xs">
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      leftSection={<IconChevronUp size={14} />}
                      disabled={blockIndex === 0}
                      onClick={() => {
                        setForm({
                          ...form,
                          contentBlocks: reorderBlocks(
                            form.contentBlocks,
                            blockIndex,
                            "up",
                          ),
                        });
                        setIsDirty(true);
                      }}
                    >
                      {t("moveUp")}
                    </Button>
                    <Button
                      size="compact-xs"
                      variant="subtle"
                      leftSection={<IconChevronDown size={14} />}
                      disabled={blockIndex === form.contentBlocks.length - 1}
                      onClick={() => {
                        setForm({
                          ...form,
                          contentBlocks: reorderBlocks(
                            form.contentBlocks,
                            blockIndex,
                            "down",
                          ),
                        });
                        setIsDirty(true);
                      }}
                    >
                      {t("moveDown")}
                    </Button>
                  </Group>
                  <ContentBlockEditor
                    block={block}
                    blockIndex={blockIndex}
                    onChange={(next) => {
                      setForm({
                        ...form,
                        contentBlocks: form.contentBlocks.map((item, index) =>
                          index === blockIndex ? next : item,
                        ),
                      });
                      setIsDirty(true);
                    }}
                    onRemove={() => {
                      setForm({
                        ...form,
                        contentBlocks: renumberBlocks(
                          form.contentBlocks.filter((_item, index) => index !== blockIndex),
                        ),
                      });
                      setIsDirty(true);
                    }}
                  />
                </Stack>
              ))
            )}
          </Stack>
        ) : null}
      </Stack>
    </MutationErrorProvider>
  );
}
