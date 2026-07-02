"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdItem } from "@/types/ad";
import type { BannerItem } from "@/types/banner";
import type { SlideCardItem } from "@/types/slide-card";
import type { WelcomePageItem } from "@/types/welcome-page";
import type { BannerPlacement } from "@/lib/banners/locations";
import { useContentMapMutations } from "./use-content-map-mutations";

export type ContentMapAction =
  | {
      type: "banner-create";
      preset: { location: BannerPlacement; displayOrder: number };
    }
  | { type: "banner-edit"; banner: BannerItem }
  | { type: "banner-delete"; banner: BannerItem }
  | { type: "ad-create"; preset: { addressName: BannerPlacement } }
  | { type: "ad-edit"; ad: AdItem }
  | { type: "ad-delete"; ad: AdItem }
  | { type: "slide-card-create"; preset?: { displayOrder?: number } }
  | { type: "slide-card-edit"; card: SlideCardItem }
  | { type: "slide-card-delete"; card: SlideCardItem }
  | { type: "welcome-create" }
  | { type: "welcome-edit"; item: WelcomePageItem }
  | { type: "welcome-delete"; item: WelcomePageItem }
  | null;

type ContentMapActionsContextValue = {
  action: ContentMapAction;
  openAction: (action: ContentMapAction) => void;
  closeAction: () => void;
  mutations: ReturnType<typeof useContentMapMutations>;
};

const ContentMapActionsContext = createContext<ContentMapActionsContextValue | null>(
  null,
);

/**
 * Provides content-map modal actions and shared mutations.
 */
export function ContentMapActionsProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<ContentMapAction>(null);
  const mutations = useContentMapMutations();

  const openAction = useCallback((next: ContentMapAction) => {
    setAction(next);
  }, []);

  const closeAction = useCallback(() => {
    setAction(null);
  }, []);

  const value = useMemo(
    () => ({ action, openAction, closeAction, mutations }),
    [action, openAction, closeAction, mutations],
  );

  return (
    <ContentMapActionsContext.Provider value={value}>
      {children}
    </ContentMapActionsContext.Provider>
  );
}

export function useContentMapActions() {
  const context = useContext(ContentMapActionsContext);
  if (!context) {
    throw new Error("useContentMapActions must be used within ContentMapActionsProvider");
  }
  return context;
}
