import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

vi.mock("./db", () => ({
  getUpcomingTrainingSessions: vi.fn().mockResolvedValue([{ id: 1, title: "Net Zero Leaders", date: "2026-11-18" }]),
  getTrainingSessionById: vi.fn().mockResolvedValue({ id: 1, title: "Net Zero Leaders", date: "2026-11-18" }),
  createBooking: vi.fn().mockResolvedValue({ success: true }),
  createContactEnquiry: vi.fn().mockResolvedValue({ success: true }),
  getApprovedTestimonials: vi.fn().mockResolvedValue([]),
  getPublishedBlogPosts: vi.fn().mockResolvedValue([{ id: 1, slug: "a-post" }]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(undefined),
  getBlogPostCount: vi.fn().mockResolvedValue(1),
  adminListSessions: vi.fn().mockResolvedValue([]), adminCreateSession: vi.fn(), adminUpdateSession: vi.fn(), adminDeleteSession: vi.fn(),
  adminListBookings: vi.fn().mockResolvedValue([]), adminSetBookingStatus: vi.fn(), adminListEnquiries: vi.fn().mockResolvedValue([]), adminSetEnquiryHandled: vi.fn(),
}));
vi.mock("./_core/notification", () => ({ notifyOwner: vi.fn().mockResolvedValue(true) }));

const caller = appRouter.createCaller({ req: { headers: {} } as never, res: {} as never });
const enquiry = { firstName: "Jane", lastName: "Doe", email: "jane@example.com", message: "We need a carbon reduction plan." };
const booking = { sessionId: 1, firstName: "Jane", lastName: "Doe", email: "jane@example.com", organisation: "Acme", participants: 2 };

beforeEach(() => vi.clearAllMocks());

describe("contact.submitEnquiry", () => {
  it("saves the enquiry and emails the owner", async () => {
    await expect(caller.contact.submitEnquiry(enquiry)).resolves.toEqual({ success: true });
    expect(db.createContactEnquiry).toHaveBeenCalledOnce();
    expect(notifyOwner).toHaveBeenCalledWith(expect.objectContaining({ replyTo: "jane@example.com" }));
  });
  it("silently discards submissions that fill the hidden field", async () => {
    await expect(caller.contact.submitEnquiry({ ...enquiry, website: "http://spam" })).resolves.toEqual({ success: true });
    expect(db.createContactEnquiry).not.toHaveBeenCalled();
    expect(notifyOwner).not.toHaveBeenCalled();
  });
  it("rejects an invalid email and a too-short message", async () => {
    await expect(caller.contact.submitEnquiry({ ...enquiry, email: "nope" })).rejects.toThrow();
    await expect(caller.contact.submitEnquiry({ ...enquiry, message: "hi" })).rejects.toThrow();
  });
  it("rejects an unknown service interest", async () => {
    await expect(caller.contact.submitEnquiry({ ...enquiry, serviceInterest: "scope_3" as never })).rejects.toThrow();
  });
});

describe("training.createBooking", () => {
  it("books and emails the owner", async () => {
    await expect(caller.training.createBooking(booking)).resolves.toEqual({ success: true });
    expect(notifyOwner).toHaveBeenCalledOnce();
  });
  it("passes on the reason when the course is full", async () => {
    vi.mocked(db.createBooking).mockRejectedValueOnce(new Error("This course date is now full"));
    await expect(caller.training.createBooking(booking)).rejects.toThrow("This course date is now full");
    expect(notifyOwner).not.toHaveBeenCalled();
  });
  it("rejects more than 12 participants", async () => {
    await expect(caller.training.createBooking({ ...booking, participants: 13 })).rejects.toThrow();
  });
});

describe("blog", () => {
  it("lists posts with a total", async () => {
    await expect(caller.blog.getPosts({ limit: 3, offset: 0 })).resolves.toEqual({ posts: [{ id: 1, slug: "a-post" }], total: 1 });
  });
  it("returns null for an unknown post", async () => {
    await expect(caller.blog.getPost({ slug: "missing" })).resolves.toBeNull();
  });
});

describe("admin", () => {
  it("refuses admin data without a signed-in session", async () => {
    await expect(caller.admin.listEnquiries()).rejects.toThrow("Please sign in");
    await expect(caller.admin.listBookings()).rejects.toThrow("Please sign in");
    await expect(caller.admin.deleteSession({ id: 1 })).rejects.toThrow("Please sign in");
  });
  it("refuses a forged cookie", async () => {
    const forged = appRouter.createCaller({ req: { headers: { cookie: "nzi_admin=9999999999999.deadbeef" } } as never, res: {} as never });
    await expect(forged.admin.listEnquiries()).rejects.toThrow("Please sign in");
  });
});
