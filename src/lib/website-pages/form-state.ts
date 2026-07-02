import dayjs from "dayjs";
import {
  WEBSITE_PAGE_BLOCK_TYPES,
  WEBSITE_PAGE_DEFAULT_TEMPLATE_KEY,
  WEBSITE_PAGE_PUBLISH_STATUSES,
} from "@/lib/website-pages/constants";
import { WEBSITE_PAGE_LANGUAGES } from "@/lib/website-pages/language";
import { toIso8601Utc } from "@/lib/dates/to-iso-8601";
import type {
  BlockLocalizationDto,
  ContentBlockDto,
  ContentBlockRequest,
  PageDto,
  PageTranslationDto,
  PageUpsertRequest,
  WebsitePageBlockType,
  WebsitePageLanguage,
  WebsitePagePublishStatus,
} from "@/types/website-page";

export type TranslationForm = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  openGraphImageUrl: string;
  openGraphImageFile: File | null;
  canonicalUrl: string;
  breadcrumbTitle: string;
};

export type BlockLocalizationForm = {
  heading: string;
  subheading: string;
  description: string;
  mediaUrl: string;
  mediaFile: File | null;
  mediaAltText: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: string;
};

export type CardItemForm = {
  title: string;
  description: string;
  imageUrl: string;
  imageFile: File | null;
  link: string;
};

export type ContentBlockForm = {
  blockType: WebsitePageBlockType;
  order: number;
  customCssClass: string;
  animation: string;
  isActive: boolean;
  localizations: Record<WebsitePageLanguage, BlockLocalizationForm>;
  cards: CardItemForm[];
};

export type PageFormState = {
  templateKey: string;
  parentId: string;
  order: number;
  publishStatus: WebsitePagePublishStatus;
  publishScheduledAt: string;
  publishedAt: string;
  isVisibleInNav: boolean;
  isActive: boolean;
  visibleToRoles: string[];
  translations: Record<WebsitePageLanguage, TranslationForm>;
  contentBlocks: ContentBlockForm[];
  changeNotes: string;
};

export const emptyTranslation = (): TranslationForm => ({
  title: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  openGraphImageUrl: "",
  openGraphImageFile: null,
  canonicalUrl: "",
  breadcrumbTitle: "",
});

export const emptyBlockLocalization = (): BlockLocalizationForm => ({
  heading: "",
  subheading: "",
  description: "",
  mediaUrl: "",
  mediaFile: null,
  mediaAltText: "",
  buttonText: "",
  buttonLink: "",
  buttonStyle: "",
});

export const emptyTranslations = (): Record<WebsitePageLanguage, TranslationForm> => ({
  "en-US": emptyTranslation(),
  ar: emptyTranslation(),
});

export const emptyBlockLocalizations = (): Record<
  WebsitePageLanguage,
  BlockLocalizationForm
> => ({
  "en-US": emptyBlockLocalization(),
  ar: emptyBlockLocalization(),
});

export const initialFormState = (): PageFormState => ({
  templateKey: WEBSITE_PAGE_DEFAULT_TEMPLATE_KEY,
  parentId: "",
  order: 0,
  publishStatus: "Draft",
  publishScheduledAt: "",
  publishedAt: "",
  isVisibleInNav: true,
  isActive: true,
  visibleToRoles: [],
  translations: emptyTranslations(),
  contentBlocks: [],
  changeNotes: "",
});

export const emptyCard = (): CardItemForm => ({
  title: "",
  description: "",
  imageUrl: "",
  imageFile: null,
  link: "",
});

export const createBlock = (order: number): ContentBlockForm => ({
  blockType: "hero",
  order,
  customCssClass: "",
  animation: "",
  isActive: true,
  localizations: emptyBlockLocalizations(),
  cards: [],
});

const normalizeDateInput = (value?: string | null) => {
  if (!value) return "";
  const parsed = dayjs(value);
  if (!parsed.isValid()) return "";
  return parsed.format("YYYY-MM-DD HH:mm:ss");
};

