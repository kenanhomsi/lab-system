"use client";

import { Table } from "@/components/table";
import { TablePageHeader } from "@/components/table-page-header";
import { ActionIcon, CloseButton, TextInput, Tooltip } from "@mantine/core";
import {
  IconPlus,
  IconRefresh,
  IconSearch,
  IconUserPlus,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMirror } from "./store";

const UI = () => {
  const t = useTranslations("externalPatients");
  const schema = useMirror("schema");
  const isPending = useMirror("isPending");
  const searchValue = useMirror("searchValue");
  const setSearchValue = useMirror("setSearchValue");
  const pageNumber = useMirror("pageNumber");
  const setPageNumber = useMirror("setPageNumber");
  const pageSize = useMirror("pageSize");
  const externalPatientsData = useMirror("externalPatientsData");
  const setActiveModal = useMirror("setActiveModal");
  const setSelectedPatient = useMirror("setSelectedPatient");

  const hasActiveFilters = Boolean(searchValue.trim());

  return (
    <Table
      type="normal"
      isLoading={isPending}
      schema={schema}
      OnPageNumberChange={setPageNumber}
      data={externalPatientsData?.items ?? []}
      paginationStatic={{
        count: externalPatientsData?.totalCount ?? 0,
        limit: externalPatientsData?.pageSize ?? pageSize ?? 20,
        page: externalPatientsData?.page ?? pageNumber ?? 1,
      }}
      tableStriped
      tableHighlightOnHover
      dataTableVerticalSpacing="md"
      dataTableHorizontalSpacing="sm"
    >
      <Table.Header>
        <TablePageHeader
          title={t("title")}
          description={t("description")}
          icon={<IconUserPlus size={22} />}
          iconColor="teal"
          totalCount={externalPatientsData?.totalCount ?? 0}
          createLabel={t("createLabel")}
          createIcon={<IconPlus size={15} />}
          onOpenCreate={() => {
            setSelectedPatient(null);
            setActiveModal("create");
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={() => {
            setSearchValue("");
            setPageNumber(1);
          }}
        >
          <TextInput
            placeholder={t("searchPlaceholder")}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
              setPageNumber(1);
            }}
            leftSection={<IconSearch size={14} />}
            rightSection={
              searchValue ? (
                <CloseButton
                  onClick={() => {
                    setSearchValue("");
                    setPageNumber(1);
                  }}
                  size="sm"
                />
              ) : null
            }
            rightSectionPointerEvents="auto"
            radius="xl"
            size="xs"
            style={{ flex: "1 1 240px", minWidth: 200 }}
          />
          {hasActiveFilters && (
            <Tooltip label={t("resetFilters")} withArrow>
              <ActionIcon
                variant="light"
                color="gray"
                radius="xl"
                size="md"
                onClick={() => {
                  setSearchValue("");
                  setPageNumber(1);
                }}
              >
                <IconRefresh size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </TablePageHeader>
      </Table.Header>
    </Table>
  );
};

export { UI };
