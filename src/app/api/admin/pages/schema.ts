import { z } from "zod";

const optionalText = z.string().trim().nullable().optional();
const optionalDateText = z.string().nullable().optional();
const optionalJson = z.unknown().nullable().optional();

const pageTranslationSchema = z.object({
  language: z.string().trim().min(1),
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  metaTitle: optionalText,
  metaDescription: optionalText,
  metaKeywords: optionalText,
  openGraphImageUrl: optionalText,
  canonicalUrl: optionalText,
  breadcrumbTitle: optionalText,
});

const blockLocalizationSchema = z.object({
  language: z.string().trim().min(1),
  heading: optionalText,
  subheading: optionalText,
  description: optionalText,
  contentData: optionalJson,
  mediaUrl: optionalText,
  mediaAltText: optionalText,
  buttonText: optionalText,
  buttonLink: optionalText,
  buttonStyle: optionalText,
});

const contentBlockSchema = z.object({
  blockType: z.string().trim().min(1),
  order: z.number().int().min(0),
  customCssClass: optionalText,
  customStyles: optionalJson,
  animation: optionalText,
  visibilityRules: optionalJson,
  isActive: z.boolean(),
  localizations: z.array(blockLocalizationSchema).min(1),
});

const pageUpsertSchema = z.object({
  templateKey: z.string().trim().min(1),
  parentId: z.number().int().positive().nullable().optional(),
  order: z.number().int().min(0),
  publishStatus: z.string().trim().min(1),
  publishScheduledAt: optionalDateText,
  publishedAt: optionalDateText,
  isVisibleInNav: z.boolean(),
  isActive: z.boolean(),
  translations: z.array(pageTranslationSchema).min(1),
  contentBlocks: z.array(contentBlockSchema),
  changeNotes: optionalText,
});

export { pageUpsertSchema };
