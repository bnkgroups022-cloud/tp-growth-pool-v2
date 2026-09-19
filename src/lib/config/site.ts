import type { LucideIconName } from '@/lib/types/domain';

export const siteConfig = {
  name: 'TP Growth Pool',
  shortName: 'Growth Pool',
  brand: 'Trading Point',
  description: 'Trading Point member platform — wallet, business tracking, and live activity in one place.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  themeColor: '#050a17',
};

/**
 * Business verticals. Only `trading` ships enabled in v1.0 — the rest are
 * declared here (disabled) so Phase‑2 modules slot into the same schema,
 * business-selection UI, and admin panel without a rewrite.
 */
export const BUSINESS_MODULES = [
  {
    key: 'trading',
    name: 'Trading',
    tagline: 'Participate in Trading Point managed trading pools.',
    enabled: true,
  },
  {
    key: 'investing',
    name: 'Investing',
    tagline: 'Long-horizon portfolio programs.',
    enabled: false,
  },
  {
    key: 'real_estate',
    name: 'Real Estate',
    tagline: 'Property-backed growth pools.',
    enabled: false,
  },
  {
    key: 'ai_business',
    name: 'AI Business',
    tagline: 'AI-operated micro business pools.',
    enabled: false,
  },
  {
    key: 'digital_marketing',
    name: 'Digital Marketing',
    tagline: 'Performance-marketing pools.',
    enabled: false,
  },
] as const;

export type BusinessModuleKey = (typeof BUSINESS_MODULES)[number]['key'];

export const NAV_ITEMS: { href: string; label: string; icon: LucideIconName }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { href: '/wallet', label: 'Wallet', icon: 'wallet' },
  { href: '/business', label: 'Business', icon: 'briefcase' },
  { href: '/activity', label: 'Activity', icon: 'activity' },
];

export const ADMIN_NAV_ITEMS: { href: string; label: string; icon: LucideIconName }[] = [
  { href: '/admin', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/transactions', label: 'Approvals', icon: 'list-checks' },
];
