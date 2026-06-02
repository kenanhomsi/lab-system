import type { ModalProps } from "@mantine/core";

/** Glass overlay and content styles for store admin modals (teal brand). */
export const STORE_GLASS_OVERLAY_PROPS: ModalProps["overlayProps"] = {
  blur: 10,
  backgroundOpacity: 0.2,
};

export const STORE_GLASS_MODAL_STYLES: ModalProps["styles"] = {
  content: {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    background: "light-dark(rgba(255,255,255,0.82), rgba(18,18,23,0.78))",
    border: "1px solid light-dark(rgba(0,0,0,0.08), rgba(255,255,255,0.09))",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  body: {
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    margin:"15px 0",
    paddingInline: "clamp(14px, 2vw, 24px)",
    paddingBottom: "clamp(14px, 2vw, 24px)",
  },
};

export const STORE_FORM_MODAL_SIZE = 780;
export const STORE_DELETE_MODAL_SIZE = "sm";
