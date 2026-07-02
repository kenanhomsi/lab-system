"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import {
  BANNER_PLACEMENT,
  normalizeBannerPlacement,
  type BannerPlacement,
} from "@/lib/banners/locations";
import {
  buildPathTarget,
  inferResourceTypeFromTarget,
  isPathTarget,
  PAGE_RESOURCE_TYPES,
  PAGE_TARGET_SECTION_PLACEMENTS,
  parsePathTarget,
  type PageResourceType,
} from "@/lib/banners/page-target";
import { usePageTargetResourceOptions } from "./use-page-target-lookups";

type PageTargetMode = "section" | "specific";

type PageTargetSelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
  required?: boolean;
};

function inferResourceType(value: string): PageResourceType {
  if (!isPathTarget(value)) return "tests";
  return inferResourceTypeFromTarget(value) ?? "tests";
}

function isValueInOptions(
  targetValue: string,
  options: ReadonlyArray<{ value: string }>,
): boolean {
  return (
    isPathTarget(targetValue) &&
    options.some((option) => option.value === targetValue)
  );
}

/**
 * Admin control for choosing a section-wide or page-specific banner/ad target.
 */
export function PageTargetSelect({
  value,
  onChange,
  label,
  description,
  required = false,
}: PageTargetSelectProps) {
  const t = useTranslations("admin.settings.pageTarget");
  const tBanner = useTranslations("admin.settings.banners");

  const sectionValue =
    normalizeBannerPlacement(value) ?? BANNER_PLACEMENT.HOME_PAGE;
  const resourceTypeFromValue = inferResourceType(value);

  const [uiMode, setUiMode] = useState<PageTargetMode | null>(null);
  const [draftResourceType, setDraftResourceType] =
    useState<PageResourceType | null>(null);
  const [resourceSearch, setResourceSearch] = useState("");

  const mode: PageTargetMode = isPathTarget(value)
    ? "specific"
    : (uiMode ?? "section");
  const activeResourceType = draftResourceType ?? resourceTypeFromValue;

  const sectionSelectData = useMemo(
    () =>
      PAGE_TARGET_SECTION_PLACEMENTS.map((placement) => ({
        value: placement,
        label: tBanner(`locationOptions.${placement}`),
      })),
    [tBanner],
  );

  const resourceTypeData = useMemo(
    () =>
      PAGE_RESOURCE_TYPES.map((type) => ({
        value: type,
        label: t(`resourceTypeLabels.${type}`),
      })),
    [t],
  );

  const sectionModeLabel = t("targetMode.section");
  const specificModeLabel = t("targetMode.specific");

  const { options: resourceOptions, isLoading: isResourceLoading } =
    usePageTargetResourceOptions(
      mode === "specific" ? activeResourceType : null,
      resourceSearch,
    );

  const pageOptions = resourceOptions;

  const firstPageOptionValue = pageOptions[0]?.value ?? null;
  const hasValidPageSelection = isValueInOptions(value, pageOptions);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /** When true, pick the first loaded page for the active resource type. */
  const syncPendingSelectionRef = useRef(false);

  useEffect(() => {
    if (!syncPendingSelectionRef.current) return;
    if (mode !== "specific") {
      syncPendingSelectionRef.current = false;
      return;
    }

    const valueType = isPathTarget(value)
      ? inferResourceTypeFromTarget(value)
      : null;
    if (valueType === activeResourceType) {
      syncPendingSelectionRef.current = false;
      queueMicrotask(() => {
        setDraftResourceType(null);
      });
      return;
    }

    if (isResourceLoading || !firstPageOptionValue) return;

    syncPendingSelectionRef.current = false;
    const nextValue = firstPageOptionValue;
    queueMicrotask(() => {
      onChangeRef.current(nextValue);
      setDraftResourceType(null);
    });
  }, [
    activeResourceType,
    firstPageOptionValue,
    isResourceLoading,
    mode,
    value,
  ]);

  const handleModeChange = (nextMode: PageTargetMode) => {
    setUiMode(nextMode);
    setDraftResourceType(null);
    setResourceSearch("");

    if (nextMode === "section") {
      onChange(sectionValue);
      return;
    }

    if (isPathTarget(value)) return;

    syncPendingSelectionRef.current = true;
  };

  const handleSectionChange = (next: string | null) => {
    const placement =
      (next as BannerPlacement | null) ?? BANNER_PLACEMENT.HOME_PAGE;
    onChange(placement);
  };

  const handleResourceTypeChange = (next: string | null) => {
    const type = (next as PageResourceType | null) ?? "tests";

    if (
      type === activeResourceType &&
      isPathTarget(value) &&
      inferResourceTypeFromTarget(value) === type
    ) {
      return;
    }

    queueMicrotask(() => {
      setDraftResourceType(type);
      setResourceSearch("");
      syncPendingSelectionRef.current = true;
    });
  };

  const handleResourceChange = (next: string | null) => {
    if (!next) return;
    setDraftResourceType(null);
    onChange(next);
  };

  const sectionTitle = label ?? t("sectionTitle");

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
    >
      <Stack gap="md">
        <Stack gap={4}>
          <Group gap={6}>
            <Text size="sm" fw={600}>
              {sectionTitle}
            </Text>
            {required ? (
              <Text component="span" c="red" size="sm">
                *
              </Text>
            ) : null}
          </Group>
          {description ? (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          ) : null}
        </Stack>

        <Group gap={0} grow>
          <Button
            variant={mode === "section" ? "filled" : "default"}
            radius="md"
            onClick={() => handleModeChange("section")}
          >
            {sectionModeLabel}
          </Button>
          <Button
            variant={mode === "specific" ? "filled" : "default"}
            radius="md"
            onClick={() => handleModeChange("specific")}
          >
            {specificModeLabel}
          </Button>
        </Group>

        {mode === "section" ? (
          <Select
            label={t("sectionPageLabel")}
            placeholder={t("sectionPagePlaceholder")}
            data={sectionSelectData}
            value={sectionValue}
            onChange={handleSectionChange}
            searchable
            allowDeselect={false}
            radius="md"
            comboboxProps={{ withinPortal: true }}
          />
        ) : (
          <Stack gap="sm">
            <Select
              label={t("resourceTypeLabel")}
              placeholder={t("resourceTypePlaceholder")}
              data={resourceTypeData}
              value={activeResourceType}
              onChange={handleResourceTypeChange}
              allowDeselect={false}
              radius="md"
              comboboxProps={{ withinPortal: true }}
            />
            <Select
              label={t("specificPageLabel")}
              placeholder={t("specificPagePlaceholder")}
              data={pageOptions}
              value={hasValidPageSelection ? value : null}
              onChange={handleResourceChange}
              searchable
              clearable={false}
              radius="md"
              comboboxProps={{ withinPortal: true }}
              rightSection={
                isResourceLoading ? <Loader size={16} color="gray" /> : undefined
              }
              nothingFoundMessage={
                isResourceLoading ? t("loading") : t("noResults")
              }
              onSearchChange={setResourceSearch}
              searchValue={resourceSearch}
              filter={({ options }) => options}
              disabled={isResourceLoading && pageOptions.length === 0}
            />
            {hasValidPageSelection ? (
              <Text size="xs" c="dimmed" ff="monospace">
                {t("selectedPath", { path: parsePathTarget(value) ?? value })}
              </Text>
            ) : null}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export { buildPathTarget };
