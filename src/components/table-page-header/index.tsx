"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  MantineColor,
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
    <Flex direction="column" gap={0} pb="xs">
      {/* ── Title row ── */}
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
          <ThemeIcon size={44} radius="md" variant="light" color={iconColor}>
            {icon}
          </ThemeIcon>
          <div>
            <Group gap={6} align="center" wrap="nowrap">
              <Text fw={800} fz={20} lh={1.1}>
                {title}
              </Text>
              <Badge size="sm" variant="filled" color={iconColor} radius="xl" px={8}>
                {totalCount}
              </Badge>
            </Group>
            {description && (
              <Text fz="xs" c="dimmed" mt={3} lh={1.4}>
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
                radius="xl"
                size="md"
                onClick={onResetFilters}
              >
                <IconRefresh size={14} />
              </ActionIcon>
            </Tooltip>
          )}
          {createLabel && onOpenCreate && (
            <Button
              leftSection={createIcon ?? <IconPlus size={15} />}
              radius="md"
              size="sm"
              variant="filled"
              color={iconColor}
              onClick={onOpenCreate}
            >
              {createLabel}
            </Button>
          )}
        </Group>
      </Flex>

      {/* ── Divider + filter bar (optional) ── */}
      {hasFilters && (
        <>
          <Divider />
          <Flex gap="xs" wrap="wrap" align="center" px="lg" pt="sm" pb="sm">
            {children}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export { TablePageHeader };
