import type { LucideIconName } from '@/lib/types/domain';
import { Icon } from './icon';

export function EmptyState({
  icon = 'sparkles',
  title,
  description,
}: {
  icon?: LucideIconName;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-white/50">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-medium text-white/80">{title}</p>
        {description ? <p className="mt-1 max-w-xs text-sm text-white/45">{description}</p> : null}
      </div>
    </div>
  );
}
