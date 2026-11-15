"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { buildQuickActionHref } from "@/lib/quick-actions/build-href";
import { writePendingQuickAction } from "@/lib/quick-actions/storage";
import type { navbarQuickAction } from "@/components/shared/navbar/type";

/**
 * Returns a callback that navigates to a quick action's page and, when the
 * action declares a modal, asks that page to open it on arrival.
 */
export const useQuickActionNavigate = () => {
  const router = useRouter();

  return useCallback(
    (action: Pick<navbarQuickAction, "href" | "modal" | "tab">) => {
      if (action.modal) {
        writePendingQuickAction({
          modal: action.modal,
          tab: action.tab,
          targetPath: action.href,
        });
      }

      router.push(
        buildQuickActionHref(action.href, { modal: action.modal, tab: action.tab }),
      );
    },
    [router],
  );
};
