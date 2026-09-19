import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUsersList } from '@/lib/data/admin';
import { GlassPanel } from '@/components/ui/glass-panel';
import { StatusBadge, Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { formatDateTime } from '@/lib/utils/date';

export const metadata: Metadata = { title: 'Admin · Users' };

const PAGE_SIZE = 15;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const { rows, count } = await getUsersList(supabase, { search: params.search, page, pageSize: PAGE_SIZE });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-white">Members</h2>
        <form method="GET" className="w-full sm:w-64">
          <Input name="search" defaultValue={params.search} placeholder="Search phone or name" />
        </form>
      </div>

      <GlassPanel className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-6">
            <EmptyState icon="users" title="No members found" description="Try a different search." />
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {rows.map((profile) => (
              <Link
                key={profile.id}
                href={`/admin/users/${profile.id}`}
                className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-sm font-medium text-white/90">{profile.full_name || 'Unnamed member'}</p>
                  <p className="text-xs text-white/40">{profile.phone || '—'} · joined {formatDateTime(profile.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {profile.role === 'admin' ? <Badge tone="accent">Admin</Badge> : null}
                  <StatusBadge status={profile.status} />
                  <Icon name="chevron-right" className="h-4 w-4 text-white/30" />
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="px-5 pb-5">
          <Pagination page={page} pageSize={PAGE_SIZE} total={count} basePath="/admin/users" searchParams={params} />
        </div>
      </GlassPanel>
    </div>
  );
}
