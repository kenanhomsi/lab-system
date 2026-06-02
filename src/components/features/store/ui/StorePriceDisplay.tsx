"use client";

import { Group, Text } from "@mantine/core";

type StorePriceDisplayProps = {
  price: number;
  discountPrice?: number;
  currency: string;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { main: "sm", original: "xs" },
  md: { main: "md", original: "sm" },
  lg: { main: "lg", original: "sm" },
} as const;

/**
 * Renders product price with optional strikethrough original when discounted.
 */
export function StorePriceDisplay({
  price,
  discountPrice = 0,
  currency,
  size = "md",
}: StorePriceDisplayProps) {
  const hasDiscount = discountPrice > 0 && discountPrice < price;
  const effective = hasDiscount ? discountPrice : price;
  const sizes = sizeMap[size];

  return (
    <Group gap={6} align="baseline">
      <Text fw={700} size={sizes.main} c={hasDiscount ? "red.7" : "dark"}>
        {effective.toLocaleString()} {currency}
      </Text>
      {hasDiscount ? (
        <Text size={sizes.original} c="dimmed" td="line-through">
          {price.toLocaleString()} {currency}
        </Text>
      ) : null}
    </Group>
  );
}
