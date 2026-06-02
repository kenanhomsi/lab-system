"use client";

import { create } from "zustand";
import type { PlaceStoreOrderInput, StoreProduct } from "@/modules/store";

export type StoreCartItem = {
  productId: number;
  nameAr: string;
  nameEn: string;
  imageUrl: string;
  price: number;
  discountPrice: number;
  quantity: number;
};

type StoreCartState = {
  couponCode: string;
  notes: string;
  items: StoreCartItem[];
  setCouponCode: (couponCode: string) => void;
  setNotes: (notes: string) => void;
  addProduct: (product: StoreProduct) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  toOrderInput: (paymentMethod: PlaceStoreOrderInput["paymentMethod"]) => PlaceStoreOrderInput;
};

const toEffectivePrice = (item: Pick<StoreCartItem, "price" | "discountPrice">) =>
  item.discountPrice > 0 && item.discountPrice < item.price ? item.discountPrice : item.price;

export const useStoreCart = create<StoreCartState>((set, get) => ({
  couponCode: "",
  notes: "",
  items: [],
  setCouponCode: (couponCode) => set({ couponCode }),
  setNotes: (notes) => set({ notes }),
  addProduct: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            nameAr: product.nameAr,
            nameEn: product.nameEn,
            imageUrl: product.imageUrl,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity: 1,
          },
        ],
      };
    }),
  removeProduct: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    })),
  clear: () => set({ couponCode: "", notes: "", items: [] }),
  toOrderInput: (paymentMethod) => {
    const state = get();
    return {
      paymentMethod,
      notes: state.notes || undefined,
      couponCode: state.couponCode || undefined,
      items: state.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
  },
}));

export const getCartSubtotal = (items: StoreCartItem[]) =>
  items.reduce((total, item) => total + toEffectivePrice(item) * item.quantity, 0);
