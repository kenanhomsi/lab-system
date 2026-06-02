"use client";

import { Badge, Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { notifications } from "@mantine/notifications";
import type { StoreProduct } from "@/modules/store";
import { StorePriceDisplay } from "./StorePriceDisplay";

type StoreProductCardProps = {
  product: StoreProduct;
  onAddToCart: (product: StoreProduct) => void;
};

/**
 * Product card with badges, pricing, and add-to-cart action.
 */
export function StoreProductCard({ product, onAddToCart }: StoreProductCardProps) {
  const t = useTranslations("labStore");
  const locale = useLocale();
  const name = locale === "ar" ? product.nameAr : product.nameEn;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAdd = () => {
    onAddToCart(product);
    notifications.show({
      title: t("addToCart"),
      message: name,
      color: "teal",
      autoClose: 2000,
    });
  };

  return (
    <Card
      withBorder
      radius="lg"
      padding="md"
      styles={{
        root: {
          transition: "transform 150ms ease, box-shadow 150ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "var(--mantine-shadow-md)",
          },
        },
      }}
    >
      <Stack gap="sm" h="100%">
        <Card.Section pos="relative">
          <Image src={product.imageUrl} alt={name} h={140} fit="cover" />
          <Group gap={4} pos="absolute" top={8} left={8}>
            {product.topBadge ? (
              <Badge color="red" variant="filled" size="xs">
                {product.topBadge}
              </Badge>
            ) : null}
            {product.isBestSeller ? (
              <Badge color="orange" variant="light" size="xs">
                Best Seller
              </Badge>
            ) : null}
            {product.isRecommended ? (
              <Badge color="teal" variant="light" size="xs">
                Recommended
              </Badge>
            ) : null}
          </Group>
        </Card.Section>

        <Stack gap={4} flex={1}>
          <Text fw={600} lineClamp={2} size="sm" lh={1.35}>
            {name}
          </Text>
          {product.saleUnit ? (
            <Text size="xs" c="dimmed">
              {product.saleUnit}
            </Text>
          ) : null}
          <StorePriceDisplay
            price={product.price}
            discountPrice={product.discountPrice}
            currency={t("currency")}
            size="sm"
          />
          {hasDiscount && product.savedAmount > 0 ? (
            <Text size="xs" c="teal">
              {t("discount")}: {product.savedAmount.toLocaleString()} {t("currency")}
            </Text>
          ) : null}
        </Stack>

        <Button
          fullWidth
          size="sm"
          color="teal"
          variant="light"
          leftSection={<IconShoppingCartPlus size={16} />}
          onClick={handleAdd}
        >
          {t("addToCart")}
        </Button>
      </Stack>
    </Card>
  );
}
