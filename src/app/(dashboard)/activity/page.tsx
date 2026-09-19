import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getRecentActivity } from '@/lib/data/activity';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export const metadata: Metadata = { title: 'Live activity' };

export default async function ActivityPage() {
  const supabase = await createClient();
  const activity = await getRecentActivity(supabase, 50);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white">Live activity</h2>
        <p className="mt-1 text-sm text-white/50">A real-time, anonymized feed of platform-wide activity.</p>
      </div>
      <ActivityFeed initialItems={activity} />
    </div>
  );
}
