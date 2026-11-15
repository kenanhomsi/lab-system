import { WEBSITE_PAGE_LANGUAGES } from "@/lib/website-pages/language";
import type { PageFormState } from "@/lib/website-pages/form-state";

const extractUploadUrl = (payload: unknown): string => {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid upload response");
  }
  const record = payload as Record<string, unknown>;
  if (typeof record.url === "string" && record.url.trim()) {
    return record.url.trim();
  }
  if (typeof record.imageUrl === "string" && record.imageUrl.trim()) {
    return record.imageUrl.trim();
  }
  if (record.data !== undefined) {
    return extractUploadUrl(record.data);
  }
  throw new Error("Invalid upload response");
};

export const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/upload-image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(errorBody?.message ?? "Image upload failed");
  }

  const body = (await response.json()) as unknown;
  return extractUploadUrl(body);
};

/**
 * Uploads pending image files and returns form state with URL fields populated.
 */
export const uploadPendingImages = async (form: PageFormState): Promise<PageFormState> => {
  const nextForm: PageFormState = {
    ...form,
    translations: { ...form.translations },
    contentBlocks: form.contentBlocks.map((block) => ({
      ...block,
      localizations: { ...block.localizations },
      cards: block.cards.map((card) => ({ ...card })),
    })),
  };

  for (const language of WEBSITE_PAGE_LANGUAGES) {
    const translation = nextForm.translations[language];
    if (translation.openGraphImageFile) {
      translation.openGraphImageUrl = await uploadImageFile(translation.openGraphImageFile);
      translation.openGraphImageFile = null;
    }
    nextForm.translations[language] = { ...translation };
  }

  for (let blockIndex = 0; blockIndex < nextForm.contentBlocks.length; blockIndex += 1) {
    const block = nextForm.contentBlocks[blockIndex];
    for (const language of WEBSITE_PAGE_LANGUAGES) {
      const localization = block.localizations[language];
      if (localization.mediaFile) {
        localization.mediaUrl = await uploadImageFile(localization.mediaFile);
        localization.mediaFile = null;
      }
      block.localizations[language] = { ...localization };
    }

    for (let cardIndex = 0; cardIndex < block.cards.length; cardIndex += 1) {
      const card = block.cards[cardIndex];
      if (card.imageFile) {
        card.imageUrl = await uploadImageFile(card.imageFile);
        card.imageFile = null;
      }
      block.cards[cardIndex] = { ...card };
    }

    nextForm.contentBlocks[blockIndex] = { ...block };
  }

  return nextForm;
};
