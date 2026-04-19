"use client";

import { ActionIcon, Select, SegmentedControl, TextInput, Tooltip } from "@mantine/core";
import { IconArrowsSort, IconRefresh, IconSearch, IconShield, IconUserPlus, IconUsers } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";

type Props = {
  totalUsers: number;
  visibleUsers: number;
  hasActiveFilters: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  isActiveFilter: "all" | "active" | "inactive";
  setIsActiveFilter: (value: "all" | "active" | "inactive") => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortDesc: boolean;
  setSortDesc: (value: boolean) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  rolesOptions: string[];
};

const UsersHeader = ({
  totalUsers,
  hasActiveFilters,
  searchValue,
  setSearchValue,
  roleFilter,
  setRoleFilter,
  isActiveFilter,
  setIsActiveFilter,
  sortBy,
  setSortBy,
  sortDesc,
  setSortDesc,
  onOpenCreate,
  onResetFilters,
  rolesOptions,
}: Props) => {
  const t = useTranslations("admin.users");
  const tc = useTranslations("admin.common");
  const isFiltered = hasActiveFilters || sortBy !== "createdAt" || !sortDesc;

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconUsers size={22} />}
      iconColor="teal"
      totalCount={totalUsers}
      createLabel={t("createModalTitle")}
      createIcon={<IconUserPlus size={15} />}
      onOpenCreate={onOpenCreate}
      hasActiveFilters={isFiltered}
      onResetFilters={onResetFilters}
    >
      {/* Search */}
      <TextInput
        placeholder={t("searchPlaceholder")}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        leftSection={<IconSearch size={14} />}
        rightSection={
          searchValue ? (
            <TextInput.ClearButton onClick={() => setSearchValue("")} />
          ) : null
        }
        rightSectionPointerEvents="auto"
        radius="xl"
        size="xs"
        style={{ flex: "1 1 200px", minWidth: 180 }}
      />

      {/* Status */}
      <SegmentedControl
        size="xs"
        radius="xl"
        value={isActiveFilter}
        onChange={(v) =>
          setIsActiveFilter((v as "all" | "active" | "inactive") || "all")
        }
        data={[
          { value: "all", label: tc("all") },
          { value: "active", label: tc("active") },
          { value: "inactive", label: tc("inactive") },
        ]}
      />

      {/* Role */}
      <Select
        placeholder={t("roleFilterPlaceholder")}
        value={roleFilter || null}
        onChange={(v) => setRoleFilter(v || "")}
        clearable
        leftSection={<IconShield size={13} />}
        radius="xl"
        size="xs"
        data={rolesOptions.map((r) => ({ value: r, label: r }))}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 120, flex: "0 0 auto" }}
      />

      {/* Sort field */}
      <Select
        placeholder={tc("sortBy")}
        value={sortBy}
        onChange={(v) => setSortBy(v || "createdAt")}
        leftSection={<IconArrowsSort size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "createdAt", label: t("colCreatedAt") },
          { value: "fullName", label: t("colFullName") },
          { value: "email", label: t("email") },
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 130, flex: "0 0 auto" }}
      />

      {/* Sort direction */}
      <Select
        value={sortDesc ? "desc" : "asc"}
        onChange={(v) => setSortDesc((v || "desc") === "desc")}
        radius="xl"
        size="xs"
        data={[
          { value: "desc", label: t("newestFirst") },
          { value: "asc", label: t("oldestFirst") },
        ]}
        style={{ minWidth: 130, flex: "0 0 auto" }}
      />

      {/* Reset (inline fallback for sort-only changes not caught by hasActiveFilters) */}
      {isFiltered && (
        <Tooltip label={tc("resetFilters")} withArrow>
          <ActionIcon
            variant="light"
            color="gray"
            radius="xl"
            size="md"
            onClick={onResetFilters}
          >
            <IconRefresh size={14} />
          </ActionIcon>
        </Tooltip>
      )}
    </TablePageHeader>
  );
};

export { UsersHeader };
