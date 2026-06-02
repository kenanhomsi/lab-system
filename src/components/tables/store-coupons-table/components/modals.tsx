"use client";

import { CouponFormModal } from "@/components/modals/store/coupon-form";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedCoupon = useMirror("selectedCoupon");

  const close = () => setActiveModal(null);

  return (
    <CouponFormModal
      isOpen={activeModal === "create" || activeModal === "edit"}
      onClose={close}
      coupon={activeModal === "edit" ? selectedCoupon : null}
    />
  );
};

export { Modals };
