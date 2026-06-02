"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { StoreSlider } from "@/modules/store";
import type { UpsertStoreSliderInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";
import { initialValues } from "./types";

function sliderToForm(slider: StoreSlider): UpsertStoreSliderInput {
  return {
    title: slider.title,
    type: slider.type || "Custom",
    displayOrder: slider.displayOrder,
    isActive: slider.isActive ?? true,
    productIds: slider.products.map((product) => product.id),
  };
}

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const slider = useMirror("slider");
  const [form, setForm] = useState<UpsertStoreSliderInput>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync form when modal opens/closes */
    if (!isOpen) {
      setForm(initialValues);
      return;
    }
    setForm(slider ? sliderToForm(slider) : initialValues);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, slider]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
