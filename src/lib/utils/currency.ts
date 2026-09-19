const DEFAULT_CURRENCY = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'USD';

/** Format a numeric amount (or numeric-string from Postgres `numeric`) as currency. */
export function formatCurrency(amount: number | string, currency: string = DEFAULT_CURRENCY) {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Signed currency string for ledger rows, e.g. "+ $250.00" / "− $40.00". */
export function formatSignedCurrency(amount: number | string, direction: 'credit' | 'debit', currency?: string) {
  const formatted = formatCurrency(amount, currency);
  return direction === 'credit' ? `+ ${formatted}` : `− ${formatted}`;
}
