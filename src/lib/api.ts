import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { parseCookie as parse } from "cookie";
import { getRequest } from "@tanstack/react-start/server";
import nodemailer from "nodemailer";

// Mappers for backwards compatibility with existing frontend
const mapProduct = (p: any) => {
  const revs = p.reviews || [];
  const reviews_count = p._count?.reviews !== undefined ? p._count.reviews : revs.length;
  const avg_rating = revs.length ? (revs.reduce((s: any, r: any) => s + r.rating, 0) / revs.length).toFixed(1) : "0";
  const compare_price = p.comparePrice && p.comparePrice > p.price ? p.comparePrice : Math.round((p.price * 1.25) / 500) * 500;
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

const mapReview = (r: any) => ({
  ...r,
  product_id: r.productId,
  customer_name: r.customerName,
  created_at: r.createdAt,
  product_name: r.product?.name,
  product_slug: r.product?.slug,
  product_image: Array.isArray(r.product?.images) && r.product.images.length > 0 ? r.product.images[0] : undefined,
});

const mapSettings = (s: any) => ({
  ...s,
  store_name: s.storeName,
  shipping_fee: s.shippingFee,
  free_shipping_over: s.freeShippingOver,
});

export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const products = await prisma.product.findMany({
    include: {
      reviews: {
        select: { rating: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: { createdAt: "desc" }
  });
  return products.map(mapProduct);
});

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.category.findMany({
    orderBy: { sort: "asc" }
  });
});

export const getProductBySlugFn = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: {
          select: { rating: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });
    return p ? mapProduct(p) : null;
  });

export const getReviewsFn = createServerFn({ method: "GET" })
  .validator((productId: string) => productId)
  .handler(async ({ data: productId }) => {
    const r = await prisma.review.findMany({
      where: { productId },
      include: {
        product: { select: { name: true, slug: true, images: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return r.map(mapReview);
  });

export const getSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const s = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  return s ? mapSettings(s) : null;
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    let orderNumber = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    while (await prisma.order.findUnique({ where: { orderNumber }, select: { id: true } })) {
      orderNumber = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    }
    const order = await prisma.order.create({
      data: {
        ...data,
        orderNumber
      }
    });
    return { ...order, created_at: order.createdAt };
  });

export const trackOrderFn = createServerFn({ method: "GET" })
  .validator((data: { orderNumber: string, phone: string }) => data)
  .handler(async ({ data: { orderNumber, phone } }) => {
    const o = await prisma.order.findFirst({
      where: { orderNumber, phone }
    });
    return o ? { ...o, created_at: o.createdAt } : null;
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
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Invalid credentials");
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new Error("Invalid credentials");
    return { token: process.env.ADMIN_SESSION_SECRET };
  });

export const getAdminStatsFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await prisma.order.findMany({ select: { total: true, status: true, createdAt: true, phone: true } });
  const products = await prisma.product.findMany({ select: { id: true } });
  return { orders, products };
});

export const adminGetOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return orders.map((o) => ({ ...o, created_at: o.createdAt }));
});

export const adminUpdateOrderFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, status: string }) => data)
  .handler(async ({ data: { id, status } }) => {
    await verifyAdminSession();
    return prisma.order.update({ where: { id }, data: { status } });
  });

export const adminGetCustomersFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const orders = await prisma.order.findMany({ select: { fullName: true, phone: true, city: true, total: true, createdAt: true } });
  return orders.map((o) => ({ ...o, created_at: o.createdAt }));
});

export const adminSaveProductFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await verifyAdminSession();
    const {
      id,
      slug: inputSlug,
      category_id, categoryId,
      compare_price, comparePrice,
      is_featured, isFeatured,
      is_new, isNew,
      is_trending, isTrending,
      is_best_seller, isBestSeller,
      colors, color,
      ...rest
    } = data;

    let baseSlug = (inputSlug || data.name || "product")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!baseSlug) baseSlug = `product-${Date.now()}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.product.findUnique({
        where: { slug: finalSlug },
        select: { id: true },
      });
      if (!existing || existing.id === id) {
        break;
      }
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const finalCat = category_id || categoryId || null;
    const finalCompare = compare_price || comparePrice || null;
    const currentSpecs: any = typeof rest.specs === "object" && rest.specs !== null ? { ...rest.specs } : (typeof rest.specs === "string" ? JSON.parse(rest.specs || "{}") : {});
    if (Array.isArray(colors) && colors.length > 0) {
      currentSpecs.colors = colors;
    } else {
      delete currentSpecs.colors;
    }
    const mapped: any = {
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
      const updated = await prisma.product.update({ where: { id }, data: mapped });
      return mapProduct(updated);
    }
    const created = await prisma.product.create({ data: mapped });
    return mapProduct(created);
  });

export const adminDeleteProductFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await verifyAdminSession();
    return prisma.product.delete({ where: { id } });
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
    const updated = await prisma.storeSettings.update({ where: { id: 1 }, data: mapped });
    return mapSettings(updated);
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
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; border-bottom: 2px solid #333; padding-bottom: 10px;">New Message from GrandDecore Store</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #555;">Message:</h3>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; line-height: 1.5;">${msg}</p>
        </div>
      `,
    });

    return { success: true };
  });

export const checkIsAdminDomainFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const req = getRequest();
    const host = req.headers.get("host") || "";
    return host.startsWith("admin.") || host.includes("admin.granddecore.store");
  } catch (e) {
    return false;
  }
});

export const createReviewFn = createServerFn({ method: "POST" })
  .validator((data: { productId: string; customerName: string; rating: number; title?: string; body?: string }) => data)
  .handler(async ({ data }) => {
    const created = await prisma.review.create({
      data: {
        productId: data.productId,
        customerName: data.customerName,
        rating: Number(data.rating),
        title: data.title || null,
        body: data.body || null,
      },
      include: {
        product: { select: { name: true, slug: true, images: true } }
      }
    });
    return mapReview(created);
  });

export const adminGetReviewsFn = createServerFn({ method: "GET" }).handler(async () => {
  await verifyAdminSession();
  const r = await prisma.review.findMany({
    include: {
      product: { select: { name: true, slug: true, images: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return r.map(mapReview);
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
      const updated = await prisma.review.update({
        where: { id },
        data: mapped,
        include: { product: { select: { name: true, slug: true, images: true } } }
      });
      return mapReview(updated);
    }
    const created = await prisma.review.create({
      data: mapped,
      include: { product: { select: { name: true, slug: true, images: true } } }
    });
    return mapReview(created);
  });

export const adminDeleteReviewFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await verifyAdminSession();
    return prisma.review.delete({ where: { id } });
  });

