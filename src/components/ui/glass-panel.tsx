import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * The one shared surface every card/tile/panel in the app is built from —
 * this is what gives the "premium dark-blue fintech" glassmorphism look
 * its consistency instead of every screen reinventing it.
 */
export function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl2 border border-white/[0.08]',
        'bg-white/[0.04] backdrop-blur-xl shadow-glass',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-card-sheen',
        className
      )}
      {...props}
    >
      <div className="relative">{children}</div>
    </div>
  );
}
