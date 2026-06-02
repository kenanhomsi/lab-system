import { inject, injectable } from "inversify";
import { storeModuleNames } from "../names";
import { StoreFrontendClient } from "./client";
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
  private Client: StoreFrontendClient;

  getHome() {
    return this.Client.getHome();
  }

  getCategoryPage(params: GetStoreCategoryPageParams) {
    return this.Client.getCategoryPage(params);
  }

  getSettings() {
    return this.Client.getSettings();
  }

  updateSettings(body: UpdateStoreSettingsParams) {
    return this.Client.updateSettings(body);
  }

  listCategories() {
    return this.Client.listCategories();
  }

  createCategory(body: CreateStoreCategoryParams) {
    return this.Client.createCategory(body);
  }

  getCategory(params: GetStoreByIdParams) {
    return this.Client.getCategory(params);
  }

  updateCategory(params: UpdateStoreCategoryParams) {
    return this.Client.updateCategory(params);
  }

  deleteCategory(id: number) {
    return this.Client.deleteCategory(id);
  }

  listProducts(params?: ListStoreProductsParams) {
    return this.Client.listProducts(params);
  }

  createProduct(body: CreateStoreProductParams) {
    return this.Client.createProduct(body);
  }

  getProduct(params: GetStoreByIdParams) {
    return this.Client.getProduct(params);
  }

  updateProduct(params: UpdateStoreProductParams) {
    return this.Client.updateProduct(params);
  }

  deleteProduct(id: number) {
    return this.Client.deleteProduct(id);
  }

  listSliders() {
    return this.Client.listSliders();
  }

  createSlider(body: CreateStoreSliderParams) {
    return this.Client.createSlider(body);
  }

  updateSlider(params: UpdateStoreSliderParams) {
    return this.Client.updateSlider(params);
  }

  listBanners() {
    return this.Client.listBanners();
  }

  createBanner(body: CreateStoreBannerParams) {
    return this.Client.createBanner(body);
  }

  updateBanner(params: UpdateStoreBannerParams) {
    return this.Client.updateBanner(params);
  }

  listCoupons() {
    return this.Client.listCoupons();
  }

  createCoupon(body: CreateStoreCouponParams) {
    return this.Client.createCoupon(body);
  }

  updateCoupon(params: UpdateStoreCouponParams) {
    return this.Client.updateCoupon(params);
  }

  listOrders(params?: ListStoreOrdersParams) {
    return this.Client.listOrders(params);
  }

  updateOrderStatus(params: UpdateStoreOrderStatusParams) {
    return this.Client.updateOrderStatus(params);
  }

  listMyOrders(params?: ListStoreMyOrdersParams) {
    return this.Client.listMyOrders(params);
  }

  getMyOrder(params: GetStoreByIdParams) {
    return this.Client.getMyOrder(params);
  }

  getOrder(params: GetStoreByIdParams) {
    return this.Client.getOrder(params);
  }

  placeOrder(body: PlaceStoreOrderParams) {
    return this.Client.placeOrder(body);
  }
}

export { Service as StoreFrontendService };
