import { z } from 'zod';

// E.164 phone number, e.g. +14155551234. Matches what Supabase Auth's
// phone provider expects.
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, 'Enter your phone number in international format, e.g. +14155551234');

export const otpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code we sent you');

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  token: otpCodeSchema,
});
