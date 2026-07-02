"use client";

import { useMemo, useState } from "react";
import { ActionIcon, Badge, Group, Stack, Text, Tooltip } from "@mantine/core";
import { IconCards, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import { useManagedMutation } from "@/hooks/use-managed-mutation";
import { frontendContainer } from "@/container";
import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { SlideCardFrontendService, slideCardModuleNames } from "@/modules/slide-card";
import type { SlideCardItem } from "@/types/slide-card";
import type { DataTableColumn } from "@/components/tables/roles-table/schema/types";
import { DeleteSlideCardModal } from "./delete-slide-card-modal";
import { SlideCardFormModal } from "./slide-card-form-modal";

type ModalMode = "create" | "edit" | "delete" | null;

const formatDateCell = (value: string | undefined) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

/**
 * Admin table for homepage slide cards with create, edit, and delete.
 */
const SlideCardsTable = () => {
  const t = useTranslations("admin.settings.slideCards");
  const tc = useTranslations("admin.common");
  const slideCardService = frontendContainer.get<SlideCardFrontendService>(
    slideCardModuleNames.service,
  );
  const queryClient = useQueryClient();

  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<SlideCardItem | null>(null);

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin-slide-cards"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-content-map-slide-cards"] });
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
    mutationFn: (payload: Parameters<typeof slideCardService.create>[0]) =>
      slideCardService.create(payload),
    onSuccess: invalidate,
  });

  const updateMutation = useManagedMutation({
    mutationFn: (payload: { id: number } & Parameters<typeof slideCardService.update>[0]) =>
      slideCardService.update(payload),
    onSuccess: invalidate,
  });

  const deleteMutation = useManagedMutation({
    mutationFn: (id: number) => slideCardService.delete({ id }),
    onSuccess: invalidate,
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
        width: "20%",
        render: (row) => <Text size="sm">{row.title}</Text>,
      },
      {
        accessor: "price",
        title: t("columnPrice"),
        width: "10%",
        render: (row) => <Text size="sm">{row.price}</Text>,
      },
      {
        accessor: "discount",
        title: t("columnDiscount"),
        width: "10%",
        render: (row) => <Text size="sm">{row.discount}%</Text>,
      },
      {
        accessor: "badge",
        title: t("columnBadge"),
        width: "10%",
        render: (row) => <Text size="sm">{row.badge || "-"}</Text>,
      },
      {
        accessor: "isActive",
        title: t("columnStatus"),
        width: "10%",
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
      {
        accessor: "actions",
        title: tc("actions"),
        width: "8%",
        render: (row) => (
          <Group gap={4} wrap="nowrap">
            <Tooltip label={tc("edit")} withArrow>
              <ActionIcon
                variant="subtle"
                color="blue"
                aria-label={tc("edit")}
                onClick={() => {
                  setSelected(row);
                  setModal("edit");
                }}
              >
                <IconEdit size={15} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={tc("delete")} withArrow>
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={tc("delete")}
                onClick={() => {
                  setSelected(row);
                  setModal("delete");
                }}
              >
                <IconTrash size={15} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [t, tc],
  );

  const handleFormSubmit = async (payload: {
    id?: number;
    title: string;
    description: string;
    price: number;
    discount: number;
    expiryDate: string;
    badge: string;
    detailPageLink: string;
    displayOrder: number;
    isActive: boolean;
    image?: File;
  }) => {
    if (payload.id) {
      await updateMutation.mutateAsync({
        id: payload.id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        discount: payload.discount,
        expiryDate: payload.expiryDate,
        badge: payload.badge,
        detailPageLink: payload.detailPageLink,
        displayOrder: payload.displayOrder,
        isActive: payload.isActive,
        image: payload.image,
      });
      return;
    }
    if (!payload.image) return;
    await createMutation.mutateAsync({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      discount: payload.discount,
      expiryDate: payload.expiryDate,
      badge: payload.badge,
      detailPageLink: payload.detailPageLink,
      displayOrder: payload.displayOrder,
      isActive: payload.isActive,
      image: payload.image,
    });
  };

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
              icon={<IconCards size={22} />}
              iconColor="blue"
              totalCount={rows.length}
              createLabel={t("create")}
              onOpenCreate={() => setModal("create")}
            />
          </Table.Header>
        </Table>

        {!isPending && rows.length === 0 && (
          <Text size="sm" c="dimmed" ta="center">
            {t("empty")}
          </Text>
        )}

        <SlideCardFormModal
          mode={modal === "edit" ? "edit" : "create"}
          isOpen={modal === "create" || modal === "edit"}
          onClose={closeModal}
          card={modal === "edit" ? selected : null}
          onSubmit={handleFormSubmit}
        />

        <DeleteSlideCardModal
          isOpen={modal === "delete"}
          onClose={closeModal}
          card={selected}
          onDelete={(id) => deleteMutation.mutateAsync(id)}
        />
      </Stack>
    </MutationErrorProvider>
  );
};

export { SlideCardsTable };
