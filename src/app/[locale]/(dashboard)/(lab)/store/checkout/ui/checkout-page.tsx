"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type OrderItem = {
  name: string;
  nameAr: string;
  quantity: number;
  price: number;
};

const MOCK_ORDER_ITEMS: OrderItem[] = [
  { name: "EDTA Vacutainer Tubes (100 pcs)", nameAr: "أنابيب سحب دم EDTA (100 قطعة)", quantity: 2, price: 4050 },
  { name: "Latex Examination Gloves (M)", nameAr: "قفازات فحص لاتكس (وسط)", quantity: 1, price: 3610 },
  { name: "Alcohol Swabs (200 pcs)", nameAr: "مسحات كحول (200 قطعة)", quantity: 3, price: 1500 },
];

export function CheckoutPage() {
  const t = useTranslations("labStore");

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = MOCK_ORDER_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const res = await fetch("/api/store/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: MOCK_ORDER_ITEMS,
          paymentMethod,
          total,
        }),
      });
      if (res.ok) {
        setSuccess(true);
      }
    } catch {
      /* ignore */
    } finally {
      setPlacing(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl p-6 md:p-8">
        <Card className="text-center shadow-xl" padding="lg">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <Icon name="check_circle" filled className="text-emerald-500" size="lg" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">{t("orderSuccess")}</h2>
          <p className="mt-2 text-on-surface-variant">{t("orderSuccessDesc")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/store/orders"
              className="clinical-gradient inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95"
            >
              <Icon name="list_alt" size="sm" />
              {t("viewOrders")}
            </Link>
            <Link
              href="/store"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-8 py-3 text-sm font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low"
            >
              <Icon name="storefront" size="sm" />
              {t("continueShopping")}
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="payments" filled size="sm" />
          {t("checkout")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("checkout")}
        </h1>
      </div>

      {/* Order summary */}
      <Card className="mb-6 shadow-md" padding="lg">
        <h3 className="mb-4 flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
          <Icon name="receipt_long" size="md" />
          {t("orderSummary")}
        </h3>
        <div className="space-y-3">
          {MOCK_ORDER_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-surface-container-low/50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-on-surface">{item.nameAr}</p>
                <p className="text-xs text-on-surface-variant">{item.name}</p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {t("quantity")}: {item.quantity}
                </p>
              </div>
              <span className="font-bold text-on-surface">{item.price * item.quantity} {t("currency")}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-outline-variant/10 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">{t("subtotal")}</span>
            <span className="font-semibold text-on-surface">{subtotal} {t("currency")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">{t("deliveryFee")}</span>
            <span className="font-semibold text-on-surface">{deliveryFee} {t("currency")}</span>
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/10 pt-2">
            <span className="font-headline text-lg font-bold text-on-surface">{t("total")}</span>
            <span className="font-headline text-xl font-bold text-primary">{total} {t("currency")}</span>
          </div>
        </div>
      </Card>

      {/* Payment method */}
      <Card className="mb-6 shadow-md" padding="lg">
        <h3 className="mb-4 flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
          <Icon name="credit_card" size="md" />
          {t("paymentMethod")}
        </h3>
        <div className="space-y-3">
          <label
            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-4 transition-all ${
              paymentMethod === "cash"
                ? "border-primary bg-primary/5"
                : "border-outline-variant/20 bg-surface"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
              className="size-5 accent-primary"
            />
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <Icon name="payments" className="text-emerald-600" size="sm" />
              </div>
              <div>
                <p className="font-bold text-on-surface">{t("cashOnDelivery")}</p>
              </div>
            </div>
          </label>

          <label className="flex cursor-not-allowed items-center gap-4 rounded-xl border-2 border-outline-variant/10 bg-surface-container-low/50 px-4 py-4 opacity-60">
            <input
              type="radio"
              name="payment"
              value="electronic"
              disabled
              className="size-5 accent-primary"
            />
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container-high">
                <Icon name="credit_card" className="text-on-surface-variant" size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-on-surface-variant">{t("electronicPayment")}</p>
                <Badge tone="muted" className="text-[10px]">{t("comingSoon")}</Badge>
              </div>
            </div>
          </label>
        </div>
      </Card>

      {/* Place order */}
      <Button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full py-4 text-base"
      >
        {placing ? (
          <span className="inline-flex items-center gap-2">
            <Icon name="progress_activity" className="animate-spin" size="sm" />
            {t("placingOrder")}
          </span>
        ) : (
          <>
            <Icon name="shopping_bag" size="sm" />
            {t("placeOrder")}
          </>
        )}
      </Button>
    </div>
  );
}
