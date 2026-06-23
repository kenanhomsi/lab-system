"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  FileInput,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconEye,
  IconPencil,
  IconPhoto,
  IconSparkles,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { frontendContainer } from "@/container";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { MutationErrorAlert } from "@/components/ui/mutation-error-alert";
import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import {
  WelcomePageFrontendService,
  welcomePageModuleNames,
} from "@/modules/welcome-page";
import type {
  WelcomePageItem,
  WelcomePageMediaType,
} from "@/types/welcome-page";
import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";

type ModalType = "create" | "edit" | "delete" | "view" | null;

type FormState = {
  name: string;
  description: string;
  mediaType: WelcomePageMediaType;
  media: File | null;
  isActive: boolean;
};

const initialFormState: FormState = {
  name: "",
  description: "",
  mediaType: "Image",
  media: null,
  isActive: true,
};

const formatDateCell = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

const isValidFileForMediaType = (file: File, mediaType: WelcomePageMediaType) => {
  const expectedPrefix = mediaType === "Image" ? "image/" : "video/";
  return file.type.startsWith(expectedPrefix) && file.size <= 50 * 1024 * 1024;
};

const MediaPreview = ({
  item,
  src,
  title,
  mediaType,
  height = 260,
}: {
  item?: WelcomePageItem | null;
  src?: string;
  title: string;
  mediaType: WelcomePageMediaType;
  height?: number;
}) => {
  const source = src || item?.mediaUrl || "";
  if (!source) {
    return (
      <Group gap="xs" c="dimmed">
        <IconPhoto size={16} />
        <Text size="sm">-</Text>
      </Group>
    );
  }

  if (mediaType === "Video") {
    return (
      <video
        src={source}
        controls
        muted
        playsInline
        style={{
          width: "100%",
          maxHeight: height,
          objectFit: "cover",
          borderRadius: 8,
          background: "#0f172a",
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={source}
      alt={title}
      style={{
        width: "100%",
        maxHeight: height,
        objectFit: "cover",
        borderRadius: 8,
        background: "#0f172a",
      }}
    />
  );
};

export function WelcomePagesTable() {
  const t = useTranslations("admin.settings.welcomePages");
  const tc = useTranslations("admin.common");
  const queryClient = useQueryClient();
  const welcomePageService = frontendContainer.get<WelcomePageFrontendService>(
    welcomePageModuleNames.service,
  );

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<WelcomePageItem | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);

  const filePreviewUrl = useMemo(
    () => (form.media ? URL.createObjectURL(form.media) : ""),
    [form.media],
  );

  useEffect(() => {
    if (!filePreviewUrl) return undefined;
    return () => URL.revokeObjectURL(filePreviewUrl);
  }, [filePreviewUrl]);

  const openCreate = () => {
    setSelected(null);
    setForm(initialFormState);
    setActiveModal("create");
  };

  const openRowModal = (modal: Exclude<ModalType, "create" | null>, row: WelcomePageItem) => {
    setSelected(row);
    setForm({
      name: row.name,
      description: row.description,
      mediaType: row.mediaType,
      media: null,
      isActive: row.isActive,
    });
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelected(null);
    setForm(initialFormState);
  };

  const { data, isPending } = useQuery({
    queryKey: ["admin-welcome-pages"],
    queryFn: () =>
      welcomePageService.findAll({
        query: {
          Page: "1",
          PageSize: "100",
        },
      }),
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-welcome-pages"] });
  };

  const createMutation = useManagedMutation({
    mutationFn: async () => {
      if (!form.media) throw new Error(t("errorMediaRequired"));
      return welcomePageService.create({
        name: form.name,
        description: form.description,
        mediaType: form.mediaType,
        media: form.media,
        isActive: form.isActive,
      });
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const updateMutation = useManagedMutation({
    mutationFn: async () => {
      if (!selected) throw new Error(t("errorMissingSelection"));
      return welcomePageService.update({
        id: selected.id,
        name: form.name,
        description: form.description,
        mediaType: form.mediaType,
        media: form.media ?? undefined,
        isActive: form.isActive,
      });
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const deleteMutation = useManagedMutation({
    mutationFn: async () => {
      if (!selected) throw new Error(t("errorMissingSelection"));
      await welcomePageService.delete({ id: selected.id });
    },
    onSuccess: async () => {
      await invalidate();
      closeModal();
    },
  });

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const schema = useMemo<DataTableColumn<WelcomePageItem>[]>(
    () => [
      {
        accessor: "name",
        title: t("columnName"),
        width: "18%",
        render: (row) => <Text size="sm">{row.name}</Text>,
      },
      {
        accessor: "description",
        title: t("columnDescription"),
        width: "24%",
        render: (row) => (
          <Text size="sm" lineClamp={2}>
            {row.description}
          </Text>
        ),
      },
      {
        accessor: "mediaType",
        title: t("columnMediaType"),
        width: "12%",
        render: (row) => (
          <Badge variant="light" color={row.mediaType === "Image" ? "blue" : "violet"}>
            {t(`mediaTypeOptions.${row.mediaType}`)}
          </Badge>
        ),
      },
      {
        accessor: "mediaUrl",
        title: t("columnPreview"),
        width: "14%",
        render: (row) => (
          <Box w={86} h={48} style={{ overflow: "hidden", borderRadius: 6 }}>
            {row.mediaType === "Video" ? (
              <video
                src={row.mediaUrl}
                muted
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.mediaUrl}
                alt={row.name}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </Box>
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
        accessor: "updatedAt",
        title: t("columnUpdatedAt"),
        width: "12%",
        render: (row) => <Text size="sm">{formatDateCell(row.updatedAt)}</Text>,
      },
      {
        accessor: "actions",
        title: t("columnActions"),
        width: "14%",
        render: (row) => (
          <Group gap={6} wrap="nowrap">
            <Tooltip label={t("view")}>
              <ActionIcon variant="subtle" color="blue" onClick={() => openRowModal("view", row)}>
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("edit")}>
              <ActionIcon variant="subtle" color="gray" onClick={() => openRowModal("edit", row)}>
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t("delete")}>
              <ActionIcon variant="subtle" color="red" onClick={() => openRowModal("delete", row)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [t],
  );

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const isFormModal = activeModal === "create" || activeModal === "edit";
  const canSubmit = Boolean(
    form.name.trim() &&
      form.description.trim() &&
      (activeModal === "edit" || form.media) &&
      (!form.media || isValidFileForMediaType(form.media, form.mediaType)) &&
      !isSubmitting,
  );

  const mediaTypeOptions = [
    { value: "Image", label: t("mediaTypeOptions.Image") },
    { value: "Video", label: t("mediaTypeOptions.Video") },
  ];

  return (
    <MutationErrorProvider>
      <Stack gap="md">
        <Table
          type="normal"
          isLoading={isPending}
          schema={schema}
          OnPageNumberChange={() => {}}
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
              icon={<IconSparkles size={22} />}
              iconColor="blue"
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
          opened={isFormModal}
          onClose={closeModal}
          title={
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={42} radius="md" variant="light" color="blue">
                <IconSparkles size={22} />
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
              value={form.name}
              onChange={(event) => {
                const name = event.currentTarget.value;
                setForm((current) => ({ ...current, name }));
              }}
              required
            />
            <Textarea
              label={t("descriptionLabel")}
              placeholder={t("descriptionPlaceholder")}
              value={form.description}
              onChange={(event) => {
                const description = event.currentTarget.value;
                setForm((current) => ({ ...current, description }));
              }}
              minRows={3}
              required
            />
            <Select
              label={t("mediaTypeLabel")}
              data={mediaTypeOptions}
              value={form.mediaType}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  mediaType: value === "Video" ? "Video" : "Image",
                  media: null,
                }))
              }
              allowDeselect={false}
              required
            />
            <FileInput
              label={t("mediaLabel")}
              placeholder={
                activeModal === "edit" ? t("mediaReplacePlaceholder") : t("mediaPlaceholder")
              }
              leftSection={<IconUpload size={14} />}
              accept={form.mediaType === "Image" ? "image/*" : "video/*"}
              value={form.media}
              onChange={(media) => setForm((current) => ({ ...current, media }))}
              required={activeModal === "create"}
              clearable
              description={t("mediaDescription")}
            />
            <Switch
              label={t("isActiveLabel")}
              checked={form.isActive}
              onChange={(event) => {
                const isActive = event.currentTarget.checked;
                setForm((current) => ({ ...current, isActive }));
              }}
            />
            {filePreviewUrl || selected?.mediaUrl ? (
              <Stack gap={6}>
                <Text size="sm" fw={600}>
                  {t("preview")}
                </Text>
                <MediaPreview
                  src={filePreviewUrl}
                  item={selected}
                  title={form.name || t("preview")}
                  mediaType={form.mediaType}
                />
              </Stack>
            ) : null}
            <Group justify="flex-end">
              <Button variant="default" onClick={closeModal} disabled={isSubmitting}>
                {tc("cancel")}
              </Button>
              <Button
                onClick={() =>
                  activeModal === "create"
                    ? createMutation.mutate()
                    : updateMutation.mutate()
                }
                loading={isSubmitting}
                disabled={!canSubmit}
              >
                {activeModal === "create" ? tc("create") : tc("save")}
              </Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={activeModal === "view"}
          onClose={closeModal}
          title={
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon size={42} radius="md" variant="light" color="blue">
                <IconSparkles size={22} />
              </ThemeIcon>
              <Stack gap={0}>
                <Title order={4}>{t("modalViewTitle")}</Title>
                <Text size="sm" c="dimmed">
                  {selected?.name ?? ""}
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
          {selected ? (
            <Stack gap="md">
              <MediaPreview
                item={selected}
                title={selected.name}
                mediaType={selected.mediaType}
                height={360}
              />
              <Group gap="sm">
                <Title order={4}>{selected.name}</Title>
                <Badge variant="light" color={selected.isActive ? "green" : "gray"}>
                  {selected.isActive ? t("active") : t("inactive")}
                </Badge>
                <Badge variant="light" color={selected.mediaType === "Image" ? "blue" : "violet"}>
                  {t(`mediaTypeOptions.${selected.mediaType}`)}
                </Badge>
              </Group>
              <Text c="dimmed">{selected.description}</Text>
            </Stack>
          ) : null}
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
                  {t("modalDeleteWarning")}
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
            <Alert color="red" radius="lg" icon={<IconAlertTriangle size={18} />}>
              <Text size="sm">{t("modalDeleteBody", { name: selected?.name ?? "" })}</Text>
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
