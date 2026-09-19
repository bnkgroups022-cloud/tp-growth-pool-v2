'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { GlassPanel } from '@/components/ui/glass-panel';
import { formatCurrency } from '@/lib/utils/currency';

interface Point {
  date: string;
  balance: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const date = label ? new Date(label) : null;
  return (
    <div className="rounded-lg border border-white/10 bg-base-800/95 px-3 py-2 text-xs shadow-glass">
      <p className="text-white/50">
        {date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </p>
      <p className="mt-0.5 font-semibold text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export function WalletTrendChart({ data, currency }: { data: Point[]; currency: string }) {
  const isFlat = data.every((p) => p.balance === data[0]?.balance);

  return (
    <GlassPanel className="p-5 md:p-6">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Wallet balance trend</h3>
        <span className="text-xs text-white/40">Last {data.length} days</span>
      </div>
      <div className="mt-4 h-48">
        {isFlat ? (
          <div className="flex h-full items-center justify-center text-sm text-white/35">
            Your balance history will chart here once transactions complete.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ea1ff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4ea1ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(d: string) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#4ea1ff"
                strokeWidth={2}
                fill="url(#balanceFill)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: '#4ea1ff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="mt-1 text-xs text-white/30">{currency} · completed transactions only</p>
    </GlassPanel>
  );
}
