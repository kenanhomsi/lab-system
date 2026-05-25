"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { QUICK_ACTION_OPEN_PARAM } from "@/lib/quick-actions/constants";
import { normalizePathForQuickAction } from "@/lib/quick-actions/normalize-path";
import {
  clearPendingQuickAction,
  readPendingQuickAction,
} from "@/lib/quick-actions/storage";

/**
 * Opens a table modal when `?open=` matches or when sessionStorage has a pending
 * quick action for this route. The actual `setActiveModal` runs on the next
 * macrotask so parent `useMirrorRegistry` effects have registered real setters
 * (child effects can run before parent mirror sync otherwise → no-op).
 */
const useQuickActionFromUrl = (modal: string, onOpen: () => void) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const onOpenRef = useRef(onOpen);

  onOpenRef.current = onOpen;

  useEffect(() => {
    const normalizedPath = normalizePathForQuickAction(pathname);
    const fromUrl = searchParams.get(QUICK_ACTION_OPEN_PARAM);
    const pending = readPendingQuickAction();

    const pendingPathOk =
      !pending?.targetPath ||
      normalizePathForQuickAction(pending.targetPath) === normalizedPath;

    const openFromUrl = fromUrl === modal;
    const openFromPending =
      !fromUrl &&
      !!pending &&
      pending.modal === modal &&
      pendingPathOk;

    if (!openFromUrl && !openFromPending) {
      return;
    }

    clearPendingQuickAction();

    const openTimeoutId = window.setTimeout(() => {
      onOpenRef.current();
    }, 0);

    if (!fromUrl) {
      return () => window.clearTimeout(openTimeoutId);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(QUICK_ACTION_OPEN_PARAM);
    const query = params.toString();

    const replaceTimeoutId = window.setTimeout(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }, 0);

    return () => {
      window.clearTimeout(openTimeoutId);
      window.clearTimeout(replaceTimeoutId);
    };
  }, [searchParams, modal, router, pathname]);
};

export { useQuickActionFromUrl };
