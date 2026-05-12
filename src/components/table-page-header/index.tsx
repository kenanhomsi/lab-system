"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  MantineColor,
  Paper,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconRefresh } from "@tabler/icons-react";
import React from "react";

export type TablePageHeaderProps = {
  /** Main title shown in the header */
  title: string;
  /** Subtitle / description shown below the title */
  description?: string;
  /** Icon rendered inside the ThemeIcon */
  icon: React.ReactNode;
  /** Color applied to the ThemeIcon and the count badge */
  iconColor?: MantineColor;
  /** Total record count shown as a badge next to the title */
  totalCount: number;
  /** Label for the primary create button. Omit to hide the button. */
  createLabel?: string;
  /** Icon for the create button (defaults to IconPlus) */
  createIcon?: React.ReactNode;
  /** Called when the create button is clicked */
  onOpenCreate?: () => void;
  /**
   * Whether any filter is currently active.
   * When true, the reset button is shown (requires onResetFilters).
   */
  hasActiveFilters?: boolean;
  /** Called when the reset button is clicked */
  onResetFilters?: () => void;
  /**
   * Filter controls rendered below the divider.
   * When omitted the divider and filter row are not rendered.
   */
  children?: React.ReactNode;
};

/**
 * Generic page header used by every data table in the admin panel.
 *
 * Slot layout:
 *   ┌─────────────────────────────────────────────────┐
 *   │ [Icon] Title   N badge          [Create button] │
 *   │        description                               │
 *   ├─────────────────────────────────────────────────┤  (only when children present)
 *   │ [children — filter bar]                         │
 *   └─────────────────────────────────────────────────┘
 */
const TablePageHeader = ({
  title,
  description,
  icon,
  iconColor = "teal",
  totalCount,
  createLabel,
  createIcon,
  onOpenCreate,
  hasActiveFilters = false,
  onResetFilters,
  children,
}: TablePageHeaderProps) => {
  const hasFilters = Boolean(children);

  return (
    <Paper radius="lg" withBorder p={0} >
      <Flex direction="column" gap={0}>
        <Flex
          justify="space-between"
          align="flex-start"
          wrap="wrap"
          gap="md"
          px="lg"
          pt="lg"
          pb={hasFilters ? "md" : "lg"}
        >
          <Group gap="sm" align="flex-start" wrap="nowrap">
            <ThemeIcon size={42} radius="md" variant="light" color={iconColor}>
              {icon}
            </ThemeIcon>
            <div>
              <Group gap={8} align="center" wrap="nowrap">
                <Text fw={700} fz={22} lh={1.15}>
                  {title}
                </Text>
                <Badge size="md" variant="light" color={iconColor} radius="xl">
                  {totalCount}
                </Badge>
              </Group>
              {description && (
                <Text fz="sm" c="dimmed" mt={4} lh={1.5}>
                  {description}
                </Text>
              )}
            </div>
          </Group>

          <Group gap="xs">
            {hasActiveFilters && onResetFilters && (
              <Tooltip label="Reset filters" withArrow>
                <ActionIcon
                  variant="light"
                  color="gray"
                  radius="md"
                  size="lg"
                  onClick={onResetFilters}
                >
                  <IconRefresh size={15} />
                </ActionIcon>
              </Tooltip>
            )}
            {createLabel && onOpenCreate && (
              <Button
                leftSection={createIcon ?? <IconPlus size={15} />}
                radius="md"
                size="md"
                variant="filled"
                color={iconColor}
                onClick={onOpenCreate}
              >
                {createLabel}
              </Button>
            )}
          </Group>
        </Flex>

        {hasFilters && (
          <>
            <Divider />
            <Flex gap="xs" wrap="wrap" align="center" px="lg" py="sm">
              {children}
            </Flex>
          </>
        )}
      </Flex>
    </Paper>
  );
};

export { TablePageHeader };
