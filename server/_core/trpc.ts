import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { isAdminRequest } from "./adminAuth";

const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;

/** Only runs for a browser holding a valid admin session cookie. */
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!isAdminRequest(ctx.req)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Please sign in" });
  return next();
});
