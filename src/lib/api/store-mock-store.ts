import type {
  PaginatedStoreOrders,
  PaginatedStoreProducts,
  PlaceStoreOrderInput,
  StoreBanner,
  StoreCategory,
  StoreCategoryPageResponse,
  StoreCoupon,
  StoreHomeResponse,
  StoreOrder,
  StoreOrderStatus,
  StoreProduct,
  StoreSettings,
  StoreSlider,
  UpdateStoreSettingsInput,
  UpsertStoreBannerInput,
  UpsertStoreCategoryInput,
  UpsertStoreCouponInput,
  UpsertStoreProductInput,
  UpsertStoreSliderInput,
} from "@/modules/store";

let sequence = 1000;
const nextId = () => ++sequence;

let settings: StoreSettings = {
  id: 1,
  announcementHeader: "Welcome to the lab supplies store",
  serviceTitle: "Lab Supplies",
  serviceDescription: "Order consumables and track deliveries.",
  deliveryFee: 1500,
  deliveryDurationText: "24-48h",
  cashOnDeliveryEnabled: true,
  onlinePaymentEnabled: false,
};

let categories: StoreCategory[] = [
  {
    id: 1,
    nameAr: "مستهلكات",
    nameEn: "Consumables",
    description: "Everyday consumables",
    imageUrl: "",
    parentCategoryId: null,
    displayOrder: 1,
    isActive: true,
    subcategories: [],
  },
];

let products: StoreProduct[] = [
  {
    id: 1,
    categoryId: 1,
    categoryNameAr: "مستهلكات",
    categoryNameEn: "Consumables",
    nameAr: "أنابيب سحب",
    nameEn: "Collection Tubes",
    description: "100 pieces",
    imageUrl: "",
    saleUnit: "Box",
    price: 5000,
    discountPrice: 4500,
    savedAmount: 500,
    topBadge: "Best Seller",
    displayOrder: 1,
    isRecommended: true,
    isBestSeller: true,
    isActive: true,
  },
];

let banners: StoreBanner[] = [];
let sliders: StoreSlider[] = [];
let coupons: StoreCoupon[] = [];
let orders: StoreOrder[] = [];

const paginate = <T,>(items: T[], page = 1, pageSize = 20) => {
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    items: slice,
    page: currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};

export const mockStoreGetHome = (): StoreHomeResponse => ({
  settings,
  categories,
  banners,
  sliders,
});

export const mockStoreGetCategoryPage = (id: number): StoreCategoryPageResponse => {
  const category = categories.find((item) => item.id === id) ?? categories[0];
  const subcategories = categories.filter((item) => item.parentCategoryId === id);
  return {
    category,
    subcategories,
    products: products.filter((item) => item.categoryId === id),
    banners: banners.filter((item) => item.categoryId === id || item.categoryId === 0),
    sliders,
  };
};

export const mockStoreGetSettings = () => settings;
export const mockStoreUpdateSettings = (body: UpdateStoreSettingsInput) => {
  settings = { ...settings, ...body };
  return settings;
};

export const mockStoreListCategories = () => categories;
export const mockStoreCreateCategory = (body: UpsertStoreCategoryInput) => {
  const item: StoreCategory = { id: nextId(), subcategories: [], ...body, parentCategoryId: body.parentCategoryId ?? null };
  categories = [item, ...categories];
  return item;
};
export const mockStoreGetCategory = (id: number) => categories.find((item) => item.id === id) ?? categories[0];
export const mockStoreUpdateCategory = (id: number, body: UpsertStoreCategoryInput) => {
  const updated = { ...mockStoreGetCategory(id), ...body, id };
  categories = categories.map((item) => (item.id === id ? updated : item));
  return updated;
};
export const mockStoreDeleteCategory = (id: number) => {
  categories = categories.filter((item) => item.id !== id);
};

export const mockStoreListProducts = (query: Record<string, string | undefined>): PaginatedStoreProducts => {
  const page = Number(query.page ?? query.Page ?? "1");
  const pageSize = Number(query.pageSize ?? query.PageSize ?? "20");
  const search = (query.search ?? query.Search ?? "").toLowerCase();
  const categoryId = Number(query.categoryId ?? query.categoryid ?? "0");

  let items = [...products];
  if (search) {
    items = items.filter((item) => item.nameEn.toLowerCase().includes(search) || item.nameAr.includes(search));
  }
  if (Number.isFinite(categoryId) && categoryId > 0) {
    items = items.filter((item) => item.categoryId === categoryId);
  }
  return paginate(items, page, pageSize);
};

