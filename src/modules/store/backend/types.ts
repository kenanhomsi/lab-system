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

export type WithToken = { token: string };
export type StoreQuery = Record<string, string | undefined>;

export type GetStoreCategoryPageParams = WithToken & { id: number };
export type GetStoreByIdParams = WithToken & { id: number };
export type UpdateStoreByIdParams<T> = WithToken & { id: number } & T;

export type ListStoreProductsParams = WithToken & { query: StoreQuery };
export type ListStoreOrdersParams = WithToken & { query: StoreQuery };
export type ListStoreMyOrdersParams = WithToken & { query: StoreQuery };

export type UpdateStoreSettingsParams = WithToken & UpdateStoreSettingsInput;
export type CreateStoreCategoryParams = WithToken & UpsertStoreCategoryInput;
export type UpdateStoreCategoryParams = UpdateStoreByIdParams<UpsertStoreCategoryInput>;
export type CreateStoreProductParams = WithToken & UpsertStoreProductInput;
export type UpdateStoreProductParams = UpdateStoreByIdParams<UpsertStoreProductInput>;
export type CreateStoreBannerParams = WithToken & UpsertStoreBannerInput;
export type UpdateStoreBannerParams = UpdateStoreByIdParams<UpsertStoreBannerInput>;
export type CreateStoreSliderParams = WithToken & UpsertStoreSliderInput;
export type UpdateStoreSliderParams = UpdateStoreByIdParams<UpsertStoreSliderInput>;
export type CreateStoreCouponParams = WithToken & UpsertStoreCouponInput;
export type UpdateStoreCouponParams = UpdateStoreByIdParams<UpsertStoreCouponInput>;
export type UpdateStoreOrderStatusParams = UpdateStoreByIdParams<UpdateStoreOrderStatusInput>;
export type PlaceStoreOrderParams = WithToken & PlaceStoreOrderInput;
