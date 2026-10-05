import { and, desc, eq, gt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { blogPosts, bookings, contactEnquiries, InsertBooking, InsertContactEnquiry, InsertTrainingSession, testimonials, trainingSessions } from "../drizzle/schema";

let _pool: pg.Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getPool() {
  if (!_pool && process.env.DATABASE_URL) {
    const raw = process.env.DATABASE_URL;
    // Hosted Postgres (Supabase, Render external URLs) needs TLS. We handle it here and strip
    // sslmode from the URL, because the driver would otherwise insist on a CA it doesn't have.
    const needsSsl = /sslmode=(require|verify)/.test(raw) || process.env.DATABASE_SSL === "true" || /supabase\.(co|com)/.test(raw);
    const url = raw.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, "");
    _pool = new pg.Pool({ connectionString: url, max: 5, ssl: needsSsl ? { rejectUnauthorized: false } : undefined });
    _pool.on("error", err => console.error("[Database] Pool error:", err.message));
  }
  return _pool;
}

export function getDb() {
  if (!_db) {
    const pool = getPool();
    if (pool) _db = drizzle(pool);
  }
  return _db;
}

export async function getUpcomingTrainingSessions() {
  const db = getDb();
  if (!db) return [];
  const today = new Date().toISOString().split("T")[0]!;
  return db.select().from(trainingSessions)
    .where(and(eq(trainingSessions.status, "active"), gt(trainingSessions.date, today)))
    .orderBy(trainingSessions.date);
}

export async function getTrainingSessionById(id: number) {
  const db = getDb();
  if (!db) return undefined;
  const result = await db.select().from(trainingSessions).where(eq(trainingSessions.id, id)).limit(1);
  return result[0];
}

export async function createBooking(data: InsertBooking) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const participants = data.participants ?? 1;
  return db.transaction(async tx => {
    // Reserve the places atomically so two simultaneous bookings can't oversell a course.
    const reserved = await tx.update(trainingSessions)
      .set({ bookedCount: sql`${trainingSessions.bookedCount} + ${participants}` })
      .where(and(
        eq(trainingSessions.id, data.sessionId),
        eq(trainingSessions.status, "active"),
        sql`${trainingSessions.capacity} - ${trainingSessions.bookedCount} >= ${participants}`,
      ))
      .returning({ id: trainingSessions.id });
    if (reserved.length === 0) {
      const session = (await tx.select().from(trainingSessions).where(eq(trainingSessions.id, data.sessionId)).limit(1))[0];
      if (!session || session.status !== "active") throw new Error("This course date is no longer available");
      const remaining = session.capacity - session.bookedCount;
      throw new Error(remaining > 0 ? `Only ${remaining} place${remaining === 1 ? "" : "s"} remaining on this date` : "This course date is now full");
    }
    await tx.insert(bookings).values(data);
    return { success: true } as const;
  });
}

export async function createContactEnquiry(data: InsertContactEnquiry) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(contactEnquiries).values(data);
  return { success: true } as const;
}

export async function getApprovedTestimonials() {
  const db = getDb();
  if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.approved, true)).orderBy(testimonials.displayOrder);
}

function postConditions(category?: string) {
  const conditions = [eq(blogPosts.published, true)];
  if (category && category !== "all") conditions.push(eq(blogPosts.category, category as never));
  return and(...conditions);
}

export async function getPublishedBlogPosts(limit = 10, offset = 0, category?: string) {
  const db = getDb();
  if (!db) return [];
  return db.select().from(blogPosts).where(postConditions(category)).orderBy(desc(blogPosts.publishedAt)).limit(limit).offset(offset);
}

export async function getBlogPostBySlug(slug: string) {
  const db = getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.published, true))).limit(1);
  return result[0];
}

