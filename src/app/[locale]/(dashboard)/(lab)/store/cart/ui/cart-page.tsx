"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const INPUT_CLASS =
  "w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

type CartItem = {
  id: string;
  name: string;
  nameAr: string;
  unitPrice: number;
  quantity: number;
  discount: number;
};

const MOCK_CART: CartItem[] = [
  { id: "prod-001", name: "EDTA Vacutainer Tubes (100 pcs)", nameAr: "أنابيب سحب دم EDTA (100 قطعة)", unitPrice: 4500, quantity: 2, discount: 10 },
  { id: "prod-003", name: "Latex Examination Gloves (M)", nameAr: "قفازات فحص لاتكس (وسط)", unitPrice: 3800, quantity: 1, discount: 5 },
  { id: "prod-005", name: "Alcohol Swabs (200 pcs)", nameAr: "مسحات كحول (200 قطعة)", unitPrice: 1500, quantity: 3, discount: 0 },
];

export function CartPage() {
  const t = useTranslations("labStore");

  const [items, setItems] = useState<CartItem[]>(MOCK_CART);
  const [coupon, setCoupon] = useState("");

  function effectivePrice(item: CartItem) {
    return item.discount > 0
      ? Math.round(item.unitPrice * (1 - item.discount / 100))
      : item.unitPrice;
  }

  function updateQuantity(id: string, delta: number) {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const subtotal = items.reduce((s, i) => s + effectivePrice(i) * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 md:p-8">
        <Card className="text-center shadow-xl">
          <Icon name="remove_shopping_cart" className="mx-auto mb-4 text-on-surface-variant/40" size="lg" />
          <h2 className="font-headline text-xl font-bold text-on-surface">{t("emptyCart")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("emptyCartDesc")}</p>
          <Link
            href="/store"
            className="clinical-gradient mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95"
          >
            <Icon name="storefront" size="sm" />
            {t("browseStore")}
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="shopping_cart" filled size="sm" />
          {t("cart")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("cartPage")}
        </h1>
      </div>

      {/* Items */}
      <Card padding="none" className="mb-6 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                <th className="px-4 py-3.5 text-start font-bold text-on-surface">{t("product")}</th>
                <th className="px-4 py-3.5 text-end font-bold text-on-surface">{t("unitPrice")}</th>
                <th className="px-4 py-3.5 text-center font-bold text-on-surface">{t("quantity")}</th>
                <th className="px-4 py-3.5 text-end font-bold text-on-surface">{t("total")}</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/5 last:border-0">
                  <td className="px-4 py-4">
                    <p className="font-medium text-on-surface">{item.nameAr}</p>
                    <p className="text-xs text-on-surface-variant">{item.name}</p>
                    {item.discount > 0 && (
                      <span className="mt-1 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        -{item.discount}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-end">
                    {item.discount > 0 && (
                      <span className="me-1 text-xs text-on-surface-variant line-through">{item.unitPrice}</span>
                    )}
                    <span className="font-bold text-on-surface">{effectivePrice(item)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex size-8 items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                      >
                        <Icon name="remove" size="sm" />
                      </button>
                      <span className="min-w-[2rem] text-center font-bold text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-8 items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant transition-colors hover:bg-surface-container-low"
                      >
                        <Icon name="add" size="sm" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-end font-bold text-primary">
                    {effectivePrice(item) * item.quantity}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Icon name="delete" size="sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Coupon + summary */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <label className="mb-2 block text-sm font-bold text-on-surface">{t("couponCode")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder={t("couponCode")}
              className={INPUT_CLASS}
            />
            <Button variant="secondary" onClick={() => console.log("Apply coupon:", coupon)}>
              {t("applyCoupon")}
            </Button>
          </div>
        </Card>

        <Card className="shadow-md">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{t("subtotal")}</span>
              <span className="font-bold text-on-surface">{subtotal} {t("currency")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">{t("deliveryFee")}</span>
              <span className="font-bold text-on-surface">{deliveryFee} {t("currency")}</span>
            </div>
            <div className="border-t border-outline-variant/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="font-headline text-lg font-bold text-on-surface">{t("total")}</span>
                <span className="font-headline text-xl font-bold text-primary">{total} {t("currency")}</span>
              </div>
            </div>
          </div>
          <Link
            href="/store/checkout"
            className="clinical-gradient mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95"
          >
            <Icon name="payments" size="sm" />
            {t("checkout")}
          </Link>
        </Card>
      </div>
    </div>
  );
}
