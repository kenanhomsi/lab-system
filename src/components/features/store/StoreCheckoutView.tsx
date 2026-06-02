"use client";

import {
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Flex,
  Paper,
  Radio,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { IconCash, IconChevronRight, IconCreditCard, IconShoppingCartOff } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { storeService } from "./store-service";
import { StoreEmptyState, StorePageHeader, StoreSummaryPanel } from "./ui";
import { getCartSubtotal, useStoreCart } from "./use-store-cart";

type PaymentMethod = "CashOnDelivery" | "OnlinePayment";

type PaymentOptionProps = {
  value: PaymentMethod;
  selected: boolean;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onSelect: (value: PaymentMethod) => void;
};

function PaymentOption({ value, selected, disabled, icon, label, onSelect }: PaymentOptionProps) {
  return (
    <UnstyledButton
      onClick={() => !disabled && onSelect(value)}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Paper
        withBorder
        radius="md"
        p="md"
        style={{
          borderColor: selected ? "var(--mantine-color-teal-5)" : undefined,
          background: selected ? "var(--mantine-color-teal-0)" : undefined,
        }}
      >
        <Flex align="center" gap="md">
          {icon}
          <Text fw={selected ? 700 : 500}>{label}</Text>
          <Radio value={value} checked={selected} readOnly ml="auto" />
        </Flex>
      </Paper>
    </UnstyledButton>
  );
}

export function StoreCheckoutView() {
  const t = useTranslations("labStore");
  const router = useRouter();
  const items = useStoreCart((s) => s.items);
  const notes = useStoreCart((s) => s.notes);
  const setNotes = useStoreCart((s) => s.setNotes);
  const toOrderInput = useStoreCart((s) => s.toOrderInput);
  const clear = useStoreCart((s) => s.clear);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CashOnDelivery");

  const { data: settings } = useQuery({
    queryKey: ["store", "settings"],
    queryFn: () => storeService.getSettings(),
  });

  const subtotal = getCartSubtotal(items);
  const deliveryFee = settings?.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;
  const currency = t("currency");

  const mutation = useMutation({
    mutationFn: () => storeService.placeOrder(toOrderInput(paymentMethod)),
    onSuccess: (order) => {
      clear();
      notifications.show({ title: t("orderSuccess"), message: t("orderSuccessDesc"), color: "green" });
      router.push(`/lab/store/orders/${order.id}`);
    },
    onError: () => {
      notifications.show({ title: t("loadError"), message: t("loadError"), color: "red" });
    },
  });

  if (items.length === 0) {
    return (
      <Stack gap="lg">
        <StorePageHeader badge={t("checkout")} title={t("checkout")} />
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
        <Anchor component={Link} href="/lab/store/cart" size="sm" c="dimmed">
          {t("cartPage")}
        </Anchor>
        <Text size="sm" fw={600}>
          {t("checkout")}
        </Text>
      </Breadcrumbs>

      <StorePageHeader
        badge={t("checkout")}
        title={t("checkout")}
        description={settings?.deliveryDurationText}
      />

      <Flex direction={{ base: "column", lg: "row" }} gap="lg" align="flex-start">
        <Stack gap="md" flex={1} w="100%">
          <Paper withBorder radius="lg" p="lg">
            <Stack gap="md">
              <Text fw={700} size="lg">
                {t("paymentMethod")}
              </Text>
              <Stack gap="sm">
                <PaymentOption
                  value="CashOnDelivery"
                  selected={paymentMethod === "CashOnDelivery"}
                  disabled={!settings?.cashOnDeliveryEnabled}
                  icon={<IconCash size={24} color="var(--mantine-color-teal-6)" />}
                  label={t("cashOnDelivery")}
                  onSelect={setPaymentMethod}
                />
                <PaymentOption
                  value="OnlinePayment"
                  selected={paymentMethod === "OnlinePayment"}
                  disabled={!settings?.onlinePaymentEnabled}
                  icon={<IconCreditCard size={24} color="var(--mantine-color-teal-6)" />}
                  label={t("electronicPayment")}
                  onSelect={setPaymentMethod}
                />
              </Stack>
              {!settings?.onlinePaymentEnabled ? (
                <Alert color="blue" variant="light" radius="md">
                  {t("comingSoon")}
                </Alert>
              ) : null}
            </Stack>
          </Paper>

          <Paper withBorder radius="lg" p="lg">
            <Textarea
              label={t("notes")}
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={(event) => setNotes(event.currentTarget.value)}
              minRows={3}
              autosize
            />
          </Paper>
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
            actionLabel={mutation.isPending ? t("placingOrder") : t("placeOrder")}
            onAction={() => mutation.mutate()}
            actionLoading={mutation.isPending}
          />
        </Box>
      </Flex>
    </Stack>
  );
}
