jest.mock('../../src/db/operations', () => ({
  getRoleById: jest.fn(),
  getIdByEmail: jest.fn(),
}));

// Mock the Google OAuth2Client
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));



import { auth, verifyGoogleToken } from '../../controllers/google-auth';
import { getRole, getId } from '../../services/db/operation'; 
// Mock the necessary database functions

describe('Google Auth Functions', () => {
  const clientId = process.env.CLIENT_ID;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for verifyGoogleToken
  describe('verifyGoogleToken', () => {
    it('should return email when token is valid', async () => {
      const fakeTicket = {
        getPayload: () => ({ email: 'user@example.com' }),
      };

      mockVerifyIdToken.mockResolvedValue(fakeTicket);

      const email = await verifyGoogleToken('valid-token');
      expect(email).toBe('user@example.com');
      expect(mockVerifyIdToken).toHaveBeenCalledWith({
        idToken: 'valid-token',
        audience: clientId,
      });
    });

    it('should return undefined when no email in payload', async () => {
      const fakeTicket = {
        getPayload: () => ({}),
      };

      mockVerifyIdToken.mockResolvedValue(fakeTicket);

      const email = await verifyGoogleToken('valid-token');
      expect(email).toBeUndefined();
    });

    it('should throw error when token verification fails', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Token invalid'));

      await expect(verifyGoogleToken('invalid-token')).rejects.toThrow(
        /Invalid token: Token invalid/
      );
    });
    it('should throw error when payload is missing', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => null,
      });

      await expect(verifyGoogleToken('valid-token')).rejects.toThrow(
        'Token payload is missing'
      );
    });
  });

  // Test for auth
  describe('auth', () => {
    it('should return true when user is valid and has a role', async () => {
      // Mock Google token verification
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ email: 'user@example.com' }),
      });
      
      // Mock database calls
      (getIdByEmail as jest.Mock).mockResolvedValue('user-id');
      (getRoleById as jest.Mock).mockResolvedValue('admin');

      const result = await auth('valid-token');
      expect(result).toBe(true);
      expect(getIdByEmail).toHaveBeenCalledWith('user@example.com');
      expect(getRoleById).toHaveBeenCalledWith('user-id');
    });

    it('should return false when user has no role', async () => {
      // Mock Google token verification
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ email: 'user@example.com' }),
      });

      // Mock database calls
      (getIdByEmail as jest.Mock).mockResolvedValue('user-id');
      (getRoleById as jest.Mock).mockResolvedValue(null);

      const result = await auth('valid-token');
      expect(result).toBe(false);
    });

    it('should throw error if user is not found', async () => {
      // Mock Google token verification
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({ email: 'user@example.com' }),
      });

      // Mock database calls
      (getIdByEmail as jest.Mock).mockResolvedValue(null);

      await expect(auth('valid-token')).rejects.toThrow('User not found');
    });

    it('should throw error if unable to verify token', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Token invalid'));

      await expect(auth('invalid-token')).rejects.toThrow(
        'Invalid token: Token invalid'
      );
    });

    it('should throw error if user email extraction fails', async () => {
      // Mock token verification with no payload
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => ({}),
      });

      await expect(auth('valid-token')).rejects.toThrow(
        'Failed to extract user email from token'
      );
    });
  });
});
