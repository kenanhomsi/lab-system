const base = "/api/store";

const endpoint = {
  home: `${base}/home`,
  categoryPage: (id: number) => `${base}/category/${id}/page`,
  settings: `${base}/settings`,
  categories: `${base}/categories`,
  categoryById: (id: number) => `${base}/categories/${id}`,
  products: `${base}/products`,
  productById: (id: number) => `${base}/products/${id}`,
  sliders: `${base}/sliders`,
  sliderById: (id: number) => `${base}/sliders/${id}`,
  banners: `${base}/banners`,
  bannerById: (id: number) => `${base}/banners/${id}`,
  coupons: `${base}/coupons`,
  couponById: (id: number) => `${base}/coupons/${id}`,
  cart: `${base}/cart`,
  cartItems: `${base}/cart/items`,
  cartItemById: (id: number) => `${base}/cart/items/${id}`,
  cartApplyCoupon: `${base}/cart/apply-coupon`,
  cartCoupon: `${base}/cart/coupon`,
  checkout: `${base}/checkout`,
  orders: `${base}/orders`,
  orderById: (id: number) => `${base}/orders/${id}`,
  orderStatusById: (id: number) => `${base}/orders/${id}/status`,
  myOrders: `${base}/orders/my`,
  myOrderById: (id: number) => `${base}/orders/my/${id}`,
};

export { endpoint };
