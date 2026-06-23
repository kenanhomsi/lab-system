"use client";

import { PropsWithChildren, useState } from "react";
import { BannerItem, BannerModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [activeModal, setActiveModal] = useState<BannerModalType>(null);
    const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);

    useMirrorRegistry("pageNumber", pageNumber);
    useMirrorRegistry("setPageNumber", setPageNumber);
    useMirrorRegistry("activeModal", activeModal);
    useMirrorRegistry("setActiveModal", setActiveModal);
    useMirrorRegistry("selectedBanner", selectedBanner);
    useMirrorRegistry("setSelectedBanner", setSelectedBanner);

    return <>{children}</>;
};

export { State };
