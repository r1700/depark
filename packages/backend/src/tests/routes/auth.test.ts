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

mockedOperation.getRole.mockImplementation(async (id: string | number) => {
  if (id === 7) {
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
