"use client";

import { TablePageHeader } from "@/components/table-page-header";
import {
  ActionIcon,
  Alert,
  Center,
  CloseButton,
  Group,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconArrowsSort, IconFlask, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { MedicalTestItem } from "./types";
import { useMedicalTestsCatalogQuery } from "./use-medical-tests-catalog-query";
import { MedicalTestCatalogCard } from "./medical-test-catalog-card";
import { ViewMedicalTestModal } from "./view-medical-test-modal";

const MedicalTestsCatalogView = () => {
  const t = useTranslations("admin.medicalTestsCatalog");
  const tc = useTranslations("admin.common");
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDesc, setSortDesc] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedTest, setSelectedTest] = useState<MedicalTestItem | null>(null);
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);

  const hasActiveFilters = Boolean(searchValue.trim()) || sortBy !== "createdAt" || !sortDesc;
  const sortFieldOptions = useMemo(
    () => [
      { value: "createdAt", label: t("sortCreatedAt") },
      { value: "nameAr", label: t("sortNameAr") },
      { value: "nameEn", label: t("sortNameEn") },
      { value: "price", label: t("sortPrice") },
    ],
    [t],
  );
  const sortDirOptions = useMemo(
    () => [
      { value: "desc", label: tc("newestFirst") },
      { value: "asc", label: tc("oldestFirst") },
    ],
    [tc],
  );

  const { data, isPending, isError, error } = useMedicalTestsCatalogQuery({
    pageNumber,
    pageSize: 20,
    search: debouncedSearch,
    sortBy,
    sortDesc,
  });

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const page = data?.page ?? pageNumber;
  const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(pageSize, 1)));

  return (
    <Stack>
      <TablePageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        icon={<IconFlask size={22} />}
        iconColor="teal"
        totalCount={totalCount}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={() => {
          setSearchValue("");
          setSortBy("createdAt");
          setSortDesc(true);
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
          rightSection={searchValue ? <CloseButton onClick={() => setSearchValue("")} size="sm" /> : null}
          rightSectionPointerEvents="auto"
          radius="xl"
          size="xs"
          style={{ flex: "1 1 240px", minWidth: 200 }}
        />
        <Select
          placeholder={tc("sortBy")}
          value={sortBy}
          onChange={(v) => {
            setSortBy(v || "createdAt");
            setPageNumber(1);
          }}
          leftSection={<IconArrowsSort size={13} />}
          radius="xl"
          size="xs"
          data={sortFieldOptions}
          style={{ minWidth: 160, flex: "0 0 auto" }}
        />
        <Select
          value={sortDesc ? "desc" : "asc"}
          onChange={(v) => {
            setSortDesc((v || "desc") === "desc");
            setPageNumber(1);
          }}
          radius="xl"
          size="xs"
          data={sortDirOptions}
          style={{ minWidth: 130, flex: "0 0 auto" }}
        />
        {hasActiveFilters && (
          <Tooltip label={t("resetFiltersTooltip")} withArrow>
            <ActionIcon
              variant="light"
              color="gray"
              radius="xl"
              size="md"
              onClick={() => {
                setSearchValue("");
                setSortBy("createdAt");
                setSortDesc(true);
                setPageNumber(1);
              }}
            >
              <IconRefresh size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </TablePageHeader>

      {isError ? (
        <Alert color="red" title={t("errorTitle")}>
          {error instanceof Error ? error.message : t("errorBody")}
        </Alert>
      ) : null}

      {isPending ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} height={150} radius="lg" />
          ))}
        </SimpleGrid>
      ) : items.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap={6}>
            <IconFlask size={30} />
            <Text fw={600}>{t("emptyTitle")}</Text>
            <Text size="sm" c="dimmed">
              {t("emptyHint")}
            </Text>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {items.map((item) => (
            <MedicalTestCatalogCard key={item.id} item={item} onClick={setSelectedTest} />
          ))}
        </SimpleGrid>
      )}

      <Group justify="center">
        <Pagination total={totalPages} value={page} onChange={setPageNumber} color="#29ADE3" radius="md" />
      </Group>

      <ViewMedicalTestModal opened={Boolean(selectedTest)} onClose={() => setSelectedTest(null)} test={selectedTest} />
    </Stack>
  );
};

export { MedicalTestsCatalogView };
