"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";

type Order = {
  id: string;
  date: string;
  status: string;
  total: number;
  itemCount: number;
};

type OrderDetail = {
  id: string;
  date: string;
  status: string;
  total: number;
  deliveryFee: number;
  subtotal: number;
  paymentMethod: string;
  items: {
    productId: string;
    name: string;
    nameAr: string;
    quantity: number;
    unitPrice: number;
    total: number;
    discount: number;
  }[];
  tracking: {
    status: string;
    date: string;
    label: string;
  }[];
};

const STATUS_TONE: Record<string, BadgeTone> = {
  pending: "warning",
  processing: "default",
  confirmed: "default",
  shipped: "success",
  delivered: "success",
  cancelled: "critical",
};

export function OrdersPage() {
  const t = useTranslations("labStore");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/store/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  async function viewOrderDetails(orderId: string) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/store/orders/${orderId}`);
      if (res.ok) {
        setSelectedOrder(await res.json());
      }
    } catch {
      /* ignore */
    } finally {
      setDetailLoading(false);
    }
  }

  function statusKey(status: string) {
    const map: Record<string, string> = {
      pending: "pending",
      processing: "processing",
      confirmed: "confirmed",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return map[status] ?? status;
  }

  if (selectedOrder) {
    return (
      <div className="mx-auto max-w-3xl p-4 md:p-8">
        <button
          type="button"
          onClick={() => setSelectedOrder(null)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <Icon name="arrow_back" className="rtl:rotate-180" size="sm" />
          {t("backToOrders")}
        </button>

        <Card className="mb-6 shadow-md" padding="lg">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-headline text-xl font-bold text-on-surface">
              {t("orderDetails")} #{selectedOrder.id}
            </h2>
            <Badge tone={STATUS_TONE[selectedOrder.status] ?? "default"}>
              {t(statusKey(selectedOrder.status))}
            </Badge>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <p className="text-on-surface-variant">{t("orderDate")}</p>
              <p className="font-bold text-on-surface">{selectedOrder.date}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">{t("subtotal")}</p>
              <p className="font-bold text-on-surface">{selectedOrder.subtotal} {t("currency")}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">{t("deliveryFee")}</p>
              <p className="font-bold text-on-surface">{selectedOrder.deliveryFee} {t("currency")}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">{t("total")}</p>
              <p className="font-bold text-primary">{selectedOrder.total} {t("currency")}</p>
            </div>
          </div>

          {/* Items */}
          <div className="overflow-x-auto rounded-xl border border-outline-variant/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-low/50">
                  <th className="px-4 py-3 text-start font-bold text-on-surface">{t("product")}</th>
                  <th className="px-4 py-3 text-center font-bold text-on-surface">{t("quantity")}</th>
                  <th className="px-4 py-3 text-end font-bold text-on-surface">{t("unitPrice")}</th>
                  <th className="px-4 py-3 text-end font-bold text-on-surface">{t("total")}</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.productId} className="border-b border-outline-variant/5 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-on-surface">{item.nameAr}</p>
                      <p className="text-xs text-on-surface-variant">{item.name}</p>
                    </td>
                    <td className="px-4 py-3 text-center text-on-surface">{item.quantity}</td>
                    <td className="px-4 py-3 text-end text-on-surface">{item.unitPrice}</td>
                    <td className="px-4 py-3 text-end font-bold text-on-surface">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tracking */}
        <Card className="shadow-md" padding="lg">
          <h3 className="mb-4 flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
            <Icon name="local_shipping" size="md" />
            {t("trackingTimeline")}
          </h3>
          <div className="relative ms-4 border-s-2 border-primary/20 ps-6">
            {selectedOrder.tracking.map((step, i) => (
              <div key={i} className="relative mb-6 last:mb-0">
                <div className="absolute -start-[calc(1.5rem+5px)] top-1 flex size-3 items-center justify-center rounded-full bg-primary ring-4 ring-primary/10" />
                <p className="text-sm font-bold text-on-surface">{step.label}</p>
                <p className="text-xs text-on-surface-variant">
                  {new Date(step.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center md:text-start">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
          <Icon name="list_alt" filled size="sm" />
          {t("myOrdersBadge")}
        </span>
        <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
          {t("myOrders")}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-on-surface-variant md:mx-0">
          {t("myOrdersDesc")}
        </p>
      </div>

      {loading || detailLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center shadow-md">
          <Icon name="inventory_2" className="mx-auto mb-3 text-on-surface-variant/40" size="lg" />
          <p className="text-on-surface-variant">{t("noOrders")}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="shadow-md transition-shadow hover:shadow-lg" padding="none">
              <button
                type="button"
                onClick={() => viewOrderDetails(order.id)}
                className="flex w-full flex-col gap-4 p-5 text-start sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon name="shopping_bag" className="text-primary" size="md" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">#{order.id}</p>
                    <p className="text-xs text-on-surface-variant">{order.date}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={STATUS_TONE[order.status] ?? "default"}>
                    {t(statusKey(order.status))}
                  </Badge>
                  <span className="text-sm text-on-surface-variant">
                    {t("itemsCount", { count: order.itemCount })}
                  </span>
                  <span className="font-headline font-bold text-primary">
                    {order.total} {t("currency")}
                  </span>
                  <Icon name="chevron_right" className="text-on-surface-variant rtl:rotate-180" size="sm" />
                </div>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
