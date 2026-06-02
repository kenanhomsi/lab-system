import { injectable, injectFromBase } from "inversify";
import { AxiosState } from "@/modules/axios";
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

const appendQueryParams = (
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string => {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
};

@injectable()
@injectFromBase({ extendProperties: true })
class Client extends StoreClient<AxiosState> {
  async getHome() {
    const res = await super.sharedGet({ endpoint: endpoint.home }).perform<StoreHomeResponse>();
    return res.data;
  }

  async getCategoryPage(params: GetStoreCategoryPageParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.categoryPage(params.id) })
      .perform<StoreCategoryPageResponse>();
    return res.data;
  }

  async getSettings() {
    const res = await super.sharedGet({ endpoint: endpoint.settings }).perform<StoreSettings>();
    return res.data;
  }

  async updateSettings(body: UpdateStoreSettingsParams) {
    const res = await super
      .sharedPut({ endpoint: endpoint.settings, body })
      .perform<StoreSettings>();
    return res.data;
  }

  async listCategories() {
    const res = await super.sharedGet({ endpoint: endpoint.categories }).perform<StoreCategory[]>();
    return res.data;
  }

  async createCategory(body: CreateStoreCategoryParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.categories, body })
      .perform<StoreCategory>();
    return res.data;
  }

  async getCategory(params: GetStoreByIdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.categoryById(params.id) })
      .perform<StoreCategory>();
    return res.data;
  }

  async updateCategory(params: UpdateStoreCategoryParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.categoryById(id), body })
      .perform<StoreCategory>();
    return res.data;
  }

  async deleteCategory(id: number) {
    await super.sharedDelete({ endpoint: endpoint.categoryById(id) }).perform();
  }

  async listProducts(params?: ListStoreProductsParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.products, params?.query) })
      .perform<PaginatedStoreProducts>();
    return res.data;
  }

  async createProduct(body: CreateStoreProductParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.products, body })
      .perform<StoreProduct>();
    return res.data;
  }

  async getProduct(params: GetStoreByIdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.productById(params.id) })
      .perform<StoreProduct>();
    return res.data;
  }

  async updateProduct(params: UpdateStoreProductParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.productById(id), body })
      .perform<StoreProduct>();
    return res.data;
  }

  async deleteProduct(id: number) {
    await super.sharedDelete({ endpoint: endpoint.productById(id) }).perform();
  }

  async listSliders() {
    const res = await super.sharedGet({ endpoint: endpoint.sliders }).perform<StoreSlider[]>();
    return res.data;
  }

  async createSlider(body: CreateStoreSliderParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.sliders, body })
      .perform<StoreSlider>();
    return res.data;
  }

  async updateSlider(params: UpdateStoreSliderParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.sliderById(id), body })
      .perform<StoreSlider>();
    return res.data;
  }

  async listBanners() {
    const res = await super.sharedGet({ endpoint: endpoint.banners }).perform<StoreBanner[]>();
    return res.data;
  }

  async createBanner(body: CreateStoreBannerParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.banners, body })
      .perform<StoreBanner>();
    return res.data;
  }

  async updateBanner(params: UpdateStoreBannerParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.bannerById(id), body })
      .perform<StoreBanner>();
    return res.data;
  }

  async listCoupons() {
    const res = await super.sharedGet({ endpoint: endpoint.coupons }).perform<StoreCoupon[]>();
    return res.data;
  }

  async createCoupon(body: CreateStoreCouponParams) {
    const res = await super
      .sharedPost({ endpoint: endpoint.coupons, body })
      .perform<StoreCoupon>();
    return res.data;
  }

  async updateCoupon(params: UpdateStoreCouponParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.couponById(id), body })
      .perform<StoreCoupon>();
    return res.data;
  }

  async listOrders(params?: ListStoreOrdersParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.orders, params?.query) })
      .perform<PaginatedStoreOrders>();
    return res.data;
  }

  async updateOrderStatus(params: UpdateStoreOrderStatusParams) {
    const { id, ...body } = params;
    const res = await super
      .sharedPut({ endpoint: endpoint.orderStatusById(id), body })
      .perform<StoreOrder>();
    return res.data;
  }

  async listMyOrders(params?: ListStoreMyOrdersParams) {
    const res = await super
      .sharedGet({ endpoint: appendQueryParams(endpoint.myOrders, params?.query) })
      .perform<PaginatedStoreOrders>();
    return res.data;
  }

  async getMyOrder(params: GetStoreByIdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.myOrderById(params.id) })
      .perform<StoreOrder>();
    return res.data;
  }

  async getOrder(params: GetStoreByIdParams) {
    const res = await super
      .sharedGet({ endpoint: endpoint.orderById(params.id) })
      .perform<StoreOrder>();
    return res.data;
  }

  async placeOrder(body: PlaceStoreOrderParams) {
    const res = await super.sharedPost({ endpoint: endpoint.orders, body }).perform<StoreOrder>();
    return res.data;
  }
}

export { Client as StoreFrontendClient };
