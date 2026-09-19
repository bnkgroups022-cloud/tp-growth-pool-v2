import type { TypedSupabaseClient } from '@/lib/supabase/server';
import type { ActivityFeedItem } from '@/lib/types/domain';

export async function getRecentActivity(supabase: TypedSupabaseClient, limit = 12) {
  const { data, error } = await supabase
    .from('activity_feed')
    .select('id, type, message, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as ActivityFeedItem[];
}
