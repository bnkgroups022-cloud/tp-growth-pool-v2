'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ActivityFeedItem } from '@/lib/types/domain';

/**
 * Live activity feed: starts from server-rendered `initialItems` (so there's
 * no loading flash) and prepends new rows the moment Supabase Realtime
 * broadcasts them — no polling. Requires Realtime to be enabled for the
 * `activity_feed` table (see README.md "Enable Realtime").
 */
export function useRealtimeActivity(initialItems: ActivityFeedItem[], max = 20) {
  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('activity-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_feed' },
        (payload) => {
          const row = payload.new as ActivityFeedItem;
          if (!row.id) return;
          setItems((prev) => [row, ...prev].slice(0, max));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [max]);

  return items;
}
