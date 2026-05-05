"use client";

import { PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const [initialIds, setInitialIds] = useState<string[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useMirrorRegistry("initialIds", initialIds);
  useMirrorRegistry("setInitialIds", setInitialIds);
  useMirrorRegistry("checkedIds", checkedIds);
  useMirrorRegistry("setCheckedIds", setCheckedIds);
  useMirrorRegistry("search", search);
  useMirrorRegistry("setSearch", setSearch);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
