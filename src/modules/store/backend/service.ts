import { inject, injectable } from "inversify";
import { storeModuleNames } from "../names";
import { StoreBackendClient } from "./client";
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

@injectable()
class Service {
  @inject(storeModuleNames.client)
  private Client: StoreBackendClient;

  getHome(params: { token: string }) {
    return this.Client.getHome(params);
  }

  getCategoryPage(params: GetStoreCategoryPageParams) {
    return this.Client.getCategoryPage(params);
  }

  getSettings(params: { token: string }) {
    return this.Client.getSettings(params);
  }

  updateSettings(params: UpdateStoreSettingsParams) {
    return this.Client.updateSettings(params);
  }

  listCategories(params: { token: string }) {
    return this.Client.listCategories(params);
  }

  createCategory(params: CreateStoreCategoryParams) {
    return this.Client.createCategory(params);
  }

  getCategory(params: GetStoreByIdParams) {
    return this.Client.getCategory(params);
  }

  updateCategory(params: UpdateStoreCategoryParams) {
    return this.Client.updateCategory(params);
  }

  deleteCategory(params: GetStoreByIdParams) {
    return this.Client.deleteCategory(params);
  }

  listProducts(params: ListStoreProductsParams) {
    return this.Client.listProducts(params);
  }

  createProduct(params: CreateStoreProductParams) {
    return this.Client.createProduct(params);
  }

  getProduct(params: GetStoreByIdParams) {
    return this.Client.getProduct(params);
  }

  updateProduct(params: UpdateStoreProductParams) {
    return this.Client.updateProduct(params);
  }

  deleteProduct(params: GetStoreByIdParams) {
    return this.Client.deleteProduct(params);
  }

  listSliders(params: { token: string }) {
    return this.Client.listSliders(params);
  }

  createSlider(params: CreateStoreSliderParams) {
    return this.Client.createSlider(params);
  }

  updateSlider(params: UpdateStoreSliderParams) {
    return this.Client.updateSlider(params);
  }

  listBanners(params: { token: string }) {
    return this.Client.listBanners(params);
  }

  createBanner(params: CreateStoreBannerParams) {
    return this.Client.createBanner(params);
  }

  updateBanner(params: UpdateStoreBannerParams) {
    return this.Client.updateBanner(params);
  }

  listCoupons(params: { token: string }) {
    return this.Client.listCoupons(params);
  }

  createCoupon(params: CreateStoreCouponParams) {
    return this.Client.createCoupon(params);
  }

  updateCoupon(params: UpdateStoreCouponParams) {
    return this.Client.updateCoupon(params);
  }

  listOrders(params: ListStoreOrdersParams) {
    return this.Client.listOrders(params);
  }

  updateOrderStatus(params: UpdateStoreOrderStatusParams) {
    return this.Client.updateOrderStatus(params);
  }

  listMyOrders(params: ListStoreMyOrdersParams) {
    return this.Client.listMyOrders(params);
  }

  getMyOrder(params: GetStoreByIdParams) {
    return this.Client.getMyOrder(params);
  }

  getOrder(params: GetStoreByIdParams) {
    return this.Client.getOrder(params);
  }

  placeOrder(params: PlaceStoreOrderParams) {
    return this.Client.placeOrder(params);
  }
}

export { Service as StoreBackendService };
