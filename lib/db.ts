import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  publisher: text("publisher").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  stock: integer("stock").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  category: text("category").notNull(),
  rating: integer("rating").notNull().default(45),
});

export const orders = pgTable("orders", {
  number: text("number").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  wilaya: integer("wilaya").notNull(),
  commune: text("commune").notNull(),
  deliveryType: text("delivery_type").notNull(),
  items: text("items").notNull(),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  deliveryFee: integer("delivery_fee").notNull(),
  status: text("status").notNull().default("pending"),
  otp: text("otp").notNull(),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const stockAlerts = pgTable("stock_alerts", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  contact: text("contact").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export async function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const sql = neon(url);
  return drizzle(sql);
}
