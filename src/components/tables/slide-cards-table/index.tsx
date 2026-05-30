"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import {
  IconAlignLeft,
  IconBookmark,
  IconCards,
  IconClockHour4,
  IconCoin,
  IconLayoutList,
  IconLink,
  IconListNumbers,
  IconPercentage,
  IconPhoto,
  IconTag,
  IconUpload,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { SlideCardFrontendService, slideCardModuleNames } from "@/modules/slide-card";
import type { SlideCardItem } from "@/types/slide-card";
import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";

type FormState = {
  title: string;
  description: string;
  price: number;
  discount: number;
  expiryDate: Date | null;
  badge: string;
  detailPageLink: string;
  displayOrder: number;
  isActive: boolean;
  image: File | null;
};

const initialFormState: FormState = {
  title: "",
  description: "",
  price: 0,
  discount: 0,
  expiryDate: null,
  badge: "",
  detailPageLink: "",
  displayOrder: 0,
  isActive: true,
  image: null,
};

const TOTAL_STEPS = 4;

const formatDateCell = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const SlideCardsTable = () => {
  const t = useTranslations("admin.settings.slideCards");
  const tc = useTranslations("admin.common");
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const queryClient = useQueryClient();

  const [opened, setOpened] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialFormState);

  const imagePreviewUrl = useMemo(
    () => (form.image ? URL.createObjectURL(form.image) : null),
    [form.image],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleCloseModal = () => {
    setStep(0);
    setOpened(false);
    setForm(initialFormState);
  };

  const openCreateModal = () => {
    setStep(0);
    setForm(initialFormState);
    setOpened(true);
  };

  const { data, isPending } = useQuery({
    queryKey: ["admin-slide-cards"],
    queryFn: () =>
      slideCardService.findAll({
        query: {
          Page: "1",
          PageSize: "100",
        },
      }),
  });

  const createMutation = useManagedMutation({
    mutationFn: async () => {
      if (!form.image) throw new Error("Image is required");
      return slideCardService.create({
        title: form.title,
        description: form.description,
        price: form.price,
        discount: form.discount,
        expiryDate: form.expiryDate ? form.expiryDate.toISOString() : "",
        badge: form.badge,
        detailPageLink: form.detailPageLink,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
        image: form.image,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin-slide-cards"] });
      handleCloseModal();
    },
  });

  const rows = useMemo<SlideCardItem[]>(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
      const level1 = "data" in data ? (data as { data?: unknown }).data : undefined;
      if (Array.isArray(level1)) return level1 as SlideCardItem[];

      if (level1 && typeof level1 === "object") {
        const level2 = "data" in level1 ? (level1 as { data?: unknown }).data : undefined;
        if (Array.isArray(level2)) return level2 as SlideCardItem[];
      }
    }
    return [];
  }, [data]);

  const schema = useMemo<DataTableColumn<SlideCardItem>[]>(
    () => [
      {
        accessor: "title",
        title: t("columnTitle"),
        width: "22%",
        render: (row) => <Text size="sm">{row.title}</Text>,
      },
      {
        accessor: "price",
        title: t("columnPrice"),
        width: "12%",
        render: (row) => <Text size="sm">{row.price}</Text>,
      },
      {
        accessor: "discount",
        title: t("columnDiscount"),
        width: "12%",
        render: (row) => <Text size="sm">{row.discount}%</Text>,
      },
      {
        accessor: "badge",
        title: t("columnBadge"),
        width: "12%",
        render: (row) => <Text size="sm">{row.badge || "-"}</Text>,
      },
      {
        accessor: "isActive",
        title: t("columnStatus"),
        width: "12%",
        render: (row) => (
          <Badge color={row.isActive ? "green" : "gray"} variant="light">
            {row.isActive ? t("active") : t("inactive")}
          </Badge>
        ),
      },
      {
        accessor: "displayOrder",
        title: t("columnOrder"),
        width: "8%",
        render: (row) => <Text size="sm">{row.displayOrder}</Text>,
      },
      {
        accessor: "startDate",
        title: t("columnStartDate"),
        width: "12%",
        render: (row) => <Text size="sm">{formatDateCell(row.startDate)}</Text>,
      },
      {
        accessor: "endDate",
        title: t("columnEndDate"),
        width: "12%",
        render: (row) => (
          <Text size="sm">{formatDateCell(row.endDate ?? row.expiryDate)}</Text>
        ),
      },
    ],
    [t],
  );

  const canSubmit = Boolean(form.title.trim() && form.image);
  const canGoNextFromBasics = Boolean(form.title.trim());
  const isSubmitting = createMutation.isPending;

  return (
    <MutationErrorProvider>
    <Stack gap="md">
      <Table
        type="normal"
        isLoading={isPending}
        schema={schema}
        OnPageNumberChange={() => { }}
        data={rows}
        paginationStatic={{
          count: rows.length,
          limit: 20,
          page: 1,
        }}
      >
        <Table.Header>
          <TablePageHeader
            title={t("title")}
            description={t("subtitle")}
            icon={<IconCards size={22} />}
            iconColor="blue"
            totalCount={rows.length}
            createLabel={t("create")}
            onOpenCreate={openCreateModal}
          />
        </Table.Header>
      </Table>

      {!isPending && rows.length === 0 && (
        <Text size="sm" c="dimmed" ta="center">
          {t("empty")}
        </Text>
      )}

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          <Group gap="sm" wrap="nowrap" align="flex-start">
            <ThemeIcon size={42} radius="md" variant="light" color="blue">
              <IconCards size={22} />
            </ThemeIcon>
            <Stack gap={2}>
              <Title order={4}>{t("modalCreateTitle")}</Title>
              <Text size="sm" c="dimmed">
                {t("modalCreateSubtitle")}
              </Text>
            </Stack>
          </Group>
        }
        centered
        size={820}
        radius="xl"
        padding="lg"
        closeOnClickOutside={!isSubmitting}
        closeOnEscape={!isSubmitting}
        overlayProps={{ blur: 10, backgroundOpacity: 0.25 }}
        styles={{
          content: {
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            background: "light-dark(rgba(255,255,255,0.92), rgba(18,18,23,0.92))",
            border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          body: { paddingTop: "0.25rem", scrollbarWidth: "none", msOverflowStyle: "none" },
        }}
      >
        <Stack gap="lg">
          <MutationErrorAlert />
          <Text size="xs" c="dimmed">
            {t("formHint")}
          </Text>

          <Stepper active={step} size="sm" color="blue" mt="md">
            <Stepper.Step label={t("stepBasics")} description={t("stepBasicsDesc")} />
            <Stepper.Step label={t("stepPricing")} description={t("stepPricingDesc")} />
            <Stepper.Step label={t("stepLinks")} description={t("stepLinksDesc")} />
            <Stepper.Step label={t("stepMedia")} description={t("stepMediaDesc")} />
          </Stepper>

          {step === 0 && (
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon size={36} radius="md" variant="light" color="blue">
                    <IconTag size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={600}>{t("sectionBasicsTitle")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("sectionBasicsDesc")}
                    </Text>
                  </Stack>
                </Group>
                <TextInput
                  label={t("titleLabel")}
                  placeholder={t("titlePlaceholder")}
                  value={form.title}
                  onChange={(e) => {
                    const title = e.currentTarget.value;
                    setForm((prev) => ({ ...prev, title }));
                  }}
                  leftSection={<IconTag size={16} />}
                  required
                />
                <Textarea
                  label={t("descriptionLabel")}
                  placeholder={t("descriptionPlaceholder")}
                  value={form.description}
                  onChange={(e) => {
                    const description = e.currentTarget.value;
                    setForm((prev) => ({ ...prev, description }));
                  }}
                  leftSection={<IconAlignLeft size={16} />}
                  minRows={2}
                  maxRows={5}
                  autosize
                />
              </Stack>
            </Paper>
          )}

          {step === 1 && (
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon size={36} radius="md" variant="light" color="teal">
                    <IconLayoutList size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={600}>{t("sectionPricingTitle")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("sectionPricingDesc")}
                    </Text>
                  </Stack>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <NumberInput
                    label={t("priceLabel")}
                    value={form.price}
                    onChange={(value) => setForm((prev) => ({ ...prev, price: Number(value) || 0 }))}
                    min={0}
                    hideControls
                    leftSection={<IconCoin size={16} />}
                  />
                  <NumberInput
                    label={t("discountLabel")}
                    value={form.discount}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, discount: Number(value) || 0 }))
                    }
                    min={0}
                    max={100}
                    suffix="%"
                    hideControls
                    leftSection={<IconPercentage size={16} />}
                  />
                  <DateTimePicker
                    label={t("expiryDateLabel")}
                    placeholder={t("expiryPlaceholder")}
                    value={form.expiryDate}
                    onChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        expiryDate:
                          typeof value === "string"
                            ? value
                              ? new Date(value)
                              : null
                            : value,
                      }))
                    }
                    valueFormat="MM/DD/YYYY hh:mm A"
                    clearable
                    leftSection={<IconClockHour4 size={16} />}
                  />
                  <NumberInput
                    label={t("displayOrderLabel")}
                    value={form.displayOrder}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, displayOrder: Number(value) || 0 }))
                    }
                    min={0}
                    hideControls
                    leftSection={<IconListNumbers size={16} />}
                  />
                </SimpleGrid>
              </Stack>
            </Paper>
          )}

          {step === 2 && (
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon size={36} radius="md" variant="light" color="violet">
                    <IconLink size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={600}>{t("sectionLinksTitle")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("sectionLinksDesc")}
                    </Text>
                  </Stack>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <TextInput
                    label={t("badgeLabel")}
                    placeholder={t("badgePlaceholder")}
                    value={form.badge}
                    onChange={(e) => {
                      const badge = e.currentTarget.value;
                      setForm((prev) => ({ ...prev, badge }));
                    }}
                    leftSection={<IconBookmark size={16} />}
                  />
                  <TextInput
                    label={t("detailPageLinkLabel")}
                    placeholder={t("linkPlaceholder")}
                    value={form.detailPageLink}
                    onChange={(e) => {
                      const detailPageLink = e.currentTarget.value;
                      setForm((prev) => ({ ...prev, detailPageLink }));
                    }}
                    leftSection={<IconLink size={16} />}
                  />
                </SimpleGrid>
              </Stack>
            </Paper>
          )}

          {step === 3 && (
            <Paper withBorder radius="lg" p="md">
              <Stack gap="md">
                <Group gap="sm" wrap="nowrap" align="flex-start">
                  <ThemeIcon size={36} radius="md" variant="light" color="cyan">
                    <IconPhoto size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text fw={600}>{t("sectionMediaTitle")}</Text>
                    <Text size="sm" c="dimmed">
                      {t("sectionMediaDesc")}
                    </Text>
                  </Stack>
                </Group>
                <FileInput
                  label={t("imageLabel")}
                  placeholder={t("imagePlaceholder")}
                  description={t("imageDescription")}
                  value={form.image}
                  onChange={(value) => setForm((prev) => ({ ...prev, image: value }))}
                  accept="image/*"
                  required
                  clearable
                  leftSection={<IconUpload size={16} />}
                />
                {imagePreviewUrl ? (
                  <Image
                    radius="md"
                    h={180}
                    fit="contain"
                    src={imagePreviewUrl}
                    alt=""
                    bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
                    style={{ border: "1px solid var(--mantine-color-default-border)" }}
                  />
                ) : null}
                <Switch
                  label={t("isActiveLabel")}
                  checked={form.isActive}
                  onChange={(e) => {
                    const isActive = e.currentTarget.checked;
                    setForm((prev) => ({ ...prev, isActive }));
                  }}
                />
              </Stack>
            </Paper>
          )}

          <Group justify="space-between" wrap="wrap" align="center">
            <Button variant="subtle" color="gray" onClick={handleCloseModal} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Group gap="sm">
              {step > 0 && (
                <Button
                  variant="default"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isSubmitting}
                >
                  {tc("back")}
                </Button>
              )}
              {step < TOTAL_STEPS - 1 ? (
                <Button
                  radius="md"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={step === 0 ? !canGoNextFromBasics : false}
                >
                  {tc("next")}
                </Button>
              ) : (
                <Button
                  radius="md"
                  loading={isSubmitting}
                  onClick={() => createMutation.mutate()}
                  disabled={isSubmitting || !canSubmit}
                >
                  {tc("create")}
                </Button>
              )}
            </Group>
          </Group>
        </Stack>
      </Modal>
    </Stack>
    </MutationErrorProvider>
  );
};

export { SlideCardsTable };
