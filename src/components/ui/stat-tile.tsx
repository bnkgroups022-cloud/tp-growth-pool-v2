import type { ReactNode } from 'react';
import { GlassPanel } from './glass-panel';
import { Icon } from './icon';
import type { LucideIconName } from '@/lib/types/domain';
import { cn } from '@/lib/utils/cn';

export function StatTile({
  label,
  value,
  icon,
  trend,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  icon: LucideIconName;
  trend?: { value: string; positive: boolean };
  accent?: boolean;
}) {
  return (
    <GlassPanel className="animate-fade-up p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-white/55">{label}</span>
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            accent ? 'bg-accent-500/20 text-accent-300' : 'bg-white/[0.06] text-white/60'
          )}
        >
          <Icon name={icon} className="h-[1.125rem] w-[1.125rem]" />
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</div>
      {trend ? (
        <div
          className={cn(
            'mt-2 inline-flex items-center gap-1 text-xs font-medium',
            trend.positive ? 'text-success' : 'text-danger'
          )}
        >
          <Icon name={trend.positive ? 'arrow-up-right' : 'arrow-down-left'} className="h-3.5 w-3.5" />
          {trend.value}
        </div>
      ) : null}
    </GlassPanel>
  );
}
