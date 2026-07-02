"use client";

import { Avatar, Group, Select, Text } from "@mantine/core";
import { IconWorldWww } from "@tabler/icons-react";

export type ParentPageOption = {
  value: string;
  label: string;
  imageUrl?: string | null;
};

type ParentPageSelectProps = {
  label: string;
  placeholder?: string;
  value: string;
  options: ParentPageOption[];
  onChange: (value: string) => void;
};

/**
 * Searchable parent page picker with optional thumbnail previews.
 */
export function ParentPageSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: ParentPageSelectProps) {
  return (
    <Select
      label={label}
      placeholder={placeholder}
      data={options}
      value={value || null}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      searchable
      clearable
      renderOption={({ option }) => {
        const parentOption = option as ParentPageOption;
        return (
          <Group gap="sm" wrap="nowrap">
            {parentOption.imageUrl ? (
              <Avatar src={parentOption.imageUrl} size={32} radius="sm" />
            ) : (
              <Avatar size={32} radius="sm" color="cyan">
                <IconWorldWww size={16} />
              </Avatar>
            )}
            <Text size="sm" lineClamp={1}>
              {parentOption.label}
            </Text>
          </Group>
        );
      }}
    />
  );
}
