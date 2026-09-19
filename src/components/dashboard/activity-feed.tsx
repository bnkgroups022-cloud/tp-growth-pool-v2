'use client';

import { useRealtimeActivity } from '@/hooks/use-realtime-activity';
import { GlassPanel } from '@/components/ui/glass-panel';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { formatRelativeTime } from '@/lib/utils/date';
import type { ActivityFeedItem, ActivityType, LucideIconName } from '@/lib/types/domain';

const TYPE_ICON: Record<ActivityType, LucideIconName> = {
  signup: 'sparkles',
  business_join: 'briefcase',
  deposit_completed: 'arrow-down-left',
  withdrawal_completed: 'arrow-up-right',
};

export function ActivityFeed({ initialItems, compact = false }: { initialItems: ActivityFeedItem[]; compact?: boolean }) {
  const items = useRealtimeActivity(initialItems, compact ? 6 : 30);

  return (
    <GlassPanel className={compact ? 'p-5' : 'p-5 md:p-6'}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Live activity</h3>
        <span className="flex items-center gap-1.5 text-xs text-white/40">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
          Live
        </span>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="activity" title="No activity yet" description="Platform-wide activity will appear here in real time." />
      ) : (
        <ul className="space-y-1">
          {items.slice(0, compact ? 6 : undefined).map((item) => (
            <li key={item.id} className="flex items-start gap-3 rounded-xl px-1.5 py-2.5 transition-colors hover:bg-white/[0.03]">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/60">
                <Icon name={TYPE_ICON[item.type]} className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white/80">{item.message}</p>
                <p className="text-xs text-white/35">{formatRelativeTime(item.created_at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
