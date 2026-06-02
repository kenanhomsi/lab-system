"use client";

import { DeleteProductModal, ProductFormModal } from "@/components/modals/store";
import { useMirror } from "../store";

const Modals = () => {
  const activeModal = useMirror("activeModal");
  const setActiveModal = useMirror("setActiveModal");
  const selectedProduct = useMirror("selectedProduct");

  const close = () => setActiveModal(null);

  return (
    <>
      <ProductFormModal
        isOpen={activeModal === "create" || activeModal === "edit"}
        onClose={close}
        product={activeModal === "edit" ? selectedProduct : null}
      />
      <DeleteProductModal
        isOpen={activeModal === "delete"}
        onClose={close}
        product={selectedProduct}
      />
    </>
  );
};

export { Modals };
