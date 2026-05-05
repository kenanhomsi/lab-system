"use client";

import { Box, Code, Text, Tooltip } from "@mantine/core";

type ExternalIdCellProps = {
  value: string | null | undefined;
};

const ExternalIdCell = ({ value }: ExternalIdCellProps) => {
  if (!value) {
    return (
      <Text component="span" size="sm" c="dimmed" py={4}>
        —
      </Text>
    );
  }

  return (
    <Tooltip label={value} withArrow position="top" openDelay={300}>
      <Box component="span" maw={168} display="inline-block">
        <Code
          fz={11}
          fw={500}
          px={8}
          py={4}
          style={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "default",
            fontVariantNumeric: "normal",
          }}
        >
          {value}
        </Code>
      </Box>
    </Tooltip>
  );
};

export { ExternalIdCell };
