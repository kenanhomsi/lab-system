"use client";

import { Flex, Skeleton, Stack } from "@mantine/core";
import skeletonStyles from "./skeleton-table.module.css";

type SkeletonTableProps = {
  rows: number;
  columns: number;
};

const SkeletonTable = ({ rows, columns }: SkeletonTableProps) => {
  return (
    <Stack gap="lg" role="status" aria-live="polite" aria-busy="true">
      <Skeleton
        height={50}
        radius="md"
        classNames={{ root: skeletonStyles.shimmer }}
      />
      {[...Array(rows)].map((_, rowIdx) => (
        <Flex key={rowIdx} gap="sm" align="center" wrap="nowrap">
          {[...Array(columns)].map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height={32}
              radius="sm"
              style={{ flex: 1 }}
              classNames={{ root: skeletonStyles.shimmer }}
            />
          ))}
        </Flex>
      ))}
    </Stack>
  );
};

export { SkeletonTable };
