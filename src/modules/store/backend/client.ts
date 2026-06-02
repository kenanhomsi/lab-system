import { injectable, injectFromBase } from "inversify";
import { BackendState } from "@/modules/axios";
import { isUpstreamBackendReady } from "@/lib/api/upstream-config";
import {
  mockStoreCreateBanner,
  mockStoreCreateCategory,
  mockStoreCreateCoupon,
  mockStoreCreateProduct,
  mockStoreCreateSlider,
  mockStoreDeleteCategory,
  mockStoreDeleteProduct,
  mockStoreGetCategory,
  mockStoreGetCategoryPage,
  mockStoreGetHome,
  mockStoreGetMyOrder,
  mockStoreGetOrder,
  mockStoreGetProduct,
  mockStoreGetSettings,
  mockStoreListBanners,
  mockStoreListCategories,
  mockStoreListCoupons,
  mockStoreListMyOrders,
  mockStoreListOrders,
  mockStoreListProducts,
  mockStoreListSliders,
  mockStorePlaceOrder,
  mockStoreUpdateBanner,
  mockStoreUpdateCategory,
  mockStoreUpdateCoupon,
  mockStoreUpdateOrderStatus,
  mockStoreUpdateProduct,
  mockStoreUpdateSettings,
  mockStoreUpdateSlider,
} from "@/lib/api/store-mock-store";
import { StoreClient } from "../abstraction";
import type {
  PaginatedStoreOrders,
  PaginatedStoreProducts,
  StoreBanner,
  StoreCategory,
  StoreCategoryPageResponse,
  StoreCoupon,
  StoreHomeResponse,
  StoreOrder,
  StoreProduct,
  StoreSettings,
  StoreSlider,
} from "../abstraction/schemas";
import { endpoint } from "./endpoint";
import type {
  CreateStoreBannerParams,
  CreateStoreCategoryParams,
  CreateStoreCouponParams,
  CreateStoreProductParams,
  CreateStoreSliderParams,
  GetStoreByIdParams,
  GetStoreCategoryPageParams,
  ListStoreMyOrdersParams,
  ListStoreOrdersParams,
  ListStoreProductsParams,
  PlaceStoreOrderParams,
  UpdateStoreBannerParams,
  UpdateStoreCategoryParams,
  UpdateStoreCouponParams,
  UpdateStoreOrderStatusParams,
  UpdateStoreProductParams,
  UpdateStoreSettingsParams,
  UpdateStoreSliderParams,
} from "./types";

