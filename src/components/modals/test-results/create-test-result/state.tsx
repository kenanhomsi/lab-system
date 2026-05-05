"use client";

import { PropsWithChildren } from "react";

/** Legacy composition slot; modal state lives in `UI`. */
const State = ({ children }: PropsWithChildren) => <>{children}</>;

export { State };
