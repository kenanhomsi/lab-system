"use client";

import { useMounted } from "@mantine/hooks";
import { PropsWithChildren, useState } from "react";
import { SubscriptionPackageItem, SubscriptionPackageModalType, TargetAudience } from "./types";
import { useMirrorRegistry } from "./store";

const State = ({ children }: PropsWithChildren) => {
  const isHydrated = useMounted();
  const [pageNumber, setPageNumber] = useState(1);
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<TargetAudience | "all">(
    "all",
  );
  const [isActiveFilter, setIsActiveFilter] = useState<"all" | "active" | "inactive">("all");
  const [activeModal, setActiveModal] = useState<SubscriptionPackageModalType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackageItem | null>(null);

  useMirrorRegistry("pageNumber", pageNumber);
  useMirrorRegistry("setPageNumber", setPageNumber);
  useMirrorRegistry("targetAudienceFilter", targetAudienceFilter);
  useMirrorRegistry("setTargetAudienceFilter", setTargetAudienceFilter);
  useMirrorRegistry("isActiveFilter", isActiveFilter);
  useMirrorRegistry("setIsActiveFilter", setIsActiveFilter);
  useMirrorRegistry("activeModal", activeModal);
  useMirrorRegistry("setActiveModal", setActiveModal);
  useMirrorRegistry("selectedPackage", selectedPackage);
  useMirrorRegistry("setSelectedPackage", setSelectedPackage);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
};

export { State };
