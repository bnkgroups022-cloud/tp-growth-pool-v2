// Hand-authored domain types that mirror the Postgres enums/tables in
// supabase/migrations. Keep in sync with database.types.ts when the schema
// changes (run `npm run db:types` once the Supabase project exists to
// regenerate database.types.ts from the live schema).

export type AppRole = 'user' | 'admin';

export type TransactionType = 'deposit' | 'withdrawal' | 'adjustment';
export type TransactionDirection = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'rejected' | 'cancelled';

export type ActivityType =
  | 'signup'
  | 'business_join'
  | 'deposit_completed'
  | 'withdrawal_completed';

export interface Profile {
  id: string;
  phone: string | null;
  full_name: string | null;
  role: AppRole;
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  currency: string;
  balance: string; // numeric comes back as string from postgres
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: TransactionType;
  direction: TransactionDirection;
  amount: string;
  status: TransactionStatus;
  method: string | null;
  reference: string | null;
  note: string | null;
  created_by: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessType {
  id: string;
  key: string;
  name: string;
  tagline: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface BusinessSelection {
  id: string;
  user_id: string;
  business_type_id: string;
  status: 'active' | 'inactive';
  selected_at: string;
}

export interface ActivityFeedItem {
  id: string;
  type: ActivityType;
  message: string;
  created_at: string;
}

/** Named icons rendered by <Icon /> — see components/ui/icon.tsx for the SVG paths. */
export type LucideIconName =
  | 'layout-dashboard'
  | 'wallet'
  | 'briefcase'
  | 'activity'
  | 'users'
  | 'list-checks'
  | 'bell'
  | 'arrow-up-right'
  | 'arrow-down-left'
  | 'shield'
  | 'log-out'
  | 'check'
  | 'x'
  | 'plus'
  | 'menu'
  | 'chevron-right'
  | 'phone'
  | 'lock'
  | 'loader'
  | 'trending-up'
  | 'clock'
  | 'sparkles'
  | 'alert-triangle';
