"use client";

import { PropsWithChildren, useMemo } from "react";
import { Text, Group, Anchor, Badge } from "@mantine/core";
import { IconPaperclip } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { useMirrorRegistry } from "../store";
import { EmploymentApplicationItem } from "../types";
import type { DataTableColumn } from "@/components/table/store/init";
import { ActionsRender } from "./columns-rendering/actions-render";

const SchemaForEmploymentApplications = ({ children }: PropsWithChildren) => {
  const t = useTranslations("admin.employmentApplications");
  const locale = useLocale();

  const schema = useMemo<DataTableColumn<EmploymentApplicationItem>[]>(() => {
    return [
      {
        accessor: "fullName",
        title: t("colName"),
        width: "20%",
        render: (row) => (
          <div>
            <Text size="sm" fw={500}>{row.fullName}</Text>
            <Text size="xs" c="dimmed">{row.email} - {row.mobileNumber}</Text>
          </div>
        ),
      },
      {
        accessor: "position",
        title: t("colPosition"),
        width: "12%",
        render: (row) => (
          <Text size="sm">{locale === "ar" ? row.vacantJobTitleAr : row.vacantJobTitleEn}</Text>
        ),
      },
      {
        accessor: "academicDegree",
        title: t("colDegree"),
        width: "15%",
        render: (row) => <Text size="sm">{row.academicDegree}</Text>,
      },
      {
        accessor: "yearsOfExperience",
        title: t("colExperience"),
        width: "10%",
        render: (row) => <Text size="sm">{row.yearsOfExperience} {t("years")}</Text>,
      },
      {
        accessor: "cv",
        title: t("colCv"),
        width: "10%",
        render: (row) => row.cvFileUrl ? (
          <Anchor href={row.cvFileUrl} target="_blank" rel="noreferrer">
            <Group gap={4}>
              <IconPaperclip size={14} />
              <Text size="sm">{t("viewCv")}</Text>
            </Group>
          </Anchor>
        ) : (
          <Text size="sm" c="dimmed">-</Text>
        ),
      },
      {
        accessor: "status",
        title: t("colStatus"),
        width: "10%",
        render: (row) => {
          const raw = row.status || "Pending";
          const normalized = raw.replace(/\s+/g, "").toLowerCase();

          if (normalized === "accepted" || normalized === "approved") {
            return <Badge color="green">{t("statusAccepted")}</Badge>;
          }
          if (normalized === "rejected") {
            return <Badge color="red">{t("statusRejected")}</Badge>;
          }
          if (normalized === "inreview") {
            return <Badge color="orange">{t("statusInReview")}</Badge>;
          }
          if (normalized === "new") {
            return <Badge color="blue">{t("statusNew")}</Badge>;
          }

          if (normalized === "pending") {
            return <Badge color="blue">{t("statusPending")}</Badge>;
          }

          return <Badge color="blue">{raw}</Badge>;
        },
      },
      {
        accessor: "notes",
        title: t("colNotes"),
        width: "18%",
        render: (row) => (
          <Text size="sm" c={row.notes ? undefined : "dimmed"} lineClamp={2}>
            {row.notes || "—"}
          </Text>
        ),
      },
      {
        accessor: "actions",
        title: "",
        width: "5%",
        render: (row) => <ActionsRender row={row} />,
      },
    ];
  }, [t, locale]);

  useMirrorRegistry("schema", schema);

  return <>{children}</>;
};

export { SchemaForEmploymentApplications };
