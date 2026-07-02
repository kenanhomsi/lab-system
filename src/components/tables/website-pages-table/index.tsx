"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconArrowDown,
  IconArrowUp,
  IconArrowUpRight,
  IconCards,
  IconDeviceFloppy,
  IconFileDescription,
  IconLanguage,
  IconLayout,
  IconPencil,
  IconPlus,
  IconTrash,
  IconWorldWww,
} from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { frontendContainer } from "@/container";
import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import {
  WEBSITE_PAGE_BLOCK_TYPES,
  WEBSITE_PAGE_PUBLISH_STATUSES,
  WEBSITE_PAGE_VISIBLE_ROLES,
} from "@/lib/website-pages/constants";
import {
  WEBSITE_PAGE_LANGUAGE_LABELS,
  WEBSITE_PAGE_LANGUAGES,
} from "@/lib/website-pages/language";
import {
  createBlock,
  emptyCard,
  formToPayload,
  hasRequiredTranslations,
  initialFormState,
  pageToForm,
  reorderBlocks,
  type BlockLocalizationForm,
  type CardItemForm,
  type ContentBlockForm,
  type PageFormState,
  type TranslationForm,
} from "@/lib/website-pages/form-state";
import { uploadPendingImages } from "@/lib/website-pages/upload-pending-images";
import { ImagePickerInput } from "./image-picker-input";
import { ParentPageSelect } from "./parent-page-select";
import {
  PublishStepFields,
  type PublishStepFieldsHandle,
} from "./publish-step-fields";
import { PageFrontendService, pageModuleNames } from "@/modules/pages";
import type { DataTableColumn } from "@/components/table/store/init";
import type {
  PageListItemDto,
  WebsitePageBlockType,
  WebsitePageLanguage,
  WebsitePagePublishStatus,
} from "@/types/website-page";

type ModalType = "create" | "edit" | "delete" | null;

const TOTAL_STEPS = 4;

const BLOCK_TYPE_COLORS: Record<WebsitePageBlockType, string> = {
  hero: "blue",
  "rich-text": "gray",
  "media-text": "violet",
  cta: "orange",
  cards: "cyan",
};

const formatDateCell = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

/**
 * Admin table and structured editor for website CMS pages.
 */
