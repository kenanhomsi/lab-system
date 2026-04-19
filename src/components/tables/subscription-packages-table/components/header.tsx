"use client";

import { Select } from "@mantine/core";
import { IconFilter, IconPackage, IconPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { TablePageHeader } from "@/components/table-page-header";
import { TargetAudience } from "../types";

type Props = {
  totalPackages: number;
  visiblePackages: number;
  hasActiveFilters: boolean;
  targetAudienceFilter: TargetAudience | "all";
  setTargetAudienceFilter: (value: TargetAudience | "all") => void;
  isActiveFilter: "all" | "active" | "inactive";
  setIsActiveFilter: (value: "all" | "active" | "inactive") => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  audienceOptions: TargetAudience[];
};

const Header = ({
  totalPackages,
  hasActiveFilters,
  targetAudienceFilter,
  setTargetAudienceFilter,
  isActiveFilter,
  setIsActiveFilter,
  onOpenCreate,
  onResetFilters,
  audienceOptions,
}: Props) => {
  const t = useTranslations("admin.subscriptions");
  const tc = useTranslations("admin.common");

  const safeOptions = (audienceOptions ?? []).filter(
    (a): a is TargetAudience => Boolean(a),
  );

  return (
    <TablePageHeader
      title={t("title")}
      description={t("description")}
      icon={<IconPackage size={22} />}
      iconColor="green"
      totalCount={totalPackages}
      createLabel={t("createModalTitle")}
      createIcon={<IconPlus size={15} />}
      onOpenCreate={onOpenCreate}
      hasActiveFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
    >
      {/* Audience */}
      <Select
        placeholder={t("allAudiences")}
        value={targetAudienceFilter ?? "all"}
        onChange={(v) =>
          setTargetAudienceFilter((v as TargetAudience | "all") || "all")
        }
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "all", label: t("allAudiences") },
          ...safeOptions.map((a) => ({ value: a, label: a })),
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 180, flex: "1 1 170px" }}
      />

      {/* Status */}
      <Select
        placeholder={t("allStatuses")}
        value={isActiveFilter ?? "all"}
        onChange={(v) =>
          setIsActiveFilter((v as "all" | "active" | "inactive") || "all")
        }
        leftSection={<IconFilter size={13} />}
        radius="xl"
        size="xs"
        data={[
          { value: "all", label: t("allStatuses") },
          { value: "active", label: tc("active") },
          { value: "inactive", label: tc("inactive") },
        ]}
        styles={{ input: { paddingInlineStart: 28 } }}
        style={{ minWidth: 160, flex: "1 1 150px" }}
      />
    </TablePageHeader>
  );
};

export { Header as SubscriptionPackagesHeader };
