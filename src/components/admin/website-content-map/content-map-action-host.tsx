"use client";

import { MutationErrorProvider } from "@/hooks/mutation-error-context";
import type { CreateWelcomePageRequest } from "@/types/welcome-page";
import { BannerFormModal } from "@/components/tables/banners-table/components/banner-form-modal";
import { DeleteBannerModal } from "@/components/tables/banners-table/components/delete-banner-modal";
import { AdFormModal } from "@/components/tables/ads-table/components/ad-form-modal";
import { DeleteAdModal } from "@/components/tables/ads-table/components/delete-ad-modal";
import { SlideCardFormModal } from "@/components/tables/slide-cards-table/slide-card-form-modal";
import { WelcomePageFormModal } from "./welcome-page-form-modal";
import { DeleteWelcomePageModal } from "./delete-welcome-page-modal";
import { DeleteSlideCardModal } from "@/components/tables/slide-cards-table/delete-slide-card-modal";
import { useContentMapActions } from "./content-map-actions-context";

/**
 * Renders modals for content-map CRUD actions.
 */
export function ContentMapActionHost() {
  const { action, closeAction, mutations } = useContentMapActions();

  const bannerMutations = {
    onCreate: async (payload: Parameters<typeof mutations.createBanner>[0]) => {
      await mutations.createBanner(payload);
    },
    onUpdate: async (payload: Parameters<typeof mutations.updateBanner>[0]) => {
      await mutations.updateBanner(payload);
    },
  };

  const adMutations = {
    onCreate: async (payload: Parameters<typeof mutations.createAd>[0]) => {
      await mutations.createAd(payload);
    },
    onUpdate: async (payload: Parameters<typeof mutations.updateAd>[0]) => {
      await mutations.updateAd(payload);
    },
  };

  return (
    <MutationErrorProvider>
      <BannerFormModal
        mode="create"
        isOpen={action?.type === "banner-create"}
        onClose={closeAction}
        preset={
          action?.type === "banner-create"
            ? {
                location: action.preset.location,
                displayOrder: action.preset.displayOrder,
              }
            : undefined
        }
        mutations={bannerMutations}
      />
      <BannerFormModal
        mode="edit"
        isOpen={action?.type === "banner-edit"}
        onClose={closeAction}
        banner={action?.type === "banner-edit" ? action.banner : null}
        mutations={bannerMutations}
      />
      <DeleteBannerModal
        isOpen={action?.type === "banner-delete"}
        onClose={closeAction}
        banner={action?.type === "banner-delete" ? action.banner : null}
        onDelete={mutations.deleteBanner}
      />

      <AdFormModal
        mode="create"
        isOpen={action?.type === "ad-create"}
        onClose={closeAction}
        preset={
          action?.type === "ad-create"
            ? { addressName: action.preset.addressName }
            : undefined
        }
        mutations={adMutations}
      />
      <AdFormModal
        mode="edit"
        isOpen={action?.type === "ad-edit"}
        onClose={closeAction}
        ad={action?.type === "ad-edit" ? action.ad : null}
        mutations={adMutations}
      />
      <DeleteAdModal
        isOpen={action?.type === "ad-delete"}
        onClose={closeAction}
        ad={action?.type === "ad-delete" ? action.ad : null}
        onDelete={mutations.deleteAd}
      />

      <SlideCardFormModal
        mode="create"
        isOpen={action?.type === "slide-card-create"}
        onClose={closeAction}
        preset={
          action?.type === "slide-card-create" ? action.preset : undefined
        }
        onSubmit={async (payload) => {
          if (!payload.image) return;
          await mutations.createSlideCard({
            title: payload.title,
            description: payload.description,
            price: payload.price,
            discount: payload.discount,
            expiryDate: payload.expiryDate,
            badge: payload.badge,
            detailPageLink: payload.detailPageLink,
            displayOrder: payload.displayOrder,
            isActive: payload.isActive,
            image: payload.image,
          });
        }}
      />
      <SlideCardFormModal
        mode="edit"
        isOpen={action?.type === "slide-card-edit"}
        onClose={closeAction}
        card={action?.type === "slide-card-edit" ? action.card : null}
        onSubmit={async (payload) => {
          if (!payload.id) return;
          await mutations.updateSlideCard({
            id: payload.id,
            title: payload.title,
            description: payload.description,
            price: payload.price,
            discount: payload.discount,
            expiryDate: payload.expiryDate,
            badge: payload.badge,
            detailPageLink: payload.detailPageLink,
            displayOrder: payload.displayOrder,
            isActive: payload.isActive,
            image: payload.image,
          });
        }}
      />
      <DeleteSlideCardModal
        isOpen={action?.type === "slide-card-delete"}
        onClose={closeAction}
        card={action?.type === "slide-card-delete" ? action.card : null}
        onDelete={mutations.deleteSlideCard}
      />

      <WelcomePageFormModal
        mode="create"
        isOpen={action?.type === "welcome-create"}
        onClose={closeAction}
        onSubmit={async (payload) => {
          await mutations.createWelcomePage(payload as CreateWelcomePageRequest);
        }}
      />
      <WelcomePageFormModal
        mode="edit"
        isOpen={action?.type === "welcome-edit"}
        onClose={closeAction}
        item={action?.type === "welcome-edit" ? action.item : null}
        onSubmit={async (payload) => {
          if ("id" in payload) {
            await mutations.updateWelcomePage(payload);
          }
        }}
      />
      <DeleteWelcomePageModal
        isOpen={action?.type === "welcome-delete"}
        onClose={closeAction}
        item={action?.type === "welcome-delete" ? action.item : null}
        onDelete={mutations.deleteWelcomePage}
      />
    </MutationErrorProvider>
  );
}
