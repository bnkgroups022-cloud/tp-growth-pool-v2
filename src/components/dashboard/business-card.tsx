'use client';

import { useState, useTransition } from 'react';
import { selectBusiness } from '@/lib/actions/business';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import type { BusinessType } from '@/lib/types/domain';

export function BusinessCard({ business, joined }: { business: BusinessType; joined: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [justJoined, setJustJoined] = useState(false);

  function handleJoin() {
    setError(undefined);
    startTransition(async () => {
      const result = await selectBusiness(business.id);
      if (result.error) setError(result.error);
      else setJustJoined(true);
    });
  }

  const isJoined = joined || justJoined;

  return (
    <GlassPanel className="flex flex-col p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300">
          <Icon name="briefcase" className="h-5 w-5" />
        </span>
        {!business.is_active ? <Badge tone="neutral">Coming soon</Badge> : isJoined ? <Badge tone="success">Joined</Badge> : null}
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{business.name}</h3>
      <p className="mt-1 flex-1 text-sm text-white/50">{business.tagline}</p>

      <div className="mt-4">
        {business.is_active ? (
          isJoined ? (
            <Button variant="secondary" size="sm" className="w-full" disabled>
              <Icon name="check" className="h-4 w-4" /> Joined
            </Button>
          ) : (
            <Button size="sm" className="w-full" loading={pending} onClick={handleJoin}>
              Join {business.name}
            </Button>
          )
        ) : (
          <Button variant="secondary" size="sm" className="w-full" disabled>
            Coming soon
          </Button>
        )}
        {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      </div>
    </GlassPanel>
  );
}
