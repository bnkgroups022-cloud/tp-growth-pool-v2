import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent';

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-white/[0.08] text-white/70',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  accent: 'bg-accent-500/15 text-accent-300',
};

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        TONE_CLASSES[tone],
        className
      )}
      {...props}
    />
  );
}

const STATUS_TONE: Record<string, Tone> = {
  active: 'success',
  completed: 'success',
  pending: 'warning',
  suspended: 'danger',
  rejected: 'danger',
  cancelled: 'neutral',
  inactive: 'neutral',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'neutral'}>{status}</Badge>;
}