/** Mantine DateTimePicker expects `YYYY-MM-DD HH:mm:ss` or null. */
export const toMantineDateTimeValue = (value: string): string | null => {
  if (!value.trim()) return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.format("YYYY-MM-DD HH:mm:ss");
};

/** Normalizes Mantine DateTimePicker output for form state storage. */
export const fromMantineDateTimeValue = (value: string | null): string => {
  if (!value) return "";
  const parsed = dayjs(value);
  if (!parsed.isValid()) return "";
  return parsed.format("YYYY-MM-DD HH:mm:ss");
};

const toOptionalText = (value: string) => value.trim() || null;

const getTranslation = (
  translations: PageTranslationDto[] | null | undefined,
  language: WebsitePageLanguage,
): TranslationForm => {
  const row = translations?.find((item) => item.language === language);
  return {
    title: row?.title ?? "",
    slug: row?.slug ?? "",
    metaTitle: row?.metaTitle ?? "",
    metaDescription: row?.metaDescription ?? "",
    metaKeywords: row?.metaKeywords ?? "",
    openGraphImageUrl: row?.openGraphImageUrl ?? "",
    openGraphImageFile: null,
    canonicalUrl: row?.canonicalUrl ?? "",
    breadcrumbTitle: row?.breadcrumbTitle ?? "",
  };
};

const getBlockLocalization = (
  localizations: BlockLocalizationDto[] | null | undefined,
  language: WebsitePageLanguage,
): BlockLocalizationForm => {
  const row = localizations?.find((item) => item.language === language);
  return {
    heading: row?.heading ?? "",
    subheading: row?.subheading ?? "",
    description: row?.description ?? "",
    mediaUrl: row?.mediaUrl ?? "",
    mediaFile: null,
    mediaAltText: row?.mediaAltText ?? "",
    buttonText: row?.buttonText ?? "",
    buttonLink: row?.buttonLink ?? "",
    buttonStyle: row?.buttonStyle ?? "",
  };
};

const isSupportedBlockType = (value: string | null | undefined): value is WebsitePageBlockType =>
  WEBSITE_PAGE_BLOCK_TYPES.some((type) => type === value);

const extractCards = (block: ContentBlockDto): CardItemForm[] => {
  const data = block.localizations?.[0]?.contentData;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return [];
  }
  const cards = (data as { cards?: unknown }).cards;
  if (!Array.isArray(cards)) {
    return [];
  }
  return cards.map((card) => {
    if (!card || typeof card !== "object" || Array.isArray(card)) {
      return emptyCard();
    }
    const item = card as Record<string, unknown>;
    return {
      title: typeof item.title === "string" ? item.title : "",
      description: typeof item.description === "string" ? item.description : "",
      imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : "",
      imageFile: null,
      link: typeof item.link === "string" ? item.link : "",
    };
  });
};

