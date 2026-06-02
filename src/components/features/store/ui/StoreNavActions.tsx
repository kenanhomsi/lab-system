"use client";

import { Button, Indicator } from "@mantine/core";
import { IconClipboardList, IconShoppingCart } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type StoreNavActionsProps = {
  cartCount: number;
};

/**
 * Primary store navigation actions — cart and orders links.
 */
export function StoreNavActions({ cartCount }: StoreNavActionsProps) {
  const t = useTranslations("labStore");

  return (
    <>
      <Indicator label={cartCount} size={18} disabled={cartCount === 0} color="teal" inline>
        <Button
          component={Link}
          href="/lab/store/cart"
          variant="light"
          color="teal"
          leftSection={<IconShoppingCart size={18} />}
        >
          {t("cart")}
        </Button>
      </Indicator>
      <Button
        component={Link}
        href="/lab/store/orders"
        variant="default"
        leftSection={<IconClipboardList size={18} />}
      >
        {t("myOrders")}
      </Button>
    </>
  );
}
