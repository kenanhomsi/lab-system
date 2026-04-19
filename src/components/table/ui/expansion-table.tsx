"use client";
import { Box } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import Image from "next/image";
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
  const hasRecords = Array.isArray(data) && data.length > 0;
  const minHeight = hasRecords ? undefined : "20rem";
  const emptyStateIcon = hasRecords ? undefined : (
    <Box className={styles.emptyStateIcon}>
      <Image src="/icons/table-empty.svg" alt="" width={64} height={64} />
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
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            records={data as any}
            minHeight={minHeight}
            noRecordsText="No records found"
            noRecordsIcon={emptyStateIcon}
            highlightOnHover
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