export const mockStoreCreateProduct = (body: UpsertStoreProductInput) => {
  const savedAmount = Math.max(0, body.price - body.discountPrice);
  const item: StoreProduct = { id: nextId(), savedAmount, ...body };
  products = [item, ...products];
  return item;
};
export const mockStoreGetProduct = (id: number) => products.find((item) => item.id === id) ?? products[0];
export const mockStoreUpdateProduct = (id: number, body: UpsertStoreProductInput) => {
  const updated = { ...mockStoreGetProduct(id), ...body, id, savedAmount: Math.max(0, body.price - body.discountPrice) };
  products = products.map((item) => (item.id === id ? updated : item));
  return updated;
};
export const mockStoreDeleteProduct = (id: number) => {
  products = products.filter((item) => item.id !== id);
};

export const mockStoreListBanners = () => banners;
export const mockStoreCreateBanner = (body: UpsertStoreBannerInput) => {
  const item: StoreBanner = { id: nextId(), ...body };
  banners = [item, ...banners];
  return item;
};
export const mockStoreUpdateBanner = (id: number, body: UpsertStoreBannerInput) => {
  const prev = banners.find((item) => item.id === id) ?? { id, ...body };
  const updated: StoreBanner = { ...prev, ...body, id };
  banners = banners.map((item) => (item.id === id ? updated : item));
  return updated;
};

export const mockStoreListSliders = () => sliders;
export const mockStoreCreateSlider = (body: UpsertStoreSliderInput) => {
  const item: StoreSlider = {
    id: nextId(),
    title: body.title,
    type: body.type,
    displayOrder: body.displayOrder,
    products: products.filter((product) => body.productIds.includes(product.id)),
  };
  sliders = [item, ...sliders];
  return item;
};
export const mockStoreUpdateSlider = (id: number, body: UpsertStoreSliderInput) => {
  const updated: StoreSlider = {
    id,
    title: body.title,
    type: body.type,
    displayOrder: body.displayOrder,
    products: products.filter((product) => body.productIds.includes(product.id)),
  };
  sliders = sliders.map((item) => (item.id === id ? updated : item));
  return updated;
};

export const mockStoreListCoupons = () => coupons;
export const mockStoreCreateCoupon = (body: UpsertStoreCouponInput) => {
  const item: StoreCoupon = { id: nextId(), ...body };
  coupons = [item, ...coupons];
  return item;
};
export const mockStoreUpdateCoupon = (id: number, body: UpsertStoreCouponInput) => {
  const updated: StoreCoupon = { id, ...body };
  coupons = coupons.map((item) => (item.id === id ? updated : item));
  return updated;
};

export const mockStoreListOrders = (query: Record<string, string | undefined>): PaginatedStoreOrders => {
  const page = Number(query.page ?? query.Page ?? "1");
  const pageSize = Number(query.pageSize ?? query.PageSize ?? "20");
  return paginate(orders, page, pageSize);
};

export const mockStoreListMyOrders = (query: Record<string, string | undefined>): PaginatedStoreOrders =>
  mockStoreListOrders(query);

export const mockStoreGetOrder = (id: number) => orders.find((item) => item.id === id) ?? orders[0];
export const mockStoreGetMyOrder = (id: number) => mockStoreGetOrder(id);

export const mockStoreUpdateOrderStatus = (id: number, status: StoreOrderStatus) => {
  const existing = mockStoreGetOrder(id);
  const updated = { ...existing, id, status };
  orders = orders.map((item) => (item.id === id ? updated : item));
  return updated;
};

export const mockStorePlaceOrder = (input: PlaceStoreOrderInput): StoreOrder => {
  const itemSnapshots = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    const unitPrice = product?.price ?? 0;
    const discountPrice = product?.discountPrice ?? 0;
    const effectiveUnitPrice = discountPrice > 0 && discountPrice < unitPrice ? discountPrice : unitPrice;
    return {
      id: nextId(),
      productId: item.productId,
      productNameSnapshot: product?.nameEn ?? "",
      saleUnitSnapshot: product?.saleUnit ?? "",
      imageSnapshot: product?.imageUrl ?? "",
      unitPriceSnapshot: unitPrice,
      discountPriceSnapshot: discountPrice,
      effectiveUnitPrice,
      quantity: item.quantity,
      lineTotal: effectiveUnitPrice * item.quantity,
    };
  });
  const subtotal = itemSnapshots.reduce((sum, item) => sum + item.lineTotal, 0);
  const order: StoreOrder = {
    id: nextId(),
    orderNumber: `SO-${Date.now()}`,
    labClientId: "mock-lab",
    status: "Pending",
    paymentMethod: input.paymentMethod,
    paymentStatus: "Pending",
    subtotal,
    discountAmount: 0,
    deliveryFee: settings.deliveryFee,
    total: subtotal + settings.deliveryFee,
    couponCodeSnapshot: input.couponCode,
    deliveryDurationSnapshot: settings.deliveryDurationText,
    notes: input.notes,
    orderedAt: new Date().toISOString(),
    items: itemSnapshots,
  };
  orders = [order, ...orders];
  return order;
};
