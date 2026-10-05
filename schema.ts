import { boolean, integer, pgSchema, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// Everything lives in its own Postgres schema so it can share a database with other tables safely.
export const DB_SCHEMA = "website";
const website = pgSchema(DB_SCHEMA);

export const trainingSessions = website.table("training_sessions", {
  id: serial("id").primaryKey(),
  // Stable reference from content/training-sessions.json, used to update a session in place.
  ref: varchar("ref", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: varchar("date", { length: 20 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 10 }).notNull(), // HH:MM
  durationHours: integer("durationHours").default(6),
  deliveryMode: varchar("deliveryMode", { length: 20 }).$type<"online" | "in_person" | "hybrid">().default("online").notNull(),
  location: varchar("location", { length: 255 }),
  capacity: integer("capacity").default(12).notNull(),
  bookedCount: integer("bookedCount").default(0).notNull(),
  priceGbp: integer("priceGbp").default(495), // whole pounds, excluding VAT
  status: varchar("status", { length: 20 }).$type<"active" | "cancelled" | "full" | "completed">().default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type TrainingSession = typeof trainingSessions.$inferSelect;

export const bookings = website.table("bookings", {
  id: serial("id").primaryKey(),
  sessionId: integer("sessionId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organisation: varchar("organisation", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  jobTitle: varchar("jobTitle", { length: 150 }),
  participants: integer("participants").default(1).notNull(),
  specialRequirements: text("specialRequirements"),
  status: varchar("status", { length: 20 }).$type<"pending" | "confirmed" | "cancelled">().default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InsertBooking = typeof bookings.$inferInsert;

export const SERVICE_INTERESTS = [
  "carbon_reduction_plans",
  "life_cycle_assessments",
  "scope_3_supply_chain",
  "net_zero_strategy",
  "training",
  "general",
] as const;

export const contactEnquiries = website.table("contact_enquiries", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  organisation: varchar("organisation", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  serviceInterest: varchar("serviceInterest", { length: 40 }).$type<(typeof SERVICE_INTERESTS)[number]>().default("general").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InsertContactEnquiry = typeof contactEnquiries.$inferInsert;

export const testimonials = website.table("testimonials", {
  id: serial("id").primaryKey(),
  ref: varchar("ref", { length: 100 }).notNull().unique(),
  clientName: varchar("clientName", { length: 150 }).notNull(),
  organisation: varchar("organisation", { length: 255 }).notNull(),
  role: varchar("role", { length: 150 }),
  quote: text("quote").notNull(),
  serviceType: varchar("serviceType", { length: 100 }),
  approved: boolean("approved").default(false).notNull(),
  displayOrder: integer("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Testimonial = typeof testimonials.$inferSelect;

export const BLOG_CATEGORIES = ["compliance", "training", "lca", "scope_3", "international", "industry_news"] as const;

export const blogPosts = website.table("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: varchar("category", { length: 30 }).$type<(typeof BLOG_CATEGORIES)[number]>().default("industry_news").notNull(),
  author: varchar("author", { length: 150 }).default("Net Zero International").notNull(),
  featuredImage: varchar("featuredImage", { length: 500 }),
  seoTitle: varchar("seoTitle", { length: 200 }),
  seoDescription: varchar("seoDescription", { length: 300 }),
  published: boolean("published").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
export type BlogPost = typeof blogPosts.$inferSelect;
