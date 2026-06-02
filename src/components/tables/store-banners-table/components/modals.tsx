"use client";

import { BannerFormModal } from "@/components/modals/store/banner-form";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedBanner = useMirror("selectedBanner");

  const close = () => setActiveModal(null);

  return (
    <BannerFormModal
      isOpen={activeModal === "create" || activeModal === "edit"}
      onClose={close}
      banner={activeModal === "edit" ? selectedBanner : null}
    />
  );
};

export { Modals };
