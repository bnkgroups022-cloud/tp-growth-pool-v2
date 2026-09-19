import type { SVGProps } from 'react';
import type { LucideIconName } from '@/lib/types/domain';

/**
 * A small, dependency-free icon set (no icon package required). Every icon
 * used across the app is named here — add new names to LucideIconName in
 * lib/types/domain.ts and a matching path below.
 */
const PATHS: Record<LucideIconName, JSX.Element> = {
  'layout-dashboard': (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.25" fill="currentColor" stroke="none" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
      <path d="M3 12h18" />
    </>
  ),
  activity: <path d="M3 12h4l2.5-7L14 19l2.5-7H21" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M15.75 12.25A5.5 5.5 0 0 1 21.5 18" />
    </>
  ),
  'list-checks': (
    <>
      <path d="M4 6l1.5 1.5L8.5 4.5" />
      <path d="M4 13l1.5 1.5L8.5 11.5" />
      <path d="M4 20l1.5 1.5L8.5 18.5" />
      <path d="M12 6h9" />
      <path d="M12 13h9" />
      <path d="M12 20h9" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  'arrow-up-right': (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  'arrow-down-left': (
    <>
      <path d="M17 7 7 17" />
      <path d="M16 17H7V8" />
    </>
  ),
  shield: <path d="M12 3 5 5.5V11c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V5.5L12 3Z" />,
  'log-out': (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  check: <path d="M4 12.5 9.5 18 20 6" />,
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  phone: <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  loader: (
    <>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M4.2 4.2l2.1 2.1" />
      <path d="M17.7 17.7l2.1 2.1" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M4.2 19.8l2.1-2.1" />
      <path d="M17.7 6.3l2.1-2.1" />
    </>
  ),
  'trending-up': (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 6h6v6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </>
  ),
  'alert-triangle': (
    <>
      <path d="M10.3 4.3a2 2 0 0 1 3.4 0l8 14A2 2 0 0 1 20 21H4a2 2 0 0 1-1.7-2.7l8-14Z" />
      <path d="M12 9.5v4" />
      <path d="M12 17h.01" />
    </>
  ),
};

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
  ...props
}: { name: LucideIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
