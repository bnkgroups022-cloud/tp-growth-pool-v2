import { cn } from '@/lib/utils/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-lg bg-[length:800px_100%] bg-gradient-to-r from-white/[0.05] via-white/[0.10] to-white/[0.05]',
        className
      )}
    />
  );
}
