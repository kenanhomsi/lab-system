"use client";
import { Box } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconInbox } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import styles from "../style.module.scss";
import { useMirror } from "../store";
import { PaginationComp, SkeletonTable } from "../components";

const ExpansionTable = () => {
  const tEmpty = useTranslations("admin.table");
  const schema = useMirror("schema");
  const data = useMirror("data");
  const expandedRowIds = useMirror("expandedRowIds");
  const onExpandedRowIdsChange = useMirror("onExpandedRowIdsChange");
  const headerComp = useMirror("headerComp");
  const ContentComp = useMirror("ContentComp");
  const isLoading = useMirror("isLoading");
  const customEmpty = useMirror("tableEmptyState");
  const customRowClass = useMirror("tableRowClassName");
  const dataTableClassNames = useMirror("dataTableClassNames");
  const tableStriped = useMirror("tableStriped");
  const tableHighlight = useMirror("tableHighlightOnHover");
  const dataTableVerticalSpacing = useMirror("dataTableVerticalSpacing");
  const dataTableHorizontalSpacing = useMirror("dataTableHorizontalSpacing");
  const records = Array.isArray(data) ? data : [];
  const hasRecords = records.length > 0;
  const minHeight = hasRecords ? undefined : "20rem";
  const defaultEmpty = (
    <Box className={styles.emptyState} role="status" aria-live="polite">
      <Box className={styles.emptyStateIcon}>
        <IconInbox size={36} stroke={1.7} />
      </Box>
      <span className={styles.emptyStateTitle}>{tEmpty("emptyTitle")}</span>
      <span className={styles.emptyStateHint}>{tEmpty("emptyHint")}</span>
    </Box>
  );
  const emptyState = hasRecords ? (
    <></>
  ) : customEmpty !== undefined ? (
    customEmpty
  ) : (
    defaultEmpty
  );
  const tableClassNamesMerged = {
    header: clsx(styles.headerCell, dataTableClassNames?.header),
    root: clsx(styles.cell, dataTableClassNames?.root),
  };
  const striped = tableStriped ?? false;
  const highlightOnHover = tableHighlight === true;
  const verticalSpacing = dataTableVerticalSpacing ?? "xs";
  const horizontalSpacing = dataTableHorizontalSpacing ?? "xs";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- record shape follows table data
  const rowClassNameResolved = (record: any) =>
    clsx(styles.hoverRow, customRowClass?.(record));

  return (
    <Box className={styles.tableBox} w="100%">
      {headerComp}
      {isLoading && <SkeletonTable rows={5} columns={schema?.length || 4} />}
      {!isLoading && (
        <>
          <DataTable
            w="100%"
            rowClassName={rowClassNameResolved}
            columns={schema}
            records={records}
            minHeight={minHeight}
            emptyState={emptyState}
            noRecordsText=""
            highlightOnHover={highlightOnHover}
            striped={striped}
            verticalSpacing={verticalSpacing}
            horizontalSpacing={horizontalSpacing}
            classNames={tableClassNamesMerged}
            tableWrapper={({ children }) => (
              <div className={styles.tableScrollWrapper}>{children}</div>
            )}
            rowExpansion={{
              allowMultiple: true,
              expanded: {
                recordIds: expandedRowIds ?? [],
                onRecordIdsChange: onExpandedRowIdsChange,
              },
              content: ({ record }) => ContentComp?.(String(record.id)),
            }}
          />
          <PaginationComp />
        </>
      )}
    </Box>
  );
};

export { ExpansionTable };
