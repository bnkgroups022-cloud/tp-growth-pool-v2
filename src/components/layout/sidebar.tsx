import { NAV_ITEMS, ADMIN_NAV_ITEMS, siteConfig } from '@/lib/config/site';
import { NavLink } from './nav-link';
import { SignOutButton } from './sign-out-button';
import { Icon } from '@/components/ui/icon';

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-base-950/60 px-4 py-6 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-cyan text-sm font-bold text-white shadow-glow-accent">
          TP
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-white">{siteConfig.name}</p>
          <p className="text-xs leading-tight text-white/40">{siteConfig.brand}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {isAdmin ? (
          <>
            <p className="mb-1 mt-6 px-3.5 text-xs font-semibold uppercase tracking-wider text-white/30">
              Admin
            </p>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        ) : null}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-4">
        {isAdmin ? (
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-accent-500/10 px-3.5 py-2 text-xs text-accent-200">
            <Icon name="shield" className="h-3.5 w-3.5" /> Admin access
          </div>
        ) : null}
        <SignOutButton variant="sidebar" />
      </div>
    </aside>
  );
}
