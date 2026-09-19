import type { Metadata } from 'next';
import { OtpRequestForm } from '@/components/forms/otp-request-form';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  return <OtpRequestForm />;
}
