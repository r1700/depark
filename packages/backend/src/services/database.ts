import { Client } from 'pg';

export class DatabaseService {
  private readonly tableName = 'ParkingSessions';
  private client: Client | null = null;

  private getClient(): Client {
    if (!this.client) {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new Error('Missing PostgreSQL configuration. Please check your environment variables.');
      }

      this.client = new Client({
        connectionString: databaseUrl,
      });

      // Connect to the PostgreSQL database
      this.client.connect().catch((err) => {
        console.error('Failed to connect to PostgreSQL:', err);
        throw new Error('Failed to connect to PostgreSQL database');
      });
    }
    return this.client;
  }

  canInitialize(): boolean {
    return this.client !== null;
  }

  async getAllItems(): Promise<Object[]> {
    try {
      const res = await this.getClient().query(`SELECT * FROM ${this.tableName} ORDER BY created_at ASC`);
      return res.rows || [];
    } catch (error) {
      console.error('Error in getAllItems:', error);
      throw new Error('Failed to fetch items from database');
    }
  }

  async getItemById(id: string): Promise<Object | null> {
    try {
      const res = await this.getClient().query(
        `SELECT * FROM ${this.tableName} WHERE id = $1 LIMIT 1`,
        [id]
      );

      if (res.rowCount === 0) {
        return null; // Item not found
      }

      return res.rows[0];
    } catch (error) {
      console.error('Error in getItemById:', error);
      throw new Error('Failed to fetch item from database');
    }
  }

  async createItem(item: Omit<Object, 'id'>): Promise<Object> {
    try {
      const { name, type, amount } = item as any; // Explicit casting to extract fields
      const res = await this.getClient().query(
        `INSERT INTO ${this.tableName} (name, type, amount) VALUES ($1, $2, $3) RETURNING *`,
        [name, type, amount]
      );

      return res.rows[0];
    } catch (error) {
      console.error('Error in createItem:', error);
      throw new Error('Failed to create item in database');
    }
  }

  // Initialize database with sample data if empty
  async initializeSampleData(): Promise<void> {
    try {
      const items = await this.getAllItems();
      
      if (items.length === 0) {
        console.log('Initializing database with sample data...');
        
        const sampleItems = [
          { name: 'Laptop', type: 'Electronics', amount: 1200 },
          { name: 'Coffee Beans', type: 'Food', amount: 25 },
          { name: 'Office Chair', type: 'Furniture', amount: 350 },
          { name: 'Notebook', type: 'Stationery', amount: 15 }
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

  // Close PostgreSQL connection when done
  async closeConnection(): Promise<void> {
    try {
      if (this.client) {
        await this.client.end();
        this.client = null;
        console.log('PostgreSQL connection closed');
      }
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
}

export const databaseService = new DatabaseService();
