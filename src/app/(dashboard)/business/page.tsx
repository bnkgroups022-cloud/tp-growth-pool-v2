import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserContext } from '@/lib/data/current-user';
import { getBusinessCatalog, getUserBusinessSelectionIds } from '@/lib/data/business';
import { BusinessCard } from '@/components/dashboard/business-card';

export const metadata: Metadata = { title: 'Business selection' };

export default async function BusinessPage() {
  const supabase = await createClient();
  const { user } = await getCurrentUserContext();

  const [businesses, selectedIds] = await Promise.all([
    getBusinessCatalog(supabase),
    getUserBusinessSelectionIds(supabase, user.id),
  ]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Choose a business</h2>
        <p className="mt-1 text-sm text-white/50">
          Trading is live today — more verticals unlock as Trading Point rolls them out.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} joined={selectedIds.has(business.id)} />
        ))}
      </div>
    </div>
  );
}
