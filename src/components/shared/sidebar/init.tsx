"use client";

import { PropsWithChildren } from "react";
import { sideBarItem } from "./type";
import { useMirrorRegistry } from "./store";

const Init = (props: PropsWithChildren<{ items: sideBarItem[] }>) => {
    const { children, items } = props;
    useMirrorRegistry("items", items);
    return (
        <>{children}</>
    )
}

export default Init