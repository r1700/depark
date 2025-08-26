import * as operation from '../../services/db/operation';
jest.mock('../../services/db/operation');

const mockedOperation = operation as jest.Mocked<typeof operation>;

beforeEach(() => {
  jest.clearAllMocks();
});

mockedOperation.getId.mockImplementation(async (email: string) => {
  if (email === 'notfound@example.com') return undefined; // case 401
  if (email === 'error@example.com') throw new Error('DB crashed!'); // case 500
  if (email === 'test@example.com') return 7; // case 200
  return undefined;
});

mockedOperation.getRole.mockImplementation(async (id: string) => {
  if (id === '7') {
    return {
      id: 7,
      email: 'a@b.com',
      first_name: 'A',
      last_name: 'B',
      password_hash: 'hash',
      permissions: ['read'],
      role: 2
    };
  }
  return undefined;
});

describe('operation.getId', () => {
  it('should return 7 for test@example.com', async () => {
    const id = await mockedOperation.getId('test@example.com');
    expect(id).toBe(7);
  });

  it('should return undefined for notfound@example.com', async () => {
    const id = await mockedOperation.getId('notfound@example.com');
    expect(id).toBeUndefined();
  });

  it('should throw error for error@example.com', async () => {
    await expect(mockedOperation.getId('error@example.com')).rejects.toThrow('DB crashed!');
  });
});

describe('operation.getRole', () => {
  it('should return user object for id "7"', async () => {
    const user = await mockedOperation.getRole('7');
    expect(user).toMatchObject({
      id: 7,
      email: 'a@b.com',
      first_name: 'A',
      last_name: 'B',
      password_hash: 'hash',
      permissions: ['read'],
      role: 2
    });
  });

  it('should return undefined for unknown id', async () => {
    const user = await mockedOperation.getRole('999');
    expect(user).toBeUndefined();
  });
});