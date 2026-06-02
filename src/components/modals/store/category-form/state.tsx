"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { StoreCategory } from "@/modules/store";
import type { UpsertStoreCategoryInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";
import { initialValues } from "./types";

function categoryToForm(category: StoreCategory): UpsertStoreCategoryInput {
  return {
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    description: category.description,
    imageUrl: category.imageUrl,
    parentCategoryId: category.parentCategoryId ?? null,
    displayOrder: category.displayOrder,
    isActive: category.isActive,
  };
}

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const category = useMirror("category");
  const [form, setForm] = useState<UpsertStoreCategoryInput>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync form when modal opens/closes */
    if (!isOpen) {
      setForm(initialValues);
      return;
    }
    setForm(category ? categoryToForm(category) : initialValues);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, category]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
