'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import type { LucideIconName } from '@/lib/types/domain';
import { cn } from '@/lib/utils/cn';

export function NavLink({
  href,
  label,
  icon,
  variant = 'sidebar',
}: {
  href: string;
  label: string;
  icon: LucideIconName;
  variant?: 'sidebar' | 'bottom';
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  if (variant === 'bottom') {
    return (
      <Link
        href={href}
        className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
        aria-current={active ? 'page' : undefined}
      >
        <Icon
          name={icon}
          className={cn('h-5 w-5 transition-colors', active ? 'text-accent-300' : 'text-white/45')}
        />
        <span className={active ? 'text-accent-300' : 'text-white/45'}>{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
        active ? 'bg-accent-500/15 text-accent-200' : 'text-white/55 hover:bg-white/[0.05] hover:text-white/85'
      )}
    >
      <Icon name={icon} className="h-[1.125rem] w-[1.125rem]" />
      {label}
    </Link>
  );
}
