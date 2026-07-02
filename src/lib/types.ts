export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null;
  images: string[];
  videos: string[];
  specs: Record<string, any> | null;
  variants: any[];
  colors?: any[];
  inventory: number;
  is_featured: boolean;
  is_new: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  created_at: string;
  reviews_count?: number;
  avg_rating?: string | number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  sort: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
  quantity: number;
};

export type Review = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  product_name?: string;
  product_slug?: string;
  product_image?: string;
};

export type StoreSettings = {
  id: number;
  store_name: string;
  logo: string | null;
  whatsapp: string;
  email: string;
  phone: string;
  socials: { instagram?: string; facebook?: string; tiktok?: string };
  shipping_fee: number;
  free_shipping_over: number;
};

export const fmtPKR = (n: number) =>
  new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(n);

export type ParsedReviewBody = {
  text: string;
  packageQuality?: string;
  image?: string;
};

export const parseReviewBody = (body?: string | null): ParsedReviewBody => {
  if (!body) return { text: "" };
  const trimmed = body.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object" && parsed !== null) {
        return {
          text: parsed.text !== undefined ? String(parsed.text) : (parsed.body !== undefined ? String(parsed.body) : ""),
          packageQuality: parsed.packageQuality !== undefined ? String(parsed.packageQuality) : undefined,
          image: parsed.image !== undefined ? String(parsed.image) : undefined,
        };
      }
    } catch (e) {
      // ignore
    }
  }
  return { text: body };
};
