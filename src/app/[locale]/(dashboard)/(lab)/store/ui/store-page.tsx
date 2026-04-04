"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  price: number;
  unit: string;
  unitAr: string;
  discount: number;
  inStock: boolean;
  image: string | null;
};

type Category = {
  id: string;
  name: string;
  nameAr: string;
  children: { id: string; name: string; nameAr: string }[];
};

type CartItem = {
  product: Product;
  quantity: number;
};

export function StorePage() {
  const t = useTranslations("labStore");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch("/api/store/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (cat: string) => {
    setLoading(true);
    try {
      const params = cat ? `?category=${encodeURIComponent(cat)}` : "";
      const res = await fetch(`/api/store/products${params}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products ?? []);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory, fetchProducts]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  const totalItems = cart.reduce((s, c) => s + c.quantity, 0);

  function discountedPrice(p: Product) {
    return p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  }

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="text-center md:text-start">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-primary">
            <Icon name="storefront" filled size="sm" />
            {t("storeBadge")}
          </span>
          <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-on-surface md:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-on-surface-variant md:mx-0">
            {t("storeDesc")}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => setShowCart(!showCart)}
            className="relative inline-flex items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 text-sm font-bold text-on-surface shadow-sm transition-all hover:bg-surface-container-low"
          >
            <Icon name="shopping_cart" size="sm" />
            {t("cart")}
            {totalItems > 0 && (
              <span className="absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {totalItems}
              </span>
            )}
          </button>
          <Link
            href="/store/cart"
            className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary/20"
          >
            <Icon name="shopping_bag" size="sm" />
            {t("checkout")}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar categories */}
        <aside className="w-full shrink-0 lg:w-64">
          <Card className="sticky top-20 shadow-md" padding="sm">
            <h3 className="mb-3 px-2 font-headline text-sm font-bold text-on-surface">
              {t("categories")}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                selectedCategory === ""
                  ? "bg-primary/10 font-bold text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <Icon name="apps" size="sm" />
              {t("allProducts")}
            </button>
            {categories.map((cat) => (
              <div key={cat.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <Icon name="folder" size="sm" />
                  {cat.nameAr}
                </button>
                {cat.children.length > 0 && (
                  <div className="ms-4 border-s border-outline-variant/10 ps-2">
                    {cat.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className="mb-0.5 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-start text-xs text-on-surface-variant transition-colors hover:bg-surface-container-low"
                      >
                        {child.nameAr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Card>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <Icon name="progress_activity" className="animate-spin text-primary" size="lg" />
            </div>
          ) : products.length === 0 ? (
            <Card className="text-center shadow-md">
              <Icon name="inventory_2" className="mx-auto mb-3 text-on-surface-variant" size="lg" />
              <p className="text-on-surface-variant">{t("allProducts")}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="relative flex flex-col shadow-md transition-shadow hover:shadow-lg" padding="none">
                  {/* Image placeholder */}
                  <div className="flex h-40 items-center justify-center rounded-t-xl bg-gradient-to-br from-surface-container-low to-surface-container-high">
                    <Icon name="science" className="text-on-surface-variant/30" size="lg" />
                  </div>

                  {product.discount > 0 && (
                    <Badge tone="critical" className="absolute end-3 top-3">
                      -{product.discount}%
                    </Badge>
                  )}

                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="mb-1 font-headline text-sm font-bold text-on-surface">
                      {product.nameAr}
                    </h4>
                    <p className="mb-2 text-xs text-on-surface-variant">{product.name}</p>
                    <p className="mb-3 text-xs text-on-surface-variant">{product.unitAr}</p>

                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        {product.discount > 0 && (
                          <span className="me-2 text-xs text-on-surface-variant line-through">
                            {product.price}
                          </span>
                        )}
                        <span className="font-headline text-lg font-bold text-primary">
                          {discountedPrice(product)}
                        </span>
                        <span className="ms-1 text-xs text-on-surface-variant">{t("currency")}</span>
                      </div>

                      {product.inStock ? (
                        <Button
                          variant="primary"
                          className="px-3 py-2 text-xs"
                          onClick={() => addToCart(product)}
                        >
                          <Icon name="add_shopping_cart" size="sm" />
                          {t("addToCart")}
                        </Button>
                      ) : (
                        <Badge tone="muted">{t("outOfStock")}</Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart drawer overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowCart(false)}
            onKeyDown={(e) => e.key === "Escape" && setShowCart(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close cart"
          />
          <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-surface-container-lowest shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/10 p-4">
              <h3 className="flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
                <Icon name="shopping_cart" filled size="md" />
                {t("cart")}
              </h3>
              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="rounded-lg p-1 text-on-surface-variant transition-colors hover:bg-surface-container-low"
              >
                <Icon name="close" size="md" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center text-center">
                  <Icon name="shopping_cart" className="mb-3 text-on-surface-variant/30" size="lg" />
                  <p className="text-on-surface-variant">{t("emptyCart")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 rounded-xl border border-outline-variant/10 bg-surface p-3"
                    >
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low">
                        <Icon name="science" size="sm" className="text-on-surface-variant/50" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-on-surface">{item.product.nameAr}</p>
                        <p className="text-xs text-on-surface-variant">
                          {discountedPrice(item.product)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-primary">
                        {discountedPrice(item.product) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-outline-variant/10 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-bold text-on-surface">{t("total")}</span>
                  <span className="font-headline text-xl font-bold text-primary">
                    {cart.reduce((s, c) => s + discountedPrice(c.product) * c.quantity, 0)} {t("currency")}
                  </span>
                </div>
                <Link
                  href="/store/cart"
                  className="clinical-gradient flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-95"
                  onClick={() => setShowCart(false)}
                >
                  <Icon name="shopping_bag" size="sm" />
                  {t("checkout")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