export function WebsitePagesTable() {
  const t = useTranslations("admin.settings.websitePages");
  const tc = useTranslations("admin.common");
  const locale = useLocale();
  const queryClient = useQueryClient();
  const pageService = frontendContainer.get<PageFrontendService>(
    pageModuleNames.service,
  );

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<PageListItemDto | null>(null);
  const [step, setStep] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState<WebsitePageLanguage>("en-US");
  const [form, setForm] = useState<PageFormState>(() => initialFormState());
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailLoadError, setDetailLoadError] = useState("");
  const publishStepRef = useRef<PublishStepFieldsHandle>(null);

  const { data, isPending } = useQuery({
    queryKey: ["admin-website-pages"],
    queryFn: () => pageService.findAll({ query: { Page: "1", PageSize: "200" } }),
  });

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const parentPageOptions = useMemo(
    () =>
      rows
        .filter((row) => row.id !== selected?.id)
        .map((row) => ({
          value: String(row.id),
          label: row.displayTitle
            ? `${row.displayTitle} (#${row.id})`
            : `#${row.id}`,
          imageUrl: row.openGraphImageUrl ?? null,
        })),
    [rows, selected],
  );

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-website-pages"] });
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelected(null);
    setStep(0);
    setActiveLanguage("en-US");
    setForm(initialFormState());
    publishStepRef.current?.resetChangeNotes();
    setIsLoadingDetail(false);
    setDetailLoadError("");
  };

  const openCreate = () => {
    setSelected(null);
    setStep(0);
    setActiveLanguage("en-US");
    setForm(initialFormState());
    publishStepRef.current?.resetChangeNotes();
    setDetailLoadError("");
    setActiveModal("create");
  };

  const openEdit = async (row: PageListItemDto) => {
    setSelected(row);
    setStep(0);
    setActiveLanguage("en-US");
    setForm(initialFormState());
    publishStepRef.current?.resetChangeNotes();
    setDetailLoadError("");
    setActiveModal("edit");
    setIsLoadingDetail(true);
    try {
      const page = await pageService.findOne({ id: row.id });
      setForm(pageToForm(page));
    } catch (error: unknown) {
      setDetailLoadError(error instanceof Error ? error.message : t("detailLoadError"));
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const openDelete = (row: PageListItemDto) => {
    setSelected(row);
    setActiveModal("delete");
  };

  const createMutation = useManagedMutation({
    mutationFn: async () => {
      const preparedForm = await uploadPendingImages({
        ...form,
        changeNotes: publishStepRef.current?.getChangeNotes() ?? "",
      });
      return pageService.create(formToPayload(preparedForm));
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const updateMutation = useManagedMutation({
    mutationFn: async () => {
      if (!selected) throw new Error(t("errorMissingSelection"));
      const preparedForm = await uploadPendingImages({
        ...form,
        changeNotes: publishStepRef.current?.getChangeNotes() ?? "",
      });
      return pageService.update({ id: selected.id, ...formToPayload(preparedForm) });
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: async () => {
      if (!selected) throw new Error(t("errorMissingSelection"));
      await pageService.delete({ id: selected.id });
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const isEditorOpen = activeModal === "create" || activeModal === "edit";
  const canSubmit = Boolean(form.templateKey.trim() && hasRequiredTranslations(form));

  const previewPage = (row: PageListItemDto) => {
    const slug = row.displaySlug?.trim();
    if (!slug) return;
    window.open(`/${locale}/${slug}`, "_blank", "noopener,noreferrer");
  };

  const schema: DataTableColumn<PageListItemDto>[] = [
      {
        accessor: "displayTitle",
        title: t("columnTitle"),
        width: "20%",
        render: (row) => <Text size="sm">{row.displayTitle || "-"}</Text>,
      },
      {
        accessor: "displaySlug",
        title: t("columnSlug"),
        width: "16%",
        render: (row) => <Text size="sm">{row.displaySlug || "-"}</Text>,
      },
      {
        accessor: "templateKey",
        title: t("columnTemplate"),
        width: "12%",
        render: (row) => <Text size="sm">{row.templateKey || "-"}</Text>,
      },
      {
        accessor: "publishStatus",
        title: t("columnPublishStatus"),
        width: "12%",
        render: (row) => (
          <Badge variant="light" color={row.publishStatus === "Published" ? "green" : "gray"}>
            {row.publishStatus || "-"}
          </Badge>
        ),
      },
      {
        accessor: "isVisibleInNav",
        title: t("columnNav"),
        width: "10%",
        render: (row) => (
          <Badge variant="light" color={row.isVisibleInNav ? "blue" : "gray"}>
            {row.isVisibleInNav ? t("visible") : t("hidden")}
          </Badge>
        ),
      },
      {
        accessor: "visibleToRoles",
        title: t("columnVisibleToRoles"),
        width: "14%",
        render: (row) =>
          row.visibleToRoles?.length ? (
            <Group gap={4} wrap="wrap">
              {row.visibleToRoles.map((role) => (
                <Badge key={role} size="xs" variant="light">
                  {role}
                </Badge>
              ))}
            </Group>
          ) : (
            <Badge variant="light" color="gray">
              {t("allRoles")}
            </Badge>
          ),
      },
      {
        accessor: "isActive",
        title: t("columnStatus"),
        width: "10%",
        render: (row) => (
          <Badge variant="light" color={row.isActive ? "green" : "gray"}>
            {row.isActive ? t("active") : t("inactive")}
          </Badge>
        ),
      },
      {
        accessor: "order",
        title: t("columnOrder"),
        width: "8%",
        render: (row) => <Text size="sm">{row.order}</Text>,
      },
      {
        accessor: "updatedAt",
        title: t("columnUpdatedAt"),
        width: "12%",
        render: (row) => <Text size="sm">{formatDateCell(row.updatedAt)}</Text>,
      },
      {
        accessor: "actions",
        title: t("columnActions"),
        width: "12%",
        render: (row) => (
          <Group gap={6} wrap="nowrap">
            <Tooltip label={t("preview")}>
              <ActionIcon
                variant="subtle"
                color="blue"
                disabled={!row.displaySlug}
                onClick={() => previewPage(row)}
              >
                <IconArrowUpRight size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("edit")}>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => {
                  void openEdit(row);
                }}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("delete")}>
              <ActionIcon variant="subtle" color="red" onClick={() => openDelete(row)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
  ];

  const updateTranslation = (
    language: WebsitePageLanguage,
    patch: Partial<TranslationForm>,
  ) => {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [language]: { ...current.translations[language], ...patch },
      },
    }));
  };

  const updateBlock = (index: number, patch: Partial<ContentBlockForm>) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      ),
    }));
  };

  const updateBlockLocalization = (
    blockIndex: number,
    language: WebsitePageLanguage,
    patch: Partial<BlockLocalizationForm>,
  ) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, index) =>
        index === blockIndex
          ? {
              ...block,
              localizations: {
                ...block.localizations,
                [language]: {
                  ...block.localizations[language],
                  ...patch,
                },
              },
            }
          : block,
      ),
    }));
  };

  const updateCard = (
    blockIndex: number,
    cardIndex: number,
    patch: Partial<CardItemForm>,
  ) => {
    setForm((current) => ({
      ...current,
      contentBlocks: current.contentBlocks.map((block, index) =>
        index === blockIndex
          ? {
              ...block,
              cards: block.cards.map((card, innerIndex) =>
                innerIndex === cardIndex ? { ...card, ...patch } : card,
              ),
            }
          : block,
      ),
    }));
  };

  const handlePublishScheduledAtChange = useCallback((value: string) => {
    setForm((current) => ({
      ...current,
      publishScheduledAt: value,
    }));
  }, []);

  const handlePublishedAtChange = useCallback((value: string) => {
    setForm((current) => ({
      ...current,
      publishedAt: value,
    }));
  }, []);

  return (
    <MutationErrorProvider>
      <Stack gap="md">
        <Table
          type="normal"
          isLoading={isPending}
          schema={schema}
          OnPageNumberChange={() => {}}
          data={rows}
          paginationStatic={{ count: rows.length, limit: 20, page: 1 }}
        >
          <Table.Header>
            <TablePageHeader
              title={t("title")}
              description={t("subtitle")}
              icon={<IconWorldWww size={22} />}
              iconColor="cyan"
              totalCount={rows.length}
              createLabel={t("create")}
              onOpenCreate={openCreate}
            />
          </Table.Header>
        </Table>

        {!isPending && rows.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center">
            {t("empty")}
          </Text>
        ) : null}

        <Modal
          opened={isEditorOpen}
          onClose={closeModal}
          title={
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={42} radius="md" variant="light" color="cyan">
                <IconWorldWww size={22} />
              </ThemeIcon>
              <Stack gap={0}>
                <Title order={4}>
                  {activeModal === "create" ? t("modalCreateTitle") : t("modalEditTitle")}
                </Title>
                <Text size="sm" c="dimmed">
                  {activeModal === "create"
                    ? t("modalCreateDescription")
                    : t("modalEditDescription")}
                </Text>
              </Stack>
            </Group>
          }
          centered
          size={980}
          radius="lg"
          padding="lg"
          closeOnClickOutside={!isSubmitting}
          closeOnEscape={!isSubmitting}
          overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
        >
          <Stack gap="lg">
            <MutationErrorAlert />
            {isLoadingDetail && activeModal === "edit" ? (
              <Text size="sm" c="dimmed">
                {t("loadingDetail")}
              </Text>
            ) : null}
            {detailLoadError ? (
              <Alert color="red" icon={<IconAlertTriangle size={18} />}>
                {detailLoadError}
              </Alert>
            ) : null}
            <Stepper active={step} size="md" color="cyan" iconSize={32}>
              <Stepper.Step
                label={t("stepSettings")}
                description={t("stepSettingsDesc")}
              />
              <Stepper.Step
                label={t("stepTranslations")}
                description={t("stepTranslationsDesc")}
              />
              <Stepper.Step
                label={t("stepBlocks")}
                description={t("stepBlocksDesc")}
              />
              <Stepper.Step
                label={t("stepPublish")}
                description={t("stepPublishDesc")}
              />
            </Stepper>

            {step === 0 ? (
              <Paper withBorder radius="lg" p="md">
                <Stack gap="md">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon variant="light" color="cyan" radius="md">
                      <IconLayout size={18} />
                    </ThemeIcon>
                    <Text fw={600}>{t("settingsSection")}</Text>
                  </Group>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label={t("templateKeyLabel")}
                      value={form.templateKey}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          templateKey: event.currentTarget.value,
                        }))
                      }
                      required
                    />
                    <ParentPageSelect
                      label={t("parentIdLabel")}
                      placeholder={t("parentIdPlaceholder")}
                      value={form.parentId}
                      options={parentPageOptions}
                      onChange={(parentId) =>
                        setForm((current) => ({
                          ...current,
                          parentId,
                        }))
                      }
                    />
                    <NumberInput
                      label={t("orderLabel")}
                      min={0}
                      value={form.order}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          order: Number(value) || 0,
                        }))
                      }
                    />
                    <Select
                      label={t("publishStatusLabel")}
                      data={WEBSITE_PAGE_PUBLISH_STATUSES.map((status) => ({
                        value: status,
                        label: t(`publishStatuses.${status}`),
                      }))}
                      value={form.publishStatus}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          publishStatus:
                            (value as WebsitePagePublishStatus | null) ?? "Draft",
                        }))
                      }
                      allowDeselect={false}
                    />
                  </SimpleGrid>
                  <Divider />
                  <Group gap="xl">
                    <Switch
                      label={t("isVisibleInNavLabel")}
                      checked={form.isVisibleInNav}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isVisibleInNav: event.currentTarget.checked,
                        }))
                      }
                    />
                    <Switch
                      label={t("isActiveLabel")}
                      checked={form.isActive}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          isActive: event.currentTarget.checked,
                        }))
                      }
                    />
                  </Group>
                  <Divider />
                  <MultiSelect
                    label={t("visibleToRolesLabel")}
                    description={t("visibleToRolesDescription")}
                    data={[...WEBSITE_PAGE_VISIBLE_ROLES]}
                    value={form.visibleToRoles}
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        visibleToRoles: value,
                      }))
                    }
                    clearable
                    searchable
                  />
                </Stack>
              </Paper>
            ) : null}

            {step === 1 ? (
              <Paper withBorder radius="lg" p="md">
                <Stack gap="md">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon variant="light" color="cyan" radius="md">
                      <IconLanguage size={18} />
                    </ThemeIcon>
                    <Text fw={600}>{t("translationsSection")}</Text>
                  </Group>
                  <Tabs
                    value={activeLanguage}
                    onChange={(value) =>
                      setActiveLanguage((value as WebsitePageLanguage | null) ?? "en-US")
                    }
                  >
                    <Tabs.List>
                      {WEBSITE_PAGE_LANGUAGES.map((language) => (
                        <Tabs.Tab key={language} value={language}>
                          {WEBSITE_PAGE_LANGUAGE_LABELS[language]}
                        </Tabs.Tab>
                      ))}
                    </Tabs.List>
                    {WEBSITE_PAGE_LANGUAGES.map((language) => {
                      const translation = form.translations[language];
                      return (
                        <Tabs.Panel key={language} value={language} pt="md">
                          <Stack gap="md">
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                              <TextInput
                                label={t("titleLabel")}
                                value={translation.title}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    title: event.currentTarget.value,
                                  })
                                }
                                required
                              />
                              <TextInput
                                label={t("slugLabel")}
                                value={translation.slug}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    slug: event.currentTarget.value
                                      .trim()
                                      .replace(/^\/+/, ""),
                                  })
                                }
                                required
                              />
                              <TextInput
                                label={t("breadcrumbTitleLabel")}
                                value={translation.breadcrumbTitle}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    breadcrumbTitle: event.currentTarget.value,
                                  })
                                }
                              />
                              <TextInput
                                label={t("metaTitleLabel")}
                                value={translation.metaTitle}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    metaTitle: event.currentTarget.value,
                                  })
                                }
                              />
                            </SimpleGrid>
                            <Divider />
                            <Textarea
                              label={t("metaDescriptionLabel")}
                              value={translation.metaDescription}
                              onChange={(event) =>
                                updateTranslation(language, {
                                  metaDescription: event.currentTarget.value,
                                })
                              }
                              minRows={2}
                            />
                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                              <TextInput
                                label={t("metaKeywordsLabel")}
                                value={translation.metaKeywords}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    metaKeywords: event.currentTarget.value,
                                  })
                                }
                              />
                              <TextInput
                                label={t("canonicalUrlLabel")}
                                value={translation.canonicalUrl}
                                onChange={(event) =>
                                  updateTranslation(language, {
                                    canonicalUrl: event.currentTarget.value,
                                  })
                                }
                              />
                            </SimpleGrid>
                            <ImagePickerInput
                              label={t("openGraphImageUrlLabel")}
                              uploadLabel={t("openGraphImageUploadLabel")}
                              urlLabel={t("openGraphImageUrlLabel")}
                              urlPlaceholder={t("imageUrlPlaceholder")}
                              value={translation.openGraphImageUrl}
                              file={translation.openGraphImageFile}
                              previewAlt={translation.title}
                              onChange={(url, file) =>
                                updateTranslation(language, {
                                  openGraphImageUrl: url,
                                  openGraphImageFile: file,
                                })
                              }
                            />
                          </Stack>
                        </Tabs.Panel>
                      );
                    })}
                  </Tabs>
                </Stack>
              </Paper>
            ) : null}

            {step === 2 ? (
              <Stack gap="md">
                <Group justify="space-between">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon variant="light" color="cyan" radius="md">
                      <IconCards size={18} />
                    </ThemeIcon>
                    <Text fw={600}>{t("blocksSection")}</Text>
                  </Group>
                  <Button
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        contentBlocks: [
                          ...current.contentBlocks,
                          createBlock(current.contentBlocks.length),
                        ],
                      }))
                    }
                  >
                    {t("addBlock")}
                  </Button>
                </Group>
                {form.contentBlocks.length === 0 ? (
                  <Alert color="gray" icon={<IconFileDescription size={18} />}>
                    {t("noBlocks")}
                  </Alert>
                ) : null}
                {form.contentBlocks.map((block, blockIndex) => (
                  <Paper key={`${blockIndex}-${block.order}`} withBorder radius="lg" p="md">
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                          <Text fw={600}>{t("blockTitle", { index: blockIndex + 1 })}</Text>
                          <Badge
                            variant="light"
                            color={BLOCK_TYPE_COLORS[block.blockType]}
                          >
                            {t(`blockTypes.${block.blockType}`)}
                          </Badge>
                        </Group>
                        <Group gap={4}>
                          <Tooltip label={t("moveUp")}>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              disabled={blockIndex === 0}
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  contentBlocks: reorderBlocks(
                                    current.contentBlocks,
                                    blockIndex,
                                    "up",
                                  ),
                                }))
                              }
                            >
                              <IconArrowUp size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={t("moveDown")}>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              disabled={blockIndex === form.contentBlocks.length - 1}
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  contentBlocks: reorderBlocks(
                                    current.contentBlocks,
                                    blockIndex,
                                    "down",
                                  ),
                                }))
                              }
                            >
                              <IconArrowDown size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() =>
                              setForm((current) => ({
                                ...current,
                                contentBlocks: current.contentBlocks.filter(
                                  (_block, index) => index !== blockIndex,
                                ),
                              }))
                            }
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
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
                            updateBlock(blockIndex, {
                              blockType: (value as WebsitePageBlockType | null) ?? "hero",
                            })
                          }
                          allowDeselect={false}
                        />
                        <NumberInput
                          label={t("blockOrderLabel")}
                          min={0}
                          value={block.order}
                          onChange={(value) =>
                            updateBlock(blockIndex, { order: Number(value) || 0 })
                          }
                        />
                        <TextInput
                          label={t("animationLabel")}
                          value={block.animation}
                          onChange={(event) =>
                            updateBlock(blockIndex, {
                              animation: event.currentTarget.value,
                            })
                          }
                        />
                        <TextInput
                          label={t("customCssClassLabel")}
                          value={block.customCssClass}
                          onChange={(event) =>
                            updateBlock(blockIndex, {
                              customCssClass: event.currentTarget.value,
                            })
                          }
                        />
                        <Switch
                          label={t("blockIsActiveLabel")}
                          checked={block.isActive}
                          onChange={(event) =>
                            updateBlock(blockIndex, {
                              isActive: event.currentTarget.checked,
                            })
                          }
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
                                      updateBlockLocalization(blockIndex, language, {
                                        heading: event.currentTarget.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("subheadingLabel")}
                                    value={localization.subheading}
                                    onChange={(event) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        subheading: event.currentTarget.value,
                                      })
                                    }
                                  />
                                </SimpleGrid>
                                <Textarea
                                  label={t("descriptionLabel")}
                                  value={localization.description}
                                  onChange={(event) =>
                                    updateBlockLocalization(blockIndex, language, {
                                      description: event.currentTarget.value,
                                    })
                                  }
                                  minRows={3}
                                />
                                <Divider />
                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                  <ImagePickerInput
                                    label={t("mediaUrlLabel")}
                                    uploadLabel={t("mediaUploadLabel")}
                                    urlLabel={t("mediaUrlLabel")}
                                    urlPlaceholder={t("imageUrlPlaceholder")}
                                    value={localization.mediaUrl}
                                    file={localization.mediaFile}
                                    previewAlt={localization.heading}
                                    onChange={(url, file) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        mediaUrl: url,
                                        mediaFile: file,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("mediaAltTextLabel")}
                                    value={localization.mediaAltText}
                                    onChange={(event) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        mediaAltText: event.currentTarget.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("buttonTextLabel")}
                                    value={localization.buttonText}
                                    onChange={(event) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        buttonText: event.currentTarget.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("buttonLinkLabel")}
                                    value={localization.buttonLink}
                                    onChange={(event) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        buttonLink: event.currentTarget.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("buttonStyleLabel")}
                                    value={localization.buttonStyle}
                                    onChange={(event) =>
                                      updateBlockLocalization(blockIndex, language, {
                                        buttonStyle: event.currentTarget.value,
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
                              onClick={() =>
                                updateBlock(blockIndex, {
                                  cards: [...block.cards, emptyCard()],
                                })
                              }
                            >
                              {t("addCard")}
                            </Button>
                          </Group>
                          {block.cards.map((card, cardIndex) => (
                            <Paper key={cardIndex} withBorder radius="md" p="sm">
                              <Stack gap="sm">
                                <Group justify="space-between">
                                  <Group gap="sm">
                                    {card.imageUrl ? (
                                      <Avatar src={card.imageUrl} size={40} radius="sm" />
                                    ) : (
                                      <Avatar size={40} radius="sm" color="gray">
                                        <IconCards size={18} />
                                      </Avatar>
                                    )}
                                    <Text size="sm" fw={600}>
                                      {t("cardTitle", { index: cardIndex + 1 })}
                                    </Text>
                                  </Group>
                                  <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={() =>
                                      updateBlock(blockIndex, {
                                        cards: block.cards.filter(
                                          (_card, index) => index !== cardIndex,
                                        ),
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
                                      updateCard(blockIndex, cardIndex, {
                                        title: event.currentTarget.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label={t("cardItemLinkLabel")}
                                    value={card.link}
                                    onChange={(event) =>
                                      updateCard(blockIndex, cardIndex, {
                                        link: event.currentTarget.value,
                                      })
                                    }
                                  />
                                </SimpleGrid>
                                <ImagePickerInput
                                  label={t("cardItemImageUrlLabel")}
                                  uploadLabel={t("cardImageUploadLabel")}
                                  urlLabel={t("cardItemImageUrlLabel")}
                                  urlPlaceholder={t("imageUrlPlaceholder")}
                                  value={card.imageUrl}
                                  file={card.imageFile}
                                  previewAlt={card.title}
                                  onChange={(url, file) =>
                                    updateCard(blockIndex, cardIndex, {
                                      imageUrl: url,
                                      imageFile: file,
                                    })
                                  }
                                />
                                <Textarea
                                  label={t("cardItemDescriptionLabel")}
                                  value={card.description}
                                  onChange={(event) =>
                                    updateCard(blockIndex, cardIndex, {
                                      description: event.currentTarget.value,
                                    })
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
                ))}
              </Stack>
            ) : null}

            {step === 3 ? (
              <PublishStepFields
                ref={publishStepRef}
                form={form}
                onPublishScheduledAtChange={handlePublishScheduledAtChange}
                onPublishedAtChange={handlePublishedAtChange}
                publishSectionLabel={t("publishSection")}
                publishSummaryTitle={t("publishSummaryTitle")}
                publishSummaryBlocksLabel={t("publishSummaryBlocks", {
                  count: form.contentBlocks.length,
                })}
                publishStatusLabel={(status) => t(`publishStatuses.${status}`)}
                publishScheduledAtLabel={t("publishScheduledAtLabel")}
                publishedAtLabel={t("publishedAtLabel")}
                changeNotesLabel={t("changeNotesLabel")}
              />
            ) : null}

            <Group justify="space-between">
              <Button variant="default" onClick={closeModal} disabled={isSubmitting}>
                {tc("cancel")}
              </Button>
              <Group gap="sm">
                {step > 0 ? (
                  <Button
                    variant="default"
                    onClick={() => setStep((current) => current - 1)}
                    disabled={isSubmitting}
                  >
                    {tc("back")}
                  </Button>
                ) : null}
                {step < TOTAL_STEPS - 1 ? (
                  <Button
                    onClick={() => setStep((current) => current + 1)}
                    disabled={step === 0 ? !form.templateKey.trim() : false}
                  >
                    {tc("next")}
                  </Button>
                ) : (
                  <Button
                    leftSection={<IconDeviceFloppy size={16} />}
                    loading={isSubmitting}
                    disabled={!canSubmit || isSubmitting}
                    onClick={() =>
                      activeModal === "create"
                        ? createMutation.mutate()
                        : updateMutation.mutate()
                    }
                  >
                    {activeModal === "create" ? tc("create") : tc("save")}
                  </Button>
                )}
              </Group>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={activeModal === "delete"}
          onClose={closeModal}
          title={
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={42} radius="md" variant="light" color="red">
                <IconTrash size={22} />
              </ThemeIcon>
              <Stack gap={0}>
                <Title order={4}>{t("modalDeleteTitle")}</Title>
                <Text size="sm" c="dimmed">
                  {t("modalDeleteDescription")}
                </Text>
              </Stack>
            </Group>
          }
          centered
          size="md"
          radius="lg"
          padding="lg"
          closeOnClickOutside={!isSubmitting}
          closeOnEscape={!isSubmitting}
          overlayProps={{ blur: 10, backgroundOpacity: 0.2 }}
        >
          <Stack gap="lg">
            <MutationErrorAlert />
            <Alert color="red" icon={<IconAlertTriangle size={18} />}>
              {t("modalDeleteBody", {
                title: selected?.displayTitle || selected?.displaySlug || "",
              })}
            </Alert>
            <Group justify="flex-end">
              <Button variant="default" onClick={closeModal} disabled={isSubmitting}>
                {tc("cancel")}
              </Button>
              <Button
                color="red"
                onClick={() => deleteMutation.mutate()}
                loading={isSubmitting}
              >
                {tc("delete")}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </MutationErrorProvider>
  );
}
