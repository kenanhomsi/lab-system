import { z } from "zod";

export const storeSettingsSchema = z.object({
  id: z.number(),
  announcementHeader: z.string(),
  serviceTitle: z.string(),
  serviceDescription: z.string(),
  deliveryFee: z.number(),
  deliveryDurationText: z.string(),
  cashOnDeliveryEnabled: z.boolean(),
  onlinePaymentEnabled: z.boolean(),
});

export const storeCategorySchema = z.object({
  id: z.number(),
  nameAr: z.string(),
  nameEn: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  parentCategoryId: z.number().nullable().optional(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  subcategories: z.array(z.string()).optional().default([]),
});

export const storeProductSchema = z.object({
  id: z.number(),
  categoryId: z.number(),
  categoryNameAr: z.string().optional(),
  categoryNameEn: z.string().optional(),
  nameAr: z.string(),
  nameEn: z.string(),
  description: z.string().optional().default(""),
  imageUrl: z.string(),
  saleUnit: z.string(),
  price: z.number(),
  discountPrice: z.number(),
  savedAmount: z.number(),
  topBadge: z.string(),
  displayOrder: z.number().optional(),
  isRecommended: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const storeBannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string(),
  linkUrl: z.string(),
  location: z.string(),
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.boolean().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const storeSliderSchema = z.object({
  id: z.number(),
  title: z.string(),
  type: z.string(),
  displayOrder: z.number(),
  products: z.array(storeProductSchema),
});

export const storeCouponSchema = z.object({
  id: z.number(),
  code: z.string(),
  discountType: z.string(),
  amount: z.number(),
  minimumSubtotal: z.number(),
  maximumDiscountAmount: z.number(),
  startsAt: z.string(),
  expiresAt: z.string(),
  isActive: z.boolean(),
});

export const storeOrderItemSchema = z.object({
  id: z.number().optional(),
  productId: z.number(),
  productNameAr: z.string().optional(),
  productNameEn: z.string().optional(),
  productNameSnapshot: z.string().optional(),
  saleUnit: z.string().optional(),
  saleUnitSnapshot: z.string().optional(),
  imageUrl: z.string().optional(),
  imageSnapshot: z.string().optional(),
  unitPrice: z.number().optional(),
  unitPriceSnapshot: z.number().optional(),
  discountPrice: z.number().optional(),
  discountPriceSnapshot: z.number().optional(),
  effectiveUnitPrice: z.number().optional(),
  quantity: z.number(),
  lineTotal: z.number(),
});

export const storeOrderStatusSchema = z.enum([
  "Pending",
  "Confirmed",
  "Preparing",
  "OutForDelivery",
  "Delivered",
  "Cancelled",
]);

export const storePaymentMethodSchema = z.enum(["CashOnDelivery", "OnlinePayment"]);

export const storeOrderSchema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  labClientId: z.string(),
  status: storeOrderStatusSchema,
  paymentMethod: storePaymentMethodSchema,
  paymentStatus: z.string(),
  subtotal: z.number(),
  discountAmount: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  couponCodeSnapshot: z.string().optional(),
  deliveryDurationSnapshot: z.string().optional(),
  notes: z.string().optional(),
  orderedAt: z.string(),
  items: z.array(storeOrderItemSchema).optional().default([]),
});

export const paginatedStoreOrdersSchema = z.object({
  items: z.array(storeOrderSchema),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const paginatedStoreProductsSchema = z.object({
  items: z.array(storeProductSchema),
  page: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const storeHomeResponseSchema = z.object({
  settings: storeSettingsSchema,
  categories: z.array(storeCategorySchema),
  banners: z.array(storeBannerSchema),
  sliders: z.array(storeSliderSchema),
});

export const storeCategoryPageResponseSchema = z.object({
  category: storeCategorySchema,
  subcategories: z.array(storeCategorySchema),
  products: z.array(storeProductSchema),
  banners: z.array(storeBannerSchema),
  sliders: z.array(storeSliderSchema),
});

export const updateStoreSettingsSchema = z.object({
  announcementHeader: z.string(),
  serviceTitle: z.string(),
  serviceDescription: z.string(),
  deliveryFee: z.number().nonnegative(),
  deliveryDurationText: z.string(),
  cashOnDeliveryEnabled: z.boolean(),
  onlinePaymentEnabled: z.boolean(),
});

export const upsertStoreCategorySchema = z.object({
  nameAr: z.string(),
  nameEn: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  parentCategoryId: z.number().nullable().optional(),
  displayOrder: z.number(),
  isActive: z.boolean(),
});

export const upsertStoreProductSchema = z.object({
  categoryId: z.number(),
  nameAr: z.string(),
  nameEn: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  saleUnit: z.string(),
  price: z.number().nonnegative(),
  discountPrice: z.number().nonnegative(),
  topBadge: z.string(),
  displayOrder: z.number(),
  isRecommended: z.boolean(),
  isBestSeller: z.boolean(),
  isActive: z.boolean(),
});

export const upsertStoreBannerSchema = z.object({
  title: z.string(),
  imageUrl: z.string(),
  linkUrl: z.string(),
  location: z.string(),
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export const upsertStoreSliderSchema = z.object({
  title: z.string(),
  type: z.string(),
  displayOrder: z.number(),
  isActive: z.boolean(),
  productIds: z.array(z.number()),
});

export const upsertStoreCouponSchema = z.object({
  code: z.string(),
  discountType: z.string(),
  amount: z.number().nonnegative(),
  minimumSubtotal: z.number().nonnegative(),
  maximumDiscountAmount: z.number().nonnegative(),
  startsAt: z.string(),
  expiresAt: z.string(),
  isActive: z.boolean(),
});

export const createStoreCategorySchema = upsertStoreCategorySchema;
export const createStoreProductSchema = upsertStoreProductSchema;
export const createStoreBannerSchema = upsertStoreBannerSchema;
export const createStoreSliderSchema = upsertStoreSliderSchema;
export const createStoreCouponSchema = upsertStoreCouponSchema;

export const updateStoreOrderStatusSchema = z.object({
  status: storeOrderStatusSchema,
});

export const placeStoreOrderSchema = z.object({
  paymentMethod: storePaymentMethodSchema,
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().int().positive(),
    }),
  ),
});

export const updateStoreCartSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive(),
});

export const updateStoreCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

export const applyStoreCouponSchema = z.object({
  code: z.string(),
});

export type StoreSettings = z.infer<typeof storeSettingsSchema>;
export type StoreCategory = z.infer<typeof storeCategorySchema>;
export type StoreProduct = z.infer<typeof storeProductSchema>;
export type StoreBanner = z.infer<typeof storeBannerSchema>;
export type StoreSlider = z.infer<typeof storeSliderSchema>;
export type StoreCoupon = z.infer<typeof storeCouponSchema>;
export type StoreOrderItem = z.infer<typeof storeOrderItemSchema>;
export type StoreOrderStatus = z.infer<typeof storeOrderStatusSchema>;
export type StoreOrder = z.infer<typeof storeOrderSchema>;
export type PaginatedStoreOrders = z.infer<typeof paginatedStoreOrdersSchema>;
export type PaginatedStoreProducts = z.infer<typeof paginatedStoreProductsSchema>;
export type StoreHomeResponse = z.infer<typeof storeHomeResponseSchema>;
export type StoreCategoryPageResponse = z.infer<typeof storeCategoryPageResponseSchema>;
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
export type UpsertStoreCategoryInput = z.infer<typeof upsertStoreCategorySchema>;
export type UpsertStoreProductInput = z.infer<typeof upsertStoreProductSchema>;
export type UpsertStoreBannerInput = z.infer<typeof upsertStoreBannerSchema>;
export type UpsertStoreSliderInput = z.infer<typeof upsertStoreSliderSchema>;
export type UpsertStoreCouponInput = z.infer<typeof upsertStoreCouponSchema>;
export type UpdateStoreOrderStatusInput = z.infer<typeof updateStoreOrderStatusSchema>;
export type PlaceStoreOrderInput = z.infer<typeof placeStoreOrderSchema>;
