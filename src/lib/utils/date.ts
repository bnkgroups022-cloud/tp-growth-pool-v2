/** Absolute date-time, e.g. "19 Sep 2026, 3:45 PM". */
export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Relative time, e.g. "3m ago", "2h ago", "5d ago" — used in the live activity feed. */
export function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const seconds = Math.max(1, Math.round(diffMs / 1000));
  const units: [number, string][] = [
    [60, 's'],
    [60, 'm'],
    [24, 'h'],
    [7, 'd'],
    [4.345, 'w'],
    [12, 'mo'],
    [Number.POSITIVE_INFINITY, 'y'],
  ];
  let value = seconds;
  let label = 's';
  for (const [factor, unit] of units) {
    if (value < factor) {
      label = unit;
      break;
    }
    value = Math.floor(value / factor);
    label = unit;
  }
  if (label === 's' && value < 5) return 'just now';
  return `${value}${label} ago`;
}
