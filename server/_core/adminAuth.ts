/**
 * Admin sign-in: one shared password (ADMIN_PASSWORD), exchanged for a signed,
 * HttpOnly cookie that lasts 12 hours. Changing the password signs everyone out.
 */
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { ENV } from "./env";

const COOKIE = "nzi_admin";
const LIFETIME_MS = 12 * 60 * 60 * 1000;

export const adminEnabled = () => ENV.adminPassword.length >= 10;

const digest = (value: string) => createHash("sha256").update(value).digest();
const sign = (expires: string) => createHmac("sha256", digest(`nzi-admin:${ENV.adminPassword}`)).update(expires).digest("hex");

export function checkPassword(candidate: string) {
  return adminEnabled() && timingSafeEqual(digest(candidate), digest(ENV.adminPassword));
}

export function isAdminRequest(req: Request) {
  if (!adminEnabled()) return false;
  const raw = (req.headers.cookie ?? "").split(";").map(c => c.trim()).find(c => c.startsWith(`${COOKIE}=`));
  if (!raw) return false;
  const [expires, signature] = raw.slice(COOKIE.length + 1).split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

const cookieOptions = () => ({ httpOnly: true, secure: ENV.isProduction, sameSite: "strict" as const, path: "/" });

export function startAdminSession(res: Response) {
  const expires = String(Date.now() + LIFETIME_MS);
  res.cookie(COOKIE, `${expires}.${sign(expires)}`, { ...cookieOptions(), maxAge: LIFETIME_MS });
}

export function endAdminSession(res: Response) {
  res.clearCookie(COOKIE, cookieOptions());
}
