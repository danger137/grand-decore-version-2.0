import { queryOptions } from "@tanstack/react-query";
import type { Category, Product, Review, StoreSettings } from "./types";
import {
  getProductsFn,
  getCategoriesFn,
  getProductBySlugFn,
  getReviewsFn,
  getSettingsFn,
  adminGetReviewsFn,
} from "./api";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const data = await getProductsFn();
    return (data ?? []) as unknown as Product[];
  },
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async (): Promise<Category[]> => {
    const data = await getCategoriesFn();
    return (data ?? []) as Category[];
  },
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const data = await getProductBySlugFn({ data: slug });
      return (data as unknown as Product) ?? null;
    },
  });

export const reviewsQuery = (productId: string) =>
  queryOptions({
    queryKey: ["reviews", productId],
    queryFn: async (): Promise<Review[]> => {
      const data = await getReviewsFn({ data: productId });
      return (data ?? []) as Review[];
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["store_settings"],
  queryFn: async (): Promise<StoreSettings> => {
    const data = await getSettingsFn();
    return data as unknown as StoreSettings;
  },
});

export const adminReviewsQuery = queryOptions({
  queryKey: ["admin_reviews"],
  queryFn: async (): Promise<Review[]> => {
    const data = await adminGetReviewsFn();
    return (data ?? []) as Review[];
  },
});

