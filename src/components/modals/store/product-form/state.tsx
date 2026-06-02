"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { StoreProduct } from "@/modules/store";
import type { UpsertStoreProductInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";
import { initialValues } from "./types";

function productToForm(product: StoreProduct): UpsertStoreProductInput {
  return {
    categoryId: product.categoryId,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    description: product.description ?? "",
    imageUrl: product.imageUrl,
    saleUnit: product.saleUnit,
    price: product.price,
    discountPrice: product.discountPrice,
    topBadge: product.topBadge,
    displayOrder: product.displayOrder ?? 0,
    isRecommended: product.isRecommended ?? false,
    isBestSeller: product.isBestSeller ?? false,
    isActive: product.isActive ?? true,
  };
}

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const product = useMirror("product");
  const [form, setForm] = useState<UpsertStoreProductInput>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync form when modal opens/closes */
    if (!isOpen) {
      setForm(initialValues);
      return;
    }
    setForm(product ? productToForm(product) : initialValues);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, product]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
