import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { SERVICE_INTERESTS } from "../drizzle/schema";
import {
  getUpcomingTrainingSessions,
  getTrainingSessionById,
  createBooking,
  createContactEnquiry,
  getApprovedTestimonials,
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getBlogPostCount,
} from "./db";

// "website" is a hidden honeypot field. Real visitors never see or fill it; bots do.
const honeypot = { website: z.string().max(200).optional() };

export const appRouter = router({
  training: router({
    getSessions: publicProcedure.query(() => getUpcomingTrainingSessions()),
    getSession: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getTrainingSessionById(input.id)),
    createBooking: publicProcedure
      .input(z.object({
        sessionId: z.number(),
        firstName: z.string().trim().min(1).max(100),
        lastName: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(320),
        organisation: z.string().trim().min(1).max(255),
        phone: z.string().trim().max(30).optional(),
        jobTitle: z.string().trim().max(150).optional(),
        participants: z.number().int().min(1).max(12).default(1),
        specialRequirements: z.string().trim().max(2000).optional(),
        ...honeypot,
      }))
      .mutation(async ({ input }) => {
        const { website, ...data } = input;
        if (website) return { success: true } as const;
        let result;
        try {
          result = await createBooking(data);
        } catch (error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "Booking failed" });
        }
        const session = await getTrainingSessionById(data.sessionId);
        await notifyOwner({
          title: `New training booking — ${data.organisation}`,
          replyTo: data.email,
          content: `New booking for ${session?.title} on ${session?.date}\n\nName: ${data.firstName} ${data.lastName}\nJob title: ${data.jobTitle || "Not provided"}\nOrganisation: ${data.organisation}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nParticipants: ${data.participants}\nRequirements: ${data.specialRequirements || "None"}`,
        });
        return result;
      }),
  }),

  contact: router({
    submitEnquiry: publicProcedure
      .input(z.object({
        firstName: z.string().trim().min(1).max(100),
        lastName: z.string().trim().min(1).max(100),
        email: z.string().trim().email().max(320),
        organisation: z.string().trim().max(255).optional(),
        phone: z.string().trim().max(30).optional(),
        serviceInterest: z.enum(SERVICE_INTERESTS).default("general"),
        message: z.string().trim().min(10).max(5000),
        ...honeypot,
      }))
      .mutation(async ({ input }) => {
        const { website, ...data } = input;
        if (website) return { success: true } as const;
        const result = await createContactEnquiry(data);
        await notifyOwner({
          title: `New website enquiry — ${data.firstName} ${data.lastName}`,
          replyTo: data.email,
          content: `New enquiry from ${data.firstName} ${data.lastName}\n\nOrganisation: ${data.organisation || "Not provided"}\nEmail: ${data.email}\nPhone: ${data.phone || "Not provided"}\nService interest: ${data.serviceInterest}\n\nMessage:\n${data.message}`,
        });
        return result;
      }),
  }),

  testimonials: router({
    getApproved: publicProcedure.query(() => getApprovedTestimonials()),
  }),

  blog: router({
    getPosts: publicProcedure
      .input(z.object({ limit: z.number().int().min(1).max(50).default(10), offset: z.number().int().min(0).default(0), category: z.string().max(30).optional() }))
      .query(async ({ input }) => {
        const [posts, total] = await Promise.all([
          getPublishedBlogPosts(input.limit, input.offset, input.category),
          getBlogPostCount(input.category),
        ]);
        return { posts, total };
      }),
    getPost: publicProcedure.input(z.object({ slug: z.string().max(255) })).query(async ({ input }) => (await getBlogPostBySlug(input.slug)) ?? null),
  }),
});

export type AppRouter = typeof appRouter;
