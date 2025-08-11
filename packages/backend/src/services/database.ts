import { createClient, SupabaseClient } from '@supabase/supabase-js';
type Item = any;
type ItemsResponse = any;
type ItemResponse = any;

export class DatabaseService {
  private readonly tableName = 'items';
  private supabase: SupabaseClient | null = null;

  private getClient(): SupabaseClient {
    if (!this.supabase) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration. Please check your environment variables.');
      }

      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    return this.supabase;
  }

  canInitialize(): boolean {
    return this.getClient() !== null;
  }

  
  async initializeSampleData(): Promise<void> {

  }
}

 export const databaseService = new DatabaseService();
