'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/input';

const STATUS_OPTIONS = ['all', 'pending', 'completed', 'rejected', 'cancelled'];
const TYPE_OPTIONS = ['all', 'deposit', 'withdrawal', 'adjustment'];

export function LedgerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        className="w-auto min-w-[9rem]"
        value={searchParams.get('status') ?? 'all'}
        onChange={(e) => update('status', e.target.value)}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </Select>
      <Select
        className="w-auto min-w-[9rem]"
        value={searchParams.get('type') ?? 'all'}
        onChange={(e) => update('type', e.target.value)}
      >
        {TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t === 'all' ? 'All types' : t[0].toUpperCase() + t.slice(1)}
          </option>
        ))}
      </Select>
    </div>
  );
}
