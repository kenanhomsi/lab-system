"use client";

import { PackageFormModal } from "@/components/modals/subscription-packages";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedPackage = useMirror("selectedPackage");
  const setSelectedPackage = useMirror("setSelectedPackage");

  const close = () => {
    setActiveModal(null);
    setSelectedPackage(null);
  };

  return (
    <PackageFormModal
      isOpen={activeModal === "create" || activeModal === "edit"}
      onClose={close}
      subscriptionPackage={activeModal === "edit" ? selectedPackage : null}
    />
  );
};

export { Modals };
