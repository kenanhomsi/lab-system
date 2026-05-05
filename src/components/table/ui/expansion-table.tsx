"use client";
import { Box } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { IconInbox } from "@tabler/icons-react";
import styles from "../style.module.scss";
import { useMirror } from "../store";
import { PaginationComp, SkeletonTable } from "../components";

const ExpansionTable = () => {
  const schema = useMirror("schema");
  const data = useMirror("data");
  const expandedRowIds = useMirror("expandedRowIds");
  const headerComp = useMirror("headerComp");
  const ContentComp = useMirror("ContentComp");
  const isLoading = useMirror("isLoading");
  const onRowClick = useMirror("onRowClick");
  const records = Array.isArray(data) ? data : [];
  const hasRecords = records.length > 0;
  const minHeight = hasRecords ? undefined : "20rem";
  const emptyState = hasRecords ? (
    <></>
  ) : (
    <Box className={styles.emptyStateIcon} style={{ flexDirection: "column" }}>
      <IconInbox size={26} />
      <span>No records found</span>
    </Box>
  );
  return (
    <>
      {headerComp}
      {isLoading && <SkeletonTable rows={5} columns={schema?.length || 4} />}
      {!isLoading && (
        <>
          <DataTable
            onRowClick={({ record }) => {
              onRowClick?.(record.id as string);
            }}
            rowClassName={() => {
              return `${styles.hoverRow}`;
            }}
            columns={schema}
            records={records}
            minHeight={minHeight}
            emptyState={emptyState}
            noRecordsText=""
            highlightOnHover
            striped
            verticalSpacing="xs"
            horizontalSpacing="xs"
            classNames={{
              header: styles.expandedHeaderCell,
              root: styles.cell,
            }}
            rowExpansion={{
              expanded: {
                recordIds: expandedRowIds as string[],
              },
              content: ({ record }) => ContentComp?.(record.id),
            }}
          />
          <PaginationComp />
        </>
      )}
    </>
  );
};

export { ExpansionTable };
