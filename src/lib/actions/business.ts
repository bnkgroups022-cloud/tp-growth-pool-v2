'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from './auth';

/** Join an active business vertical (only `trading` is active in v1.0). */
export async function selectBusiness(businessTypeId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'You need to be signed in.' };

  const { error } = await supabase.from('business_selections').insert({
    user_id: user.id,
    business_type_id: businessTypeId,
  });

  if (error) {
    if (error.code === '23505') {
      // unique(user_id, business_type_id) — already joined, not a failure.
      return {};
    }
    return { error: error.message };
  }

  revalidatePath('/business');
  revalidatePath('/dashboard');
  return {};
}
