import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OtpVerifyForm } from '@/components/forms/otp-verify-form';

export const metadata: Metadata = { title: 'Verify code' };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  if (!phone) redirect('/login');

  return <OtpVerifyForm phone={phone} />;
}
