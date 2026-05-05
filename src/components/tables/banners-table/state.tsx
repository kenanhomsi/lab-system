"use client";

import { PropsWithChildren, useState } from "react";
import { BannerModalType } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [activeModal, setActiveModal] = useState<BannerModalType>(null);

    useMirrorRegistry("pageNumber", pageNumber);
    useMirrorRegistry("setPageNumber", setPageNumber);
    useMirrorRegistry("activeModal", activeModal);
    useMirrorRegistry("setActiveModal", setActiveModal);

    return <>{children}</>;
};

export { State };
