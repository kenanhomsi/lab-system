"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { StoreCoupon } from "@/modules/store";
import type { UpsertStoreCouponInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";
import { initialValues } from "./types";

function couponToForm(coupon: StoreCoupon): UpsertStoreCouponInput {
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    amount: coupon.amount,
    minimumSubtotal: coupon.minimumSubtotal,
    maximumDiscountAmount: coupon.maximumDiscountAmount,
    startsAt: coupon.startsAt,
    expiresAt: coupon.expiresAt,
    isActive: coupon.isActive,
  };
}

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const coupon = useMirror("coupon");
  const [form, setForm] = useState<UpsertStoreCouponInput>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync form when modal opens/closes */
    if (!isOpen) {
      setForm(initialValues);
      return;
    }
    setForm(coupon ? couponToForm(coupon) : initialValues);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, coupon]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