export async function getBlogPostCount(category?: string) {
  const db = getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(blogPosts).where(postConditions(category));
  return result[0]?.count ?? 0;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

function requireDb() {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

export async function adminListSessions() {
  return requireDb().select().from(trainingSessions).orderBy(desc(trainingSessions.date));
}

export async function adminCreateSession(data: Omit<InsertTrainingSession, "ref" | "id" | "bookedCount" | "createdAt">) {
  const ref = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const rows = await requireDb().insert(trainingSessions).values({ ...data, ref }).returning();
  return rows[0]!;
}

export async function adminUpdateSession(id: number, data: Partial<Omit<InsertTrainingSession, "ref" | "id" | "bookedCount" | "createdAt">>) {
  const db = requireDb();
  if (data.capacity != null) {
    const current = (await db.select().from(trainingSessions).where(eq(trainingSessions.id, id)).limit(1))[0];
    if (current && data.capacity < current.bookedCount) throw new Error(`Capacity can't be lower than the ${current.bookedCount} places already booked`);
  }
  const rows = await db.update(trainingSessions).set(data).where(eq(trainingSessions.id, id)).returning();
  if (!rows[0]) throw new Error("Course date not found");
  return rows[0];
}

export async function adminDeleteSession(id: number) {
  const db = requireDb();
  const existing = await db.select({ id: bookings.id }).from(bookings).where(eq(bookings.sessionId, id)).limit(1);
  if (existing.length) throw new Error("This date has bookings, so it can't be deleted. Set its status to Cancelled instead.");
  await db.delete(trainingSessions).where(eq(trainingSessions.id, id));
  return { success: true } as const;
}

export async function adminListBookings() {
  return requireDb()
    .select({
      id: bookings.id, sessionId: bookings.sessionId, firstName: bookings.firstName, lastName: bookings.lastName, email: bookings.email,
      organisation: bookings.organisation, phone: bookings.phone, jobTitle: bookings.jobTitle, participants: bookings.participants,
      specialRequirements: bookings.specialRequirements, status: bookings.status, createdAt: bookings.createdAt,
      sessionTitle: trainingSessions.title, sessionDate: trainingSessions.date, sessionMode: trainingSessions.deliveryMode, sessionLocation: trainingSessions.location,
    })
    .from(bookings)
    .leftJoin(trainingSessions, eq(bookings.sessionId, trainingSessions.id))
    .orderBy(desc(bookings.createdAt));
}

/** Changes a booking's status and keeps the course's booked-places count in step. */
export async function adminSetBookingStatus(id: number, status: "pending" | "confirmed" | "cancelled") {
  return requireDb().transaction(async tx => {
    const booking = (await tx.select().from(bookings).where(eq(bookings.id, id)).limit(1))[0];
    if (!booking) throw new Error("Booking not found");
    if (booking.status === status) return { success: true } as const;
    const wasHolding = booking.status !== "cancelled";
    const willHold = status !== "cancelled";
    if (wasHolding && !willHold) {
      await tx.update(trainingSessions).set({ bookedCount: sql`GREATEST(${trainingSessions.bookedCount} - ${booking.participants}, 0)` }).where(eq(trainingSessions.id, booking.sessionId));
    } else if (!wasHolding && willHold) {
      const reserved = await tx.update(trainingSessions)
        .set({ bookedCount: sql`${trainingSessions.bookedCount} + ${booking.participants}` })
        .where(and(eq(trainingSessions.id, booking.sessionId), sql`${trainingSessions.capacity} - ${trainingSessions.bookedCount} >= ${booking.participants}`))
        .returning({ id: trainingSessions.id });
      if (!reserved.length) throw new Error("Not enough places left on that date to reinstate this booking");
    }
    await tx.update(bookings).set({ status }).where(eq(bookings.id, id));
    return { success: true } as const;
  });
}

export async function adminListEnquiries() {
  return requireDb().select().from(contactEnquiries).orderBy(desc(contactEnquiries.createdAt));
}

export async function adminSetEnquiryHandled(id: number, handled: boolean) {
  await requireDb().update(contactEnquiries).set({ handled }).where(eq(contactEnquiries.id, id));
  return { success: true } as const;
}
