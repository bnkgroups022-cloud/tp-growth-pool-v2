'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setUserStatus } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';

export function SuspendToggle({ userId, status }: { userId: string; status: 'active' | 'suspended' }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const router = useRouter();

  function toggle() {
    setError(undefined);
    startTransition(async () => {
      const next = status === 'active' ? 'suspended' : 'active';
      const result = await setUserStatus(userId, next);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div>
      <Button variant={status === 'active' ? 'danger' : 'secondary'} size="sm" loading={pending} onClick={toggle}>
        {status === 'active' ? 'Suspend member' : 'Reactivate member'}
      </Button>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