const appendQueryParams = (path: string, query?: Record<string, string | undefined>) => {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

function unwrapData<T>(payload: unknown): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data: unknown }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends StoreClient<BackendState> {
  async getHome(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetHome();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.home })
      .withAuth(params.token)
      .perform<StoreHomeResponse>();
    return unwrapData<StoreHomeResponse>(res.data);
  }

  async getCategoryPage(params: GetStoreCategoryPageParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetCategoryPage(params.id);
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.categoryPage(params.id) })
      .withAuth(params.token)
      .perform<StoreCategoryPageResponse>();
    return unwrapData<StoreCategoryPageResponse>(res.data);
  }

  async getSettings(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetSettings();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.settings })
      .withAuth(params.token)
      .perform<StoreSettings>();
    return unwrapData<StoreSettings>(res.data);
  }

  async updateSettings(params: UpdateStoreSettingsParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateSettings(body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.settings, body })
      .withAuth(token)
      .perform<StoreSettings>();
    return unwrapData<StoreSettings>(res.data);
  }

  async listCategories(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListCategories();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.categories })
      .withAuth(params.token)
      .perform<StoreCategory[]>();
    return unwrapData<StoreCategory[]>(res.data);
  }

  async createCategory(params: CreateStoreCategoryParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreCreateCategory(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.categories, body })
      .withAuth(token)
      .perform<StoreCategory>();
    return unwrapData<StoreCategory>(res.data);
  }

  async getCategory(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetCategory(params.id);
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.categoryById(params.id) })
      .withAuth(params.token)
      .perform<StoreCategory>();
    return unwrapData<StoreCategory>(res.data);
  }

  async updateCategory(params: UpdateStoreCategoryParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateCategory(id, body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.categoryById(id), body })
      .withAuth(token)
      .perform<StoreCategory>();
    return unwrapData<StoreCategory>(res.data);
  }

  async deleteCategory(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      mockStoreDeleteCategory(params.id);
      return;
    }
    await super
      .sharedDelete({ endpoint: endpoint.categoryById(params.id) })
      .withAuth(params.token)
      .perform();
  }

  async listProducts(params: ListStoreProductsParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListProducts(params.query);
    }
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.products, params.query) })
      .withAuth(params.token)
      .perform<PaginatedStoreProducts>();
    return unwrapData<PaginatedStoreProducts>(res.data);
  }

  async createProduct(params: CreateStoreProductParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreCreateProduct(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.products, body })
      .withAuth(token)
      .perform<StoreProduct>();
    return unwrapData<StoreProduct>(res.data);
  }

  async getProduct(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetProduct(params.id);
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.productById(params.id) })
      .withAuth(params.token)
      .perform<StoreProduct>();
    return unwrapData<StoreProduct>(res.data);
  }

  async updateProduct(params: UpdateStoreProductParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateProduct(id, body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.productById(id), body })
      .withAuth(token)
      .perform<StoreProduct>();
    return unwrapData<StoreProduct>(res.data);
  }

  async deleteProduct(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      mockStoreDeleteProduct(params.id);
      return;
    }
    await super
      .sharedDelete({ endpoint: endpoint.productById(params.id) })
      .withAuth(params.token)
      .perform();
  }

  async listSliders(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListSliders();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.sliders })
      .withAuth(params.token)
      .perform<StoreSlider[]>();
    return unwrapData<StoreSlider[]>(res.data);
  }

  async createSlider(params: CreateStoreSliderParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreCreateSlider(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.sliders, body })
      .withAuth(token)
      .perform<StoreSlider>();
    return unwrapData<StoreSlider>(res.data);
  }

  async updateSlider(params: UpdateStoreSliderParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateSlider(id, body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.sliderById(id), body })
      .withAuth(token)
      .perform<StoreSlider>();
    return unwrapData<StoreSlider>(res.data);
  }

  async listBanners(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListBanners();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.banners })
      .withAuth(params.token)
      .perform<StoreBanner[]>();
    return unwrapData<StoreBanner[]>(res.data);
  }

  async createBanner(params: CreateStoreBannerParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreCreateBanner(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.banners, body })
      .withAuth(token)
      .perform<StoreBanner>();
    return unwrapData<StoreBanner>(res.data);
  }

  async updateBanner(params: UpdateStoreBannerParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateBanner(id, body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.bannerById(id), body })
      .withAuth(token)
      .perform<StoreBanner>();
    return unwrapData<StoreBanner>(res.data);
  }

  async listCoupons(params: { token: string }) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListCoupons();
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.coupons })
      .withAuth(params.token)
      .perform<StoreCoupon[]>();
    return unwrapData<StoreCoupon[]>(res.data);
  }

  async createCoupon(params: CreateStoreCouponParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreCreateCoupon(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.coupons, body })
      .withAuth(token)
      .perform<StoreCoupon>();
    return unwrapData<StoreCoupon>(res.data);
  }

  async updateCoupon(params: UpdateStoreCouponParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateCoupon(id, body);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.couponById(id), body })
      .withAuth(token)
      .perform<StoreCoupon>();
    return unwrapData<StoreCoupon>(res.data);
  }

  async listOrders(params: ListStoreOrdersParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListOrders(params.query);
    }
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.orders, params.query) })
      .withAuth(params.token)
      .perform<PaginatedStoreOrders>();
    return unwrapData<PaginatedStoreOrders>(res.data);
  }

  async updateOrderStatus(params: UpdateStoreOrderStatusParams) {
    const { token, id, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStoreUpdateOrderStatus(id, body.status);
    }
    const res = await super
      .sharedPut({ endpoint: endpoint.orderStatusById(id), body })
      .withAuth(token)
      .perform<StoreOrder>();
    return unwrapData<StoreOrder>(res.data);
  }

  async listMyOrders(params: ListStoreMyOrdersParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreListMyOrders(params.query);
    }
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.myOrders, params.query) })
      .withAuth(params.token)
      .perform<PaginatedStoreOrders>();
    return unwrapData<PaginatedStoreOrders>(res.data);
  }

  async getMyOrder(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetMyOrder(params.id);
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.myOrderById(params.id) })
      .withAuth(params.token)
      .perform<StoreOrder>();
    return unwrapData<StoreOrder>(res.data);
  }

  async getOrder(params: GetStoreByIdParams) {
    if (!isUpstreamBackendReady()) {
      return mockStoreGetOrder(params.id);
    }
    const res = await super
      .sharedGet({ endpoint: endpoint.orderById(params.id) })
      .withAuth(params.token)
      .perform<StoreOrder>();
    return unwrapData<StoreOrder>(res.data);
  }

  async placeOrder(params: PlaceStoreOrderParams) {
    const { token, ...body } = params;
    if (!isUpstreamBackendReady()) {
      return mockStorePlaceOrder(body);
    }
    const res = await super
      .sharedPost({ endpoint: endpoint.orders, body })
      .withAuth(token)
      .perform<StoreOrder>();
    return unwrapData<StoreOrder>(res.data);
  }
}

export { Client as StoreBackendClient };
