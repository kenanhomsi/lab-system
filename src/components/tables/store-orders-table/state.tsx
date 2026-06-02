"use client";

import { useState } from "react";
import { useMirrorRegistry } from "./store";

const PAGE_SIZE = 20;

const State = ({ children }: { children: React.ReactNode }) => {
  const [pageNumber, setPageNumber] = useState(1);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("pageSize", PAGE_SIZE);

  return <>{children}</>;
};

export { State };
