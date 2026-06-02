"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { StoreBanner } from "@/modules/store";
import type { UpsertStoreBannerInput } from "@/modules/store/abstraction/schemas";
import { useMirror, useMirrorRegistry } from "./store";
import { initialValues } from "./types";
import { toDateTimeLocal } from "./utils";

function bannerToForm(banner: StoreBanner): UpsertStoreBannerInput {
  return {
    title: banner.title,
    imageUrl: banner.imageUrl,
    linkUrl: banner.linkUrl,
    location: banner.location,
    categoryId: banner.categoryId,
    displayOrder: banner.displayOrder,
    isActive: banner.isActive ?? true,
    startsAt: toDateTimeLocal(banner.startsAt),
    endsAt: toDateTimeLocal(banner.endsAt),
  };
}

const State = ({ children }: PropsWithChildren) => {
  const isOpen = useMirror("isOpen");
  const banner = useMirror("banner");
  const [form, setForm] = useState<UpsertStoreBannerInput>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync form when modal opens/closes */
    if (!isOpen) {
      setForm(initialValues);
      return;
    }
    setForm(banner ? bannerToForm(banner) : initialValues);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen, banner]);

  useMirrorRegistry("form", form);
  useMirrorRegistry("setForm", setForm);
  useMirrorRegistry("isSubmitting", isSubmitting);
  useMirrorRegistry("setIsSubmitting", setIsSubmitting);

  return <>{children}</>;
};

export { State };
