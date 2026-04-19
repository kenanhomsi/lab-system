"use client";

import { Flex, Skeleton, Stack } from "@mantine/core";

type SkeletonTableProps = {
  rows: number;
  columns: number;
};

const SkeletonTable = ({ rows, columns }: SkeletonTableProps) => {
  return (
    <Stack gap="lg">
      <Skeleton height={50} radius="md" />
      {[...Array(rows)].map((_, rowIdx) => (
        <Flex key={rowIdx} gap="sm">
          {[...Array(columns)].map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              height={30}
              radius="sm"
              style={{ flex: 1 }}
            />
          ))}
        </Flex>
      ))}
    </Stack>
  );
};

export { SkeletonTable };
