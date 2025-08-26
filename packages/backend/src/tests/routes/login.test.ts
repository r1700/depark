import { getId, getRole } from '../../services/db/operation';
import { Client } from 'pg';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe('DB Operations', () => {
  let mockClient: any;

  beforeEach(() => {
mockClient = (Client as unknown as jest.Mock).mock.instances[0];    mockClient.query.mockReset();
  });

  it('getId returns user id for valid email', async () => {
    mockClient.query.mockResolvedValue({ rows: [{ id: 123 }] });
    const id = await getId('test@example.com');
    expect(id).toBe(123);
    expect(mockClient.query).toHaveBeenCalledWith(
      'SELECT id FROM baseuser WHERE email = $1',
      ['test@example.com']
    );
  });

  it('getRole returns user data for valid id', async () => {
    const userData = {
      role: 'admin',
      permissions: 'all',
      password_hash: 'hash',
      first_name: 'John',
      last_name: 'Doe',
      email: 'test@example.com',
      id: 123,
    };
    mockClient.query.mockResolvedValue({ rows: [userData] });
    const user = await getRole('123');
    expect(user).toEqual(userData);
    expect(mockClient.query).toHaveBeenCalled();
  });

  it('getId returns undefined for missing user', async () => {
    mockClient.query.mockResolvedValue({ rows: [] });
    const id = await getId('missing@example.com');
    expect(id).toBeUndefined();
  });

  it('getRole returns undefined for missing user', async () => {
    mockClient.query.mockResolvedValue({ rows: [] });
    const user = await getRole('999');
    expect(user).toBeUndefined();
  });
});