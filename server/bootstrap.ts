/**
 * Runs at server start: creates the tables if they don't exist, then copies the
 * files in /content into the database. The content files are the source of truth
 * for blog posts, course dates and testimonials — edit them and redeploy.
 * Bookings, enquiries and the booked-places count live only in the database.
 */
import { sql } from "drizzle-orm";
import { blogPosts, testimonials, trainingSessions } from "../drizzle/schema";
import posts from "../content/blog-posts.json";
import sessions from "../content/training-sessions.json";
import quotes from "../content/testimonials.json";
import { getDb, getPool } from "./db";

const DDL = `
CREATE SCHEMA IF NOT EXISTS website;
CREATE TABLE IF NOT EXISTS website.training_sessions (
  id serial PRIMARY KEY, ref varchar(100) NOT NULL UNIQUE, title varchar(255) NOT NULL, description text,
  date varchar(20) NOT NULL, time varchar(10) NOT NULL, "durationHours" integer DEFAULT 6,
  "deliveryMode" varchar(20) NOT NULL DEFAULT 'online', location varchar(255),
  capacity integer NOT NULL DEFAULT 12, "bookedCount" integer NOT NULL DEFAULT 0, "priceGbp" integer DEFAULT 495,
  status varchar(20) NOT NULL DEFAULT 'active', "createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS website.bookings (
  id serial PRIMARY KEY, "sessionId" integer NOT NULL, "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL,
  email varchar(320) NOT NULL, organisation varchar(255) NOT NULL, phone varchar(30), "jobTitle" varchar(150),
  participants integer NOT NULL DEFAULT 1, "specialRequirements" text, status varchar(20) NOT NULL DEFAULT 'pending',
  "createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS website.contact_enquiries (
  id serial PRIMARY KEY, "firstName" varchar(100) NOT NULL, "lastName" varchar(100) NOT NULL, email varchar(320) NOT NULL,
  organisation varchar(255), phone varchar(30), "serviceInterest" varchar(40) NOT NULL DEFAULT 'general',
  message text NOT NULL, "createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS website.testimonials (
  id serial PRIMARY KEY, ref varchar(100) NOT NULL UNIQUE, "clientName" varchar(150) NOT NULL, organisation varchar(255) NOT NULL,
  role varchar(150), quote text NOT NULL, "serviceType" varchar(100), approved boolean NOT NULL DEFAULT false,
  "displayOrder" integer DEFAULT 0, "createdAt" timestamp NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS website.blog_posts (
  id serial PRIMARY KEY, title varchar(255) NOT NULL, slug varchar(255) NOT NULL UNIQUE, excerpt text, content text,
  category varchar(30) NOT NULL DEFAULT 'industry_news', author varchar(150) NOT NULL DEFAULT 'Net Zero International',
  "featuredImage" varchar(500), "seoTitle" varchar(200), "seoDescription" varchar(300), published boolean NOT NULL DEFAULT false,
  "publishedAt" timestamp, "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now());
`;

type PostFile = { title: string; slug: string; excerpt?: string; content?: string; category?: string; author?: string; featuredImage?: string; seoTitle?: string; seoDescription?: string; published?: boolean; publishedAt?: string };
type SessionFile = { ref: string; title: string; description?: string; date: string; time: string; durationHours?: number; deliveryMode?: string; location?: string; capacity?: number; priceGbp?: number; status?: string };
type QuoteFile = { ref: string; clientName: string; organisation: string; role?: string; quote: string; serviceType?: string; displayOrder?: number };

export async function bootstrapDatabase() {
  const pool = getPool();
  const db = getDb();
  if (!pool || !db) {
    console.warn("[Database] DATABASE_URL is not set — blog, course dates and forms will not work.");
    return;
  }
  await pool.query(DDL);

  for (const p of posts as PostFile[]) {
    const values = {
      title: p.title, slug: p.slug, excerpt: p.excerpt ?? null, content: p.content ?? null,
      category: (p.category ?? "industry_news") as never, author: p.author ?? "Net Zero International",
      featuredImage: p.featuredImage ?? null, seoTitle: p.seoTitle ?? null, seoDescription: p.seoDescription ?? null,
      published: p.published ?? true, publishedAt: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    };
    await db.insert(blogPosts).values(values).onConflictDoUpdate({ target: blogPosts.slug, set: { ...values, updatedAt: new Date() } });
  }

  for (const s of sessions as SessionFile[]) {
    const values = {
      ref: s.ref, title: s.title, description: s.description ?? null, date: s.date, time: s.time,
      durationHours: s.durationHours ?? 6, deliveryMode: (s.deliveryMode ?? "online") as never, location: s.location ?? null,
      capacity: s.capacity ?? 12, priceGbp: s.priceGbp ?? null, status: (s.status ?? "active") as never,
    };
    // bookedCount is deliberately left out so redeploying never resets real bookings.
    await db.insert(trainingSessions).values(values).onConflictDoUpdate({ target: trainingSessions.ref, set: values });
  }

  const refs = (quotes as QuoteFile[]).map(q => q.ref);
  for (const q of quotes as QuoteFile[]) {
    const values = { ref: q.ref, clientName: q.clientName, organisation: q.organisation, role: q.role ?? null, quote: q.quote, serviceType: q.serviceType ?? null, displayOrder: q.displayOrder ?? 0, approved: true };
    await db.insert(testimonials).values(values).onConflictDoUpdate({ target: testimonials.ref, set: values });
  }
  // A testimonial removed from the file stops showing.
  await db.update(testimonials).set({ approved: false }).where(refs.length ? sql`${testimonials.ref} NOT IN (${sql.join(refs.map(r => sql`${r}`), sql`, `)})` : sql`true`);

  console.log(`[Database] Ready — ${posts.length} posts, ${sessions.length} course dates, ${quotes.length} testimonials synced.`);
}
