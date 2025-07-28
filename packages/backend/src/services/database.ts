import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class DatabaseService {
  private readonly tableName = 'BaseUser';
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

  async getAllItems(): Promise<Object[]> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .order('firstName', { ascending: true });

      if (error) {
        console.error('Database error fetching items:', error);
        throw new Error('Failed to fetch items from database');
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllItems:', error);
      throw error;
    }
  }

  async getItemById(id: string): Promise<Object | null> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Item not found
        }
        console.error('Database error fetching item:', error);
        throw new Error('Failed to fetch item from database');
      }

      return data;
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw error;
    }
  }

  async createItem(item: Omit<Object, 'id'>): Promise<Object> {
    try {
      const { data, error } = await this.getClient()
        .from(this.tableName)
        .insert([item])
        .select()
        .single();

      if (error) {
        console.error('Database error creating item:', error);
        throw new Error('Failed to create item in database');
      }

      return data;
    } catch (error) {
      console.error('Error in createItem:', error);
      throw error;
    }
  }

  // Initialize database with sample data if empty
  async initializeSampleData(): Promise<void> {
    try {
      const items = await this.getAllItems();
      console.log({items});
      
      if (items.length === 0) {
        console.log('Initializing database with sample data...');
        
        const sampleItems = [
          { id: 4, created_at: '2025-07-24T08:26:54+00:00' },
          { id: 5, created_at: '2025-07-22T08:27:18+00:00' },
          { id: 3, created_at: '2025-07-20T08:27:29+00:00' }
        ];

        for (const item of sampleItems) {
          await this.createItem(item);
        }
        
        console.log('Sample data initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize sample data:', error);
      // Don't throw the error, just log it
    }
  }
}

export const databaseService = new DatabaseService();