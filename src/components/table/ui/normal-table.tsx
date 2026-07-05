"use client";
import dynamic from "next/dynamic";
import { Box } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useTranslations } from "next-intl";
import { PaginationComp } from "../components/pagination";
import { useMirror } from "../store";
import styles from "../style.module.scss";
import { SkeletonTable } from "../components";
import { IconInbox } from "@tabler/icons-react";
import clsx from "clsx";

const DraggableNormalTable = dynamic(
  () =>
    import("./draggable-normal-table").then((module) => module.DraggableNormalTable),
  { ssr: false },
);
const NormalTable = () => {
  const tEmpty = useTranslations("admin.table");
  const schema = useMirror("schema");
  const data = useMirror("data");
  const headerComp = useMirror("headerComp");
  const isLoading = useMirror("isLoading");
  const withDrag = useMirror("withDrag");
  const onDragEnd = useMirror("onDragEnd");
  const customEmpty = useMirror("tableEmptyState");
  const customRowClass = useMirror("tableRowClassName");
  const dataTableClassNames = useMirror("dataTableClassNames");
  const tableStriped = useMirror("tableStriped");
  const tableHighlight = useMirror("tableHighlightOnHover");
  const dataTableVerticalSpacing = useMirror("dataTableVerticalSpacing");
  const dataTableHorizontalSpacing = useMirror("dataTableHorizontalSpacing");
  const onRowClick = useMirror("onRowClick");
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- record shape follows table data
  const rowClassNameResolved = (record: any) =>
    clsx(styles.rowStyles, customRowClass?.(record));
  const striped = tableStriped ?? false;
  const highlightOnHover = tableHighlight === true;
  const verticalSpacing = dataTableVerticalSpacing ?? "xs";
  const horizontalSpacing = dataTableHorizontalSpacing ?? "xs";

  return (
    <Box className={styles.tableBox} w="100%">
      {headerComp}
      {isLoading && <SkeletonTable rows={5} columns={schema?.length || 4} />}
      {!isLoading && (
        <>
          {withDrag ? (
            <DraggableNormalTable
              schema={schema}
              records={records}
              minHeight={minHeight}
              emptyState={emptyState}
              striped={striped}
              highlightOnHover={highlightOnHover}
              verticalSpacing={verticalSpacing}
              horizontalSpacing={horizontalSpacing}
              tableClassNamesMerged={tableClassNamesMerged}
              rowClassNameResolved={rowClassNameResolved}
              onDragEnd={onDragEnd}
            />
          ) : (
            <>
              <DataTable
                w="100%"
                columns={schema}
                records={records}
                minHeight={minHeight}
                emptyState={emptyState}
                noRecordsText=""
                highlightOnHover={highlightOnHover}
                verticalSpacing={verticalSpacing}
                striped={striped}
                rowClassName={rowClassNameResolved}
                horizontalSpacing={horizontalSpacing}
                classNames={tableClassNamesMerged}
                tableWrapper={({ children }) => (
                  <div className={styles.tableScrollWrapper}>{children}</div>
                )}
                onRowClick={({ record, event }) => {
                  const target = event.target as HTMLElement;
                  const isInteractive = target.closest(
                    'button, a, input, select, textarea, [role="button"], [data-interactive="true"]',
                  );
                  if (isInteractive) return;
                  if (record.onClick) {
                    record.onClick(record);
                    return;
                  }
                  if (onRowClick && record.id) {
                    onRowClick(String(record.id));
                  }
                }}
              />
            </>
          )}
          <PaginationComp />
        </>
      )}
    </Box>
  );
};

export { NormalTable };
