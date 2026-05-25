"use client";

import {
  ActionIcon,
  Box,
  CloseButton,
  Divider,
  Group,
  Select,
  SegmentedControl,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconFilter,
  IconRefresh,
  IconSearch,
  IconShield,
  IconSortAscending,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
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
  const hasRoleFilter = Boolean(roleFilter.trim());

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
      {/* Search — full-width row */}
      <TextInput
        placeholder={t("searchPlaceholder")}
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        leftSection={<IconSearch size={14} />}
        rightSection={
          searchValue ? (
            <CloseButton aria-label="Clear" onClick={() => setSearchValue("")} size="sm" />
          ) : null
        }
        rightSectionPointerEvents="auto"
        radius="xl"
        size="xs"
        styles={{
          input: {
            borderColor: searchValue ? "var(--mantine-color-teal-5)" : undefined,
            boxShadow: searchValue
              ? "0 0 0 2px color-mix(in srgb, var(--mantine-color-teal-5) 18%, transparent)"
              : undefined,
            transition: "border-color 0.15s, box-shadow 0.15s",
          },
        }}
        style={{ flex: "1 1 200px", minWidth: 200 }}
      />

      <Divider orientation="vertical" style={{ alignSelf: "stretch", height: "auto" }} />

      {/* Filter group label */}
      <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
        <IconFilter
          size={13}
          style={{ color: isFiltered ? "var(--mantine-color-teal-6)" : "var(--mantine-color-dimmed)" }}
        />
        <Text
          fz="xs"
          fw={500}
          c={isFiltered ? "teal" : "dimmed"}
          style={{ whiteSpace: "nowrap" }}
        >
          {tc("filters")}
        </Text>
      </Group>

      {/* Status segmented */}
      <Box
        style={{
          borderRadius: 999,
          padding: isActiveFilter !== "all" ? "1px" : undefined,
          background:
            isActiveFilter !== "all"
              ? "linear-gradient(135deg, var(--mantine-color-teal-5), var(--mantine-color-cyan-5))"
              : "transparent",
        }}
      >
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
          color={isActiveFilter !== "all" ? (isActiveFilter === "active" ? "teal" : "red") : undefined}
        />
      </Box>

      {/* Role select */}
      <Select
        placeholder={t("roleFilterPlaceholder")}
        value={roleFilter || null}
        onChange={(v) => setRoleFilter(v || "")}
        clearable
        leftSection={
          <IconShield
            size={13}
            style={{ color: hasRoleFilter ? "var(--mantine-color-teal-6)" : undefined }}
          />
        }
        radius="xl"
        size="xs"
        w="auto"
        data={rolesOptions.map((r) => ({ value: r, label: r }))}
        styles={{
          input: {
            fontWeight: hasRoleFilter ? 600 : undefined,
            borderColor: hasRoleFilter ? "var(--mantine-color-teal-5)" : undefined,
            color: hasRoleFilter ? "var(--mantine-color-teal-7)" : undefined,
            paddingInlineStart: 28,
            width: "auto",
            minWidth: 130,
          },
        }}
        style={{ flex: "0 0 auto" }}
      />

      <Divider orientation="vertical" style={{ alignSelf: "stretch", height: "auto" }} />

      {/* Sort group */}
      <Group gap={6} wrap="nowrap" style={{ flexShrink: 0 }}>
        <IconSortAscending size={13} style={{ color: "var(--mantine-color-dimmed)" }} />
        <Text fz="xs" fw={500} c="dimmed" style={{ whiteSpace: "nowrap" }}>
          {tc("sortBy")}
        </Text>
      </Group>

      {/* Sort field */}
      <Select
        value={sortBy}
        onChange={(v) => setSortBy(v || "createdAt")}
        radius="xl"
        size="xs"
        w="auto"
        data={[
          { value: "createdAt", label: t("colCreatedAt") },
          { value: "fullName", label: t("colFullName") },
          { value: "email", label: t("email") },
        ]}
        styles={{
          input: {
            fontWeight: sortBy !== "createdAt" ? 600 : undefined,
            borderColor: sortBy !== "createdAt" ? "var(--mantine-color-violet-5)" : undefined,
            color: sortBy !== "createdAt" ? "var(--mantine-color-violet-7)" : undefined,
            width: "auto",
            minWidth: 130,
          },
        }}
        style={{ flex: "0 0 auto" }}
      />

      {/* Sort direction toggle button */}
      <Tooltip
        label={sortDesc ? t("newestFirst") : t("oldestFirst")}
        withArrow
        position="top"
      >
        <ActionIcon
          variant={!sortDesc ? "filled" : "light"}
          color={!sortDesc ? "violet" : "gray"}
          radius="xl"
          size="md"
          onClick={() => setSortDesc(!sortDesc)}
          style={{
            transition: "transform 0.2s",
          }}
        >
          {sortDesc ? <IconArrowDown size={14} /> : <IconArrowUp size={14} />}
        </ActionIcon>
      </Tooltip>

      {/* Reset filters button */}
      {isFiltered && (
        <Tooltip label={tc("resetFilters")} withArrow>
          <ActionIcon
            variant="light"
            color="red"
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
