import Link from 'next/link';
import { Icon } from './icon';
import { cn } from '@/lib/utils/cn';

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  searchParams,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', String(p));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-white/50">
      <span>
        Page {page} of {totalPages} · {total} total
      </span>
      <div className="flex gap-2">
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]',
            page <= 1 && 'pointer-events-none opacity-40'
          )}
        >
          <Icon name="chevron-right" className="h-4 w-4 rotate-180" />
        </Link>
        <Link
          href={hrefFor(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08]',
            page >= totalPages && 'pointer-events-none opacity-40'
          )}
        >
          <Icon name="chevron-right" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
