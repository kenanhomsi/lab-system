"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useMirror, useMirrorRegistry } from "./store";
import { utilityItem } from "./type";

const State = ({ children }: PropsWithChildren) => {
  const items = useMirror("items");
  const pathname = usePathname();

  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");

  const pathBasedIndex = useMemo(() => {
    const matchedIndex = items.findIndex((item) =>
      pathname.startsWith(item.href),
    );
    return matchedIndex >= 0 ? matchedIndex : 0;
  }, [items, pathname]);

  const [activeIndex, setActiveIndex] = useState(pathBasedIndex);
  const [activeUtility, setActiveUtilityState] = useState<utilityItem>("light");

  useEffect(() => {
    setActiveIndex(pathBasedIndex);
  }, [pathBasedIndex]);

  // Keep the sidebar indicator in sync with the actual scheme (e.g. on first load)
  useEffect(() => {
    setActiveUtilityState(computedScheme as utilityItem);
  }, [computedScheme]);

  const setActiveUtility = useCallback(
    (mode: utilityItem) => {
      setActiveUtilityState(mode);
      setColorScheme(mode);
    },
    [setColorScheme],
  );

  useMirrorRegistry("activeIndex", activeIndex, "value");
  useMirrorRegistry("activeUtility", activeUtility, "value");
  useMirrorRegistry("setActiveIndex", setActiveIndex, "reference");
  useMirrorRegistry("setActiveUtility", setActiveUtility, "reference");

  return <>{children}</>;
};

export default State;