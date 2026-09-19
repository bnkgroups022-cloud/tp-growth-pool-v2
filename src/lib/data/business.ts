import type { TypedSupabaseClient } from '@/lib/supabase/server';
import type { BusinessType } from '@/lib/types/domain';

export async function getBusinessCatalog(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase.from('business_types').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as BusinessType[];
}

export async function getUserBusinessSelectionIds(supabase: TypedSupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('business_selections')
    .select('business_type_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => r.business_type_id));
}
