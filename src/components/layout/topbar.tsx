import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { formatCurrency } from '@/lib/utils/currency';
import { SignOutButton } from './sign-out-button';
import type { Wallet } from '@/lib/types/domain';

export function Topbar({ wallet, title }: { wallet: Wallet | null; title: string }) {
  return (
    <header className="safe-top sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-base-950/70 px-5 py-4 backdrop-blur-xl">
      <h1 className="text-base font-semibold text-white">{title}</h1>

      <div className="flex items-center gap-2">
        <Link
          href="/wallet"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/[0.09]"
        >
          <Icon name="wallet" className="h-4 w-4 text-accent-300" />
          {wallet ? formatCurrency(wallet.balance, wallet.currency) : '—'}
        </Link>
        {/* Sidebar already exposes sign-out on desktop; mobile has no sidebar, so surface it here. */}
        <div className="md:hidden">
          <SignOutButton iconOnly />
        </div>
      </div>
    </header>
  );
}
