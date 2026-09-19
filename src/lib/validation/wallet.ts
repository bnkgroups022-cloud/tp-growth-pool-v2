import { z } from 'zod';

const amount = z
  .coerce.number({ invalid_type_error: 'Enter a valid amount' })
  .positive('Amount must be greater than zero')
  .max(1_000_000, 'Amount is too large')
  .refine((n) => Math.round(n * 100) === n * 100, 'Use at most 2 decimal places');

export const depositSchema = z.object({
  amount,
  method: z.enum(['bank_transfer', 'card', 'upi', 'crypto'], {
    errorMap: () => ({ message: 'Select a deposit method' }),
  }),
  reference: z.string().trim().max(120).optional().or(z.literal('')),
});

export const withdrawSchema = z.object({
  amount,
  method: z.enum(['bank_transfer', 'upi', 'crypto'], {
    errorMap: () => ({ message: 'Select a withdrawal method' }),
  }),
  reference: z.string().trim().max(120).optional().or(z.literal('')),
});

export const reviewTransactionSchema = z.object({
  transactionId: z.string().uuid(),
  decision: z.enum(['completed', 'rejected']),
  note: z.string().trim().max(240).optional().or(z.literal('')),
});

export const adjustmentSchema = z.object({
  userId: z.string().uuid(),
  amount,
  direction: z.enum(['credit', 'debit']),
  note: z.string().trim().min(3, 'A note is required for manual adjustments').max(240),
});
