export interface StoreCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  parentId?: string;
  children?: StoreCategory[];
}

export interface StoreProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  unit: string;
  price: number;
  discountedPrice?: number;
  categoryId: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  product: StoreProduct;
  quantity: number;
}

export interface StoreOrder {
  id: string;
  labId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
  paymentMethod: "cash_on_delivery";
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}
