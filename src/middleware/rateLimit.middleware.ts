import { Request, Response, NextFunction } from "express";

// In-memory store for rate limiting (for production, use Redis or similar)
const loginAttempts: Record<string, { count: number; lastAttempt: number }> =
  {};
const otpAttempts: Record<string, { count: number; lastAttempt: number }> = {};

const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_LOGIN_ATTEMPTS = 5;
const MAX_OTP_ATTEMPTS = 5;

function getKey(ip: string | undefined): string {
  return ip || "unknown";
}

export function rateLimitLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = getKey(req.ip);
  const now = Date.now();
  if (
    !loginAttempts[ip] ||
    now - loginAttempts[ip]!.lastAttempt > WINDOW_SIZE
  ) {
    loginAttempts[ip] = { count: 1, lastAttempt: now };
    return next();
  }
  loginAttempts[ip]!.count++;
  loginAttempts[ip]!.lastAttempt = now;
  if (loginAttempts[ip]!.count > MAX_LOGIN_ATTEMPTS) {
    res
      .status(429)
      .json({ error: "Too many login attempts. Please try again later." });
    return;
  }
  next();
}

export function rateLimitOtp(req: Request, res: Response, next: NextFunction) {
  const ip = getKey(req.ip);
  const now = Date.now();
  if (!otpAttempts[ip] || now - otpAttempts[ip]!.lastAttempt > WINDOW_SIZE) {
    otpAttempts[ip] = { count: 1, lastAttempt: now };
    return next();
  }
  otpAttempts[ip]!.count++;
  otpAttempts[ip]!.lastAttempt = now;
  if (otpAttempts[ip]!.count > MAX_OTP_ATTEMPTS) {
    res
      .status(429)
      .json({ error: "Too many OTP requests. Please try again later." });
    return;
  }
  next();
}
