import { createServerFn } from "@tanstack/react-start";
import { osClient, generateId } from "./opensearch";
import bcrypt from "bcryptjs";
import { parseCookie as parse } from "cookie";
import { getRequest } from "@tanstack/react-start/server";
import nodemailer from "nodemailer";
import { fallbackProducts, fallbackCategories, fallbackReviews, fallbackSettings } from "./fallback-data";

function withTimeout<T>(promise: Promise<T>, ms = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`OpenSearch timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Helper to get hits from OpenSearch response
const getHits = (res: any) => res.body?.hits?.hits?.map((h: any) => ({ ...h._source, id: h._id })) || [];

// General search helper
async function searchAll(index: string, sortField = "createdAt", sortOrder = "desc") {
  try {
    const res = await withTimeout(osClient.search({
      index,
      body: {
        size: 1000,
        query: { match_all: {} },
        sort: sortField ? [{ [sortField]: { order: sortOrder, unmapped_type: "date" } }] : []
      }
    }), 1500);
    const hits = getHits(res);
    if (hits.length === 0) {
      if (index === "products") return fallbackProducts;
      if (index === "categories") return fallbackCategories;
      if (index === "reviews") return fallbackReviews;
      if (index === "settings") return [fallbackSettings];
    }
    return hits;
  } catch (e: any) {
    if (index === "products") return fallbackProducts;
    if (index === "categories") return fallbackCategories;
    if (index === "reviews") return fallbackReviews;
    if (index === "settings") return [fallbackSettings];
    return [];
  }
}

// Mappers for backwards compatibility with existing frontend
const mapProduct = (p: any, reviews = []) => {
  const revs = reviews.filter((r: any) => r.productId === p.id);
  const reviews_count = p._count?.reviews !== undefined ? p._count.reviews : revs.length;
  const avg_rating = revs.length ? (revs.reduce((s: any, r: any) => s + r.rating, 0) / revs.length).toFixed(1) : "0";
  const compare_price = p.comparePrice && p.comparePrice > p.price ? p.comparePrice : null;
  const colors = p.specs && typeof p.specs === 'object' && p.specs.colors && Array.isArray(p.specs.colors) ? p.specs.colors : (p.colors || []);
  return {
    ...p,
    colors,
    category_id: p.categoryId,
    compare_price,
    is_featured: p.isFeatured,
    is_new: p.isNew,
    is_trending: p.isTrending,
    is_best_seller: p.isBestSeller,
    created_at: p.createdAt,
    reviews_count,
    avg_rating,
  };
};

const mapReview = (r: any, products = []) => {
  const product = products.find((p: any) => p.id === r.productId) || {};
  return {
    ...r,
    product_id: r.productId,
    customer_name: r.customerName,
    created_at: r.createdAt,
    product_name: product.name,
    product_slug: product.slug,
    product_image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined,
  };
};

const mapSettings = (s: any) => ({
  ...s,
  store_name: s.storeName,
  shipping_fee: s.shippingFee,
  free_shipping_over: s.freeShippingOver,
});

export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const products = await searchAll("products");
  const reviews = await searchAll("reviews");
  return products.map(p => mapProduct(p, reviews));
});

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  return await searchAll("categories", "sort", "asc");
});

export const getProductBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      const res = await withTimeout(osClient.search({
        index: "products",
        body: { query: { term: { "slug.keyword": slug } } }
      }), 1500);
      const hits = getHits(res);
      const reviews = await searchAll("reviews");
      if (hits.length === 0) {
        const fallback = fallbackProducts.find(p => p.slug === slug);
        if (fallback) return mapProduct(fallback, reviews);
        return null;
      }
      return mapProduct(hits[0], reviews);
    } catch {
      const reviews = await searchAll("reviews");
      const fallback = fallbackProducts.find(p => p.slug === slug);
      if (fallback) return mapProduct(fallback, reviews);
      return null;
    }
  });

export const getReviewsFn = createServerFn({ method: "GET" })
  .validator((productId: string) => productId)
  .handler(async ({ data: productId }) => {
    try {
      const res = await withTimeout(osClient.search({
        index: "reviews",
        body: { query: { term: { "productId.keyword": productId } }, sort: [{ createdAt: "desc" }] }
      }), 1500);
      const hits = getHits(res);
      const products = await searchAll("products");
      if (hits.length === 0) {
        return fallbackReviews.filter(r => r.productId === productId).map(r => mapReview(r, products));
      }
      return hits.map(r => mapReview(r, products));
    } catch {
      const products = await searchAll("products");
      return fallbackReviews.filter(r => r.productId === productId).map(r => mapReview(r, products));
    }
  });

export const getSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await withTimeout(osClient.get({ index: "settings", id: "1" }), 1500);
    return mapSettings({ ...res.body._source, id: res.body._id });
  } catch {
    return mapSettings(fallbackSettings);
  }
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const orderNumber = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    const order = { ...data, orderNumber, status: "pending", createdAt: new Date().toISOString(), id: generateId() };
    await osClient.index({ index: "orders", id: order.id, body: order, refresh: true });
    return { ...order, created_at: order.createdAt };
  });

export const trackOrderFn = createServerFn({ method: "GET" })
  .validator((data: { orderNumber: string, phone: string }) => data)
  .handler(async ({ data: { orderNumber, phone } }) => {
    try {
      const res = await osClient.search({
        index: "orders",
        body: {
          query: {
            bool: {
              must: [
                { term: { "orderNumber.keyword": orderNumber } },
                { term: { "phone.keyword": phone } }
              ]
            }
          }
        }
      });
      const hits = getHits(res);
      return hits.length > 0 ? { ...hits[0], created_at: hits[0].createdAt } : null;
    } catch {
      return null;
    }
  });

// Auth & Admin Functions
const SESSION_COOKIE = "admin_session";

async function verifyAdminSession() {
  const req = getRequest();
  const cookies = parse(req.headers.get("cookie") || "");
  const session = cookies[SESSION_COOKIE];
  if (session !== process.env.ADMIN_SESSION_SECRET) {
    throw new Error("Unauthorized");
  }
}

export const getAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const req = getRequest();
    const cookies = parse(req.headers.get("cookie") || "");
    const session = cookies[SESSION_COOKIE];
    if (session === process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET) {
      return { user: { id: "admin", email: "admin@granddecore.com" }, isAdmin: true };
    }
  } catch (e) {
    // Ignore
  }
  return { user: null, isAdmin: false };
});

export const adminLoginFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data: { email, password } }) => {
    try {
      const res = await osClient.search({
        index: "admins",
        body: { query: { term: { "email.keyword": email } } }
      });
      const hits = getHits(res);
      if (hits.length === 0) throw new Error("Invalid credentials");
      const admin = hits[0];
      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) throw new Error("Invalid credentials");
      return { token: process.env.ADMIN_SESSION_SECRET };
    } catch (err: any) {
      console.error("ADMIN LOGIN ERROR:", err);
      throw new Error(err.message || "Invalid credentials");
    }
  });

export const getAdminStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await searchAll("orders");
  const products = await searchAll("products");
  return { orders, products };
});

export const adminGetOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await searchAll("orders");
  return orders.map((o: any) => ({ ...o, created_at: o.createdAt }));
});

export const adminUpdateOrderFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, status: string }) => data)
  .handler(async ({ data: { id, status } }) => {
    await verifyAdminSession();
    await osClient.update({ index: "orders", id, body: { doc: { status } }, refresh: true });
    return { id, status };
  });

export const adminGetCustomersFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await searchAll("orders");
  return orders.map((o: any) => ({ ...o, created_at: o.createdAt }));
});

export const adminSaveProductFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await verifyAdminSession();
    const {
      id, slug: inputSlug, category_id, categoryId, compare_price, comparePrice,
      is_featured, isFeatured, is_new, isNew, is_trending, isTrending,
      is_best_seller, isBestSeller, colors, color, ...rest
    } = data;

    let baseSlug = (inputSlug || data.name || "product")
      .toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!baseSlug) baseSlug = `product-${Date.now()}`;
    const finalSlug = baseSlug;

    const finalCat = category_id || categoryId || null;
    const finalCompare = compare_price || comparePrice || null;
    const currentSpecs: any = typeof rest.specs === "object" && rest.specs !== null ? { ...rest.specs } : (typeof rest.specs === "string" ? JSON.parse(rest.specs || "{}") : {});
    if (Array.isArray(colors) && colors.length > 0) currentSpecs.colors = colors;
    else delete currentSpecs.colors;

    const mapped = {
      ...rest,
      name: (data.name || "Untitled Product").toString().trim(),
      slug: finalSlug,
      categoryId: finalCat === "" ? null : finalCat,
      comparePrice: finalCompare === "" || finalCompare === null ? null : Number(finalCompare),
      isFeatured: !!(is_featured || isFeatured),
      isNew: !!(is_new || isNew),
      isTrending: !!(is_trending || isTrending),
      isBestSeller: !!(is_best_seller || isBestSeller),
      images: Array.isArray(data.images) ? data.images : [],
      variants: Array.isArray(data.variants) ? data.variants : [],
      specs: currentSpecs,
    };

    if (id) {
      await osClient.update({ index: "products", id, body: { doc: mapped }, refresh: true });
      return mapProduct({ ...mapped, id });
    }
    const newId = generateId();
    const created = { ...mapped, id: newId, createdAt: new Date().toISOString() };
    await osClient.index({ index: "products", id: newId, body: created, refresh: true });
    return mapProduct(created);
  });

export const adminDeleteProductFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await verifyAdminSession();
    await osClient.delete({ index: "products", id, refresh: true });
    return { id };
  });

export const adminSaveSettingsFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await verifyAdminSession();
    const { id, store_name, shipping_fee, free_shipping_over, ...rest } = data;
    const mapped = {
      ...rest,
      storeName: store_name,
      shippingFee: Number(shipping_fee),
      freeShippingOver: Number(free_shipping_over),
    };
    await osClient.index({ index: "settings", id: "1", body: mapped, refresh: true });
    return mapSettings({ ...mapped, id: "1" });
  });

export const sendContactEmailFn = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; msg: string }) => data)
  .handler(async ({ data: { name, email, msg } }) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL || "salmanshah927007@gmail.com",
        pass: process.env.SMTP_PASSWORD || "cycr mlcv kvbh qlpe",
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_EMAIL || "salmanshah927007@gmail.com"}>`,
      to: "salmanshah927007@gmail.com",
      replyTo: email || "salmanshah927007@gmail.com",
      subject: `New Contact Message from ${name} — GrandDecore`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`,
    });

    return { success: true };
  });

export const checkIsAdminDomainFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const req = getRequest();
    const host = req.headers.get("host") || "";
    return host.startsWith("admin.") || host.includes("admin.granddecore.store");
  } catch {
    return false;
  }
});

export const createReviewFn = createServerFn({ method: "POST" })
  .validator((data: { productId: string; customerName: string; rating: number; title?: string; body?: string }) => data)
  .handler(async ({ data }) => {
    const created = {
      id: generateId(),
      productId: data.productId,
      customerName: data.customerName,
      rating: Number(data.rating),
      title: data.title || null,
      body: data.body || null,
      createdAt: new Date().toISOString()
    };
    await osClient.index({ index: "reviews", id: created.id, body: created, refresh: true });
    const products = await searchAll("products");
    return mapReview(created, products);
  });

export const adminGetReviewsFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const reviews = await searchAll("reviews");
  const products = await searchAll("products");
  return reviews.map((r: any) => mapReview(r, products));
});

export const adminSaveReviewFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await verifyAdminSession();
    const { id, product_id, customer_name, rating, title, body } = data;
    const mapped = {
      productId: product_id || data.productId,
      customerName: customer_name || data.customerName,
      rating: Number(rating),
      title: title || null,
      body: body || null,
    };
    if (id) {
      await osClient.update({ index: "reviews", id, body: { doc: mapped }, refresh: true });
      const products = await searchAll("products");
      return mapReview({ ...mapped, id }, products);
    }
    const newId = generateId();
    const created = { ...mapped, id: newId, createdAt: new Date().toISOString() };
    await osClient.index({ index: "reviews", id: newId, body: created, refresh: true });
    const products = await searchAll("products");
    return mapReview(created, products);
  });

export const adminDeleteReviewFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await verifyAdminSession();
    await osClient.delete({ index: "reviews", id, refresh: true });
    return { id };
  });