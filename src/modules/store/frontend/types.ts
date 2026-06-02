import type {
  PlaceStoreOrderInput,
  UpdateStoreOrderStatusInput,
  UpdateStoreSettingsInput,
  UpsertStoreBannerInput,
  UpsertStoreCategoryInput,
  UpsertStoreCouponInput,
  UpsertStoreProductInput,
  UpsertStoreSliderInput,
} from "../abstraction/schemas";

export type StoreQuery = Record<string, string | number | boolean | undefined>;

export type UpdateStoreByIdParams<T> = { id: number } & T;

export type GetStoreCategoryPageParams = { id: number };
export type GetStoreByIdParams = { id: number };
export type ListStoreProductsParams = { query?: StoreQuery };
export type ListStoreOrdersParams = { query?: StoreQuery };
export type ListStoreMyOrdersParams = { query?: StoreQuery };

export type UpdateStoreSettingsParams = UpdateStoreSettingsInput;
export type CreateStoreCategoryParams = UpsertStoreCategoryInput;
export type UpdateStoreCategoryParams = UpdateStoreByIdParams<UpsertStoreCategoryInput>;
export type CreateStoreProductParams = UpsertStoreProductInput;
export type UpdateStoreProductParams = UpdateStoreByIdParams<UpsertStoreProductInput>;
export type CreateStoreBannerParams = UpsertStoreBannerInput;
export type UpdateStoreBannerParams = UpdateStoreByIdParams<UpsertStoreBannerInput>;
export type CreateStoreSliderParams = UpsertStoreSliderInput;
export type UpdateStoreSliderParams = UpdateStoreByIdParams<UpsertStoreSliderInput>;
export type CreateStoreCouponParams = UpsertStoreCouponInput;
export type UpdateStoreCouponParams = UpdateStoreByIdParams<UpsertStoreCouponInput>;
export type UpdateStoreOrderStatusParams = UpdateStoreByIdParams<UpdateStoreOrderStatusInput>;
export type PlaceStoreOrderParams = PlaceStoreOrderInput;
