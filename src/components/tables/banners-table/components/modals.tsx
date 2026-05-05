"use client";

import { useMirror } from "../store";
import { BannerFormModal } from "./banner-form-modal";

const Modals = () => {
    const activeModal = useMirror("activeModal");
    const setActiveModal = useMirror("setActiveModal");

    const close = () => {
        setActiveModal(null);
    };

    return (
        <BannerFormModal
            isOpen={activeModal === "create"}
            onClose={close}
        />
    );
};

export { Modals };
