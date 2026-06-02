"use client";

import {
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Flex,
  Group,
  Image,
  NumberInput,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconChevronRight, IconShoppingCartOff, IconTrash } from "@tabler/icons-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StoreEmptyState, StorePageHeader, StorePriceDisplay, StoreSummaryPanel } from "./ui";
import { getCartSubtotal, useStoreCart } from "./use-store-cart";

type StoreCartViewProps = {
  deliveryFee?: number;
};

export function StoreCartView({ deliveryFee = 0 }: StoreCartViewProps) {
  const t = useTranslations("labStore");
  const locale = useLocale();
  const items = useStoreCart((s) => s.items);
  const couponCode = useStoreCart((s) => s.couponCode);
  const setCouponCode = useStoreCart((s) => s.setCouponCode);
  const updateQuantity = useStoreCart((s) => s.updateQuantity);
  const removeProduct = useStoreCart((s) => s.removeProduct);

  const subtotal = getCartSubtotal(items);
  const total = subtotal + deliveryFee;
  const currency = t("currency");

  if (items.length === 0) {
    return (
      <Stack gap="lg">
        <StorePageHeader badge={t("cart")} title={t("cartPage")} description={t("emptyCartDesc")} />
        <StoreEmptyState
          icon={<IconShoppingCartOff size={36} />}
          title={t("emptyCart")}
          description={t("emptyCartDesc")}
          actionLabel={t("browseStore")}
          actionHref="/lab/store"
        />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <Breadcrumbs separator={<IconChevronRight size={14} />}>
        <Anchor component={Link} href="/lab/store" size="sm" c="dimmed">
          {t("title")}
        </Anchor>
        <Text size="sm" fw={600}>
          {t("cartPage")}
        </Text>
      </Breadcrumbs>

      <StorePageHeader
        badge={t("cart")}
        title={t("cartPage")}
        description={t("itemsCount", { count: items.length })}
      />

      <Flex direction={{ base: "column", lg: "row" }} gap="lg" align="flex-start">
        <Stack gap="md" flex={1} w="100%">
          {items.map((item) => {
            const unitPrice =
              item.discountPrice > 0 && item.discountPrice < item.price ? item.discountPrice : item.price;
            const name = locale === "ar" ? item.nameAr : item.nameEn;

            return (
              <Paper key={item.productId} withBorder radius="lg" p="md">
                <Group align="flex-start" wrap="nowrap" gap="md">
                  <Image src={item.imageUrl} alt={name} w={80} h={80} radius="md" fit="cover" />
                  <Box flex={1} miw={0}>
                    <Text fw={600} lineClamp={2}>
                      {name}
                    </Text>
                    <StorePriceDisplay
                      price={item.price}
                      discountPrice={item.discountPrice}
                      currency={currency}
                      size="sm"
                    />
                    <Group mt="sm" gap="md" align="center">
                      <NumberInput
                        label={t("quantity")}
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.productId, Number(value) || 1)}
                        w={100}
                        size="sm"
                      />
                      <Stack gap={2} mt={18}>
                        <Text size="xs" c="dimmed">
                          {t("total")}
                        </Text>
                        <Text fw={700}>
                          {(unitPrice * item.quantity).toLocaleString()} {currency}
                        </Text>
                      </Stack>
                    </Group>
                  </Box>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="lg"
                    aria-label={t("remove")}
                    onClick={() => removeProduct(item.productId)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Paper>
            );
          })}
        </Stack>

        <Box w={{ base: "100%", lg: 360 }} style={{ position: "sticky", top: 16 }}>
          <StoreSummaryPanel
            title={t("orderSummary")}
            lines={[
              { label: t("subtotal"), value: `${subtotal.toLocaleString()} ${currency}` },
              { label: t("deliveryFee"), value: `${deliveryFee.toLocaleString()} ${currency}` },
            ]}
            totalLabel={t("total")}
            totalValue={`${total.toLocaleString()} ${currency}`}
            actionLabel={t("checkout")}
            actionHref="/lab/store/checkout"
          >
            <TextInput
              label={t("couponCode")}
              placeholder={t("couponCode")}
              value={couponCode}
              onChange={(event) => setCouponCode(event.currentTarget.value)}
            />
          </StoreSummaryPanel>
        </Box>
      </Flex>
    </Stack>
  );
}
