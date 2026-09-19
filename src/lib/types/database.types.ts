// Hand-written to mirror supabase/migrations/*.sql exactly.
// Once the Supabase project exists, replace by running:
//   npm run db:types   (requires SUPABASE_PROJECT_ID env var + `supabase login`)
// Keep the shape identical so nothing downstream needs to change.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          full_name: string | null;
          role: 'user' | 'admin';
          status: 'active' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          balance: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['wallets']['Row']>;
        Update: Partial<Database['public']['Tables']['wallets']['Row']>;
      };
      business_types: {
        Row: {
          id: string;
          key: string;
          name: string;
          tagline: string | null;
          is_active: boolean;
          sort_order: number;
        };
        Insert: Partial<Database['public']['Tables']['business_types']['Row']>;
        Update: Partial<Database['public']['Tables']['business_types']['Row']>;
      };
      business_selections: {
        Row: {
          id: string;
          user_id: string;
          business_type_id: string;
          status: 'active' | 'inactive';
          selected_at: string;
        };
        Insert: Partial<Database['public']['Tables']['business_selections']['Row']> & {
          user_id: string;
          business_type_id: string;
        };
        Update: Partial<Database['public']['Tables']['business_selections']['Row']>;
      };
      wallet_transactions: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string;
          type: 'deposit' | 'withdrawal' | 'adjustment';
          direction: 'credit' | 'debit';
          amount: string;
          status: 'pending' | 'completed' | 'rejected' | 'cancelled';
          method: string | null;
          reference: string | null;
          note: string | null;
          created_by: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        // Omit + intersect, not `Partial<Row> & {...}` — intersecting an
        // object type with a *different* type for a property it already
        // has doesn't override that property, it narrows it (TypeScript
        // computes `(string | undefined) & (string | number)` as `string`,
        // silently dropping `number`). Omitting the keys we're widening
        // from the Partial<Row> base first is what actually makes `amount`
        // accept the coerced `number` that lib/actions/{wallet,admin}.ts
        // insert.
        Insert: Partial<
          Omit<Database['public']['Tables']['wallet_transactions']['Row'], 'type' | 'amount'>
        > & {
          type: 'deposit' | 'withdrawal' | 'adjustment';
          amount: string | number;
        };
        Update: Partial<Database['public']['Tables']['wallet_transactions']['Row']>;
      };
      activity_feed: {
        Row: {
          id: string;
          type: 'signup' | 'business_join' | 'deposit_completed' | 'withdrawal_completed';
          message: string;
          metadata: Json;
          is_public: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['activity_feed']['Row']>;
        Update: Partial<Database['public']['Tables']['activity_feed']['Row']>;
      };
      admin_actions: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_user_id: string | null;
          target_transaction_id: string | null;
          meta: Json;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['admin_actions']['Row']>;
        Update: Partial<Database['public']['Tables']['admin_actions']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { uid?: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'user' | 'admin';
      account_status: 'active' | 'suspended';
      transaction_type: 'deposit' | 'withdrawal' | 'adjustment';
      transaction_direction: 'credit' | 'debit';
      transaction_status: 'pending' | 'completed' | 'rejected' | 'cancelled';
      business_selection_status: 'active' | 'inactive';
      activity_type: 'signup' | 'business_join' | 'deposit_completed' | 'withdrawal_completed';
    };
  };
}