export const pageToForm = (page: PageDto): PageFormState => ({
  templateKey: page.templateKey ?? WEBSITE_PAGE_DEFAULT_TEMPLATE_KEY,
  parentId: page.parentId ? String(page.parentId) : "",
  order: page.order,
  publishStatus: WEBSITE_PAGE_PUBLISH_STATUSES.includes(
    page.publishStatus as WebsitePagePublishStatus,
  )
    ? (page.publishStatus as WebsitePagePublishStatus)
    : "Draft",
  publishScheduledAt: normalizeDateInput(page.publishScheduledAt),
  publishedAt: normalizeDateInput(page.publishedAt),
  isVisibleInNav: page.isVisibleInNav,
  isActive: page.isActive,
  visibleToRoles: page.visibleToRoles ?? [],
  translations: {
    "en-US": getTranslation(page.translations, "en-US"),
    ar: getTranslation(page.translations, "ar"),
  },
  contentBlocks: (page.contentBlocks ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((block) => ({
      blockType: isSupportedBlockType(block.blockType) ? block.blockType : "rich-text",
      order: block.order,
      customCssClass: block.customCssClass ?? "",
      animation: block.animation ?? "",
      isActive: block.isActive,
      localizations: {
        "en-US": getBlockLocalization(block.localizations, "en-US"),
        ar: getBlockLocalization(block.localizations, "ar"),
      },
      cards: extractCards(block),
    })),
  changeNotes: "",
});

export const formToPayload = (form: PageFormState): PageUpsertRequest => {
  const parentId = form.parentId.trim() ? Number(form.parentId) : null;
  return {
    templateKey: form.templateKey.trim(),
    parentId: Number.isFinite(parentId) ? parentId : null,
    order: form.order,
    publishStatus: form.publishStatus,
    publishScheduledAt: form.publishScheduledAt
      ? toIso8601Utc(form.publishScheduledAt)
      : null,
    publishedAt: form.publishedAt ? toIso8601Utc(form.publishedAt) : null,
    isVisibleInNav: form.isVisibleInNav,
    isActive: form.isActive,
    visibleToRoles: form.visibleToRoles,
    translations: WEBSITE_PAGE_LANGUAGES.map((language) => {
      const translation = form.translations[language];
      return {
        language,
        title: translation.title.trim(),
        slug: translation.slug.trim(),
        metaTitle: toOptionalText(translation.metaTitle),
        metaDescription: toOptionalText(translation.metaDescription),
        metaKeywords: toOptionalText(translation.metaKeywords),
        openGraphImageUrl: toOptionalText(translation.openGraphImageUrl),
        canonicalUrl: toOptionalText(translation.canonicalUrl),
        breadcrumbTitle: toOptionalText(translation.breadcrumbTitle),
      };
    }),
    contentBlocks: form.contentBlocks
      .slice()
      .sort((a, b) => a.order - b.order)
      .map<ContentBlockRequest>((block) => ({
        blockType: block.blockType,
        order: block.order,
        customCssClass: toOptionalText(block.customCssClass),
        customStyles: null,
        animation: toOptionalText(block.animation),
        visibilityRules: null,
        isActive: block.isActive,
        localizations: WEBSITE_PAGE_LANGUAGES.map((language) => {
          const localization = block.localizations[language];
          return {
            language,
            heading: toOptionalText(localization.heading),
            subheading: toOptionalText(localization.subheading),
            description: toOptionalText(localization.description),
            contentData:
              block.blockType === "cards"
                ? {
                    cards: block.cards
                      .filter(
                        (card) =>
                          card.title.trim() ||
                          card.description.trim() ||
                          card.imageUrl.trim() ||
                          card.link.trim(),
                      )
                      .map((card) => ({
                        title: card.title.trim(),
                        description: card.description.trim(),
                        imageUrl: card.imageUrl.trim(),
                        link: card.link.trim(),
                      })),
                  }
                : null,
            mediaUrl: toOptionalText(localization.mediaUrl),
            mediaAltText: toOptionalText(localization.mediaAltText),
            buttonText: toOptionalText(localization.buttonText),
            buttonLink: toOptionalText(localization.buttonLink),
            buttonStyle: toOptionalText(localization.buttonStyle),
          };
        }),
      })),
    changeNotes: toOptionalText(form.changeNotes),
  };
};

export const hasRequiredTranslations = (form: PageFormState) =>
  WEBSITE_PAGE_LANGUAGES.every((language) => {
    const translation = form.translations[language];
    return translation.title.trim() && translation.slug.trim();
  });

export const reorderBlocks = (
  blocks: ContentBlockForm[],
  fromIndex: number,
  direction: "up" | "down",
): ContentBlockForm[] => {
  const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
  if (toIndex < 0 || toIndex >= blocks.length) return blocks;
  const next = blocks.slice();
  [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
  return next.map((block, index) => ({ ...block, order: index }));
};

export const renumberBlocks = (blocks: ContentBlockForm[]): ContentBlockForm[] =>
  blocks.map((block, index) => ({ ...block, order: index }));
