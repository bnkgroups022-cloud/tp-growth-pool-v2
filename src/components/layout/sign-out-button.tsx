'use client';

import { useTransition } from 'react';
import { signOut } from '@/lib/actions/auth';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

export function SignOutButton({
  variant = 'sidebar',
  iconOnly = false,
}: {
  variant?: 'sidebar' | 'menu';
  iconOnly?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Sign out"
      onClick={() => startTransition(() => signOut())}
      className={cn(
        'flex items-center gap-3 rounded-xl text-sm font-medium text-white/50 transition-colors hover:bg-white/[0.05] hover:text-white/85 disabled:opacity-50',
        iconOnly ? 'h-10 w-10 justify-center rounded-full bg-white/[0.05]' : 'w-full px-3.5 py-2.5',
        variant === 'menu' && 'justify-start'
      )}
    >
      <Icon name={pending ? 'loader' : 'log-out'} className={cn('h-[1.125rem] w-[1.125rem]', pending && 'animate-spin')} />
      {iconOnly ? null : 'Sign out'}
    </button>
  );
}
