import { NAV_ITEMS } from '@/lib/config/site';
import { NavLink } from './nav-link';

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex border-t border-white/[0.06] bg-base-950/90 backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} {...item} variant="bottom" />
      ))}
    </nav>
  );
}
