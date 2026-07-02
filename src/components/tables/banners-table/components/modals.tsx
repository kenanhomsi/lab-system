"use client";

import { useMirror } from "../store";
import { BannerFormModal } from "./banner-form-modal";
import { DeleteBannerModal } from "./delete-banner-modal";
import { ViewBannerModal } from "./view-banner-modal";

const Modals = () => {
    const activeModal = useMirror("activeModal");
    const setActiveModal = useMirror("setActiveModal");
    const setSelectedBanner = useMirror("setSelectedBanner");
    const selectedBanner = useMirror("selectedBanner");

    const close = () => {
        setActiveModal(null);
        setSelectedBanner(null);
    };

    return (
        <>
        <BannerFormModal
                isOpen={activeModal === "create" || activeModal === "edit"}
                onClose={close}
                mode={activeModal === "edit" ? "edit" : "create"}
                banner={activeModal === "edit" ? selectedBanner : null}
            />
            <ViewBannerModal
                isOpen={activeModal === "view"}
                onClose={close}
                banner={selectedBanner}
            />
            <DeleteBannerModal
                isOpen={activeModal === "delete"}
                onClose={close}
                banner={selectedBanner}
            />
        </>
    );
};

export { Modals };
