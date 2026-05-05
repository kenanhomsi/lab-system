"use client";
import { PropsWithChildren } from "react";
import { useMirrorRegistry } from "./store";
import { FactoryProps } from "./types";
const Init = ({children,...props}: PropsWithChildren<FactoryProps>) => { useMirrorRegistry("props", props); return <>{children}</>; };
export { Init };
