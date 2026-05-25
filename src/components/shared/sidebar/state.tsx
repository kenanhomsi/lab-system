"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "@/i18n/navigation";
import {
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useMirrorRegistry } from "./store";
import { sideBarItem, utilityItem } from "./type";

const State = ({
  children,
  items,
}: PropsWithChildren<{ items: sideBarItem[] }>) => {
  const pathname = usePathname();

  const { setColorScheme } = useMantineColorScheme();
  const computedScheme = useComputedColorScheme("light");

  const pathBasedIndex = useMemo(() => {
    const isActiveRoute = (href: string) =>
      pathname === href || pathname.startsWith(`${href}/`);

    let bestIndex = -1;
    let bestLength = -1;

    items.forEach((item, index) => {
      if (!isActiveRoute(item.href)) return;
      if (item.href.length > bestLength) {
        bestLength = item.href.length;
        bestIndex = index;
      }
    });

    return bestIndex >= 0 ? bestIndex : 0;
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