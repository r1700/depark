import * as operation from '../../services/db/operation';
import { pool } from '../../services/db/connection';

jest.mock('../../services/db/connection', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockPool = pool as jest.Mocked<typeof pool>;

describe('operation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getId returns id', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ id: 42 }] } as any);

    const result = await operation.getId('test@example.com');
    expect(result).toBe(42);
  });

  it('getId returns undefined on error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('fail'));

    await expect(operation.getId('bad@example.com')).resolves.toBeUndefined();
  });

  it('getRole returns role data', async () => {
    const row = {
      role: 2,
      permissions: ['read'],
      password_hash: 'hash',
      first_name: 'A',
      last_name: 'B',
      email: 'a@b.com',
      id: 7,
    };
    mockPool.query.mockResolvedValueOnce({ rows: [row] } as any);

    const result = await operation.getRole('7');
    expect(result).toEqual(row);
  });

  it('getRole returns undefined on error', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('fail'));

    await expect(operation.getRole('7')).resolves.toBeUndefined();
  });
});
