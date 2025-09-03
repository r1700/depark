import { handleCreateOtp, handleVerifyOtp } from '../../src/controllers/otp.controller';
import * as service from '../../src/services/otp.service';
import * as sender from '../../src/utils/otp.sender';

jest.mock('../services/otp.service');
jest.mock('../utils/otp.sender');

const mockReqRes = (body: any = {}) => {
    const req = { body };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    return { req, res };
};

describe('handleCreateOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if contact is missing', async () => {
    const { req, res } = mockReqRes();
    await handleCreateOtp(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing contact' });
  });

  test('should return 404 if user does not exist', async () => {
    (service.existUser as jest.Mock).mockResolvedValue(false);
    const { req, res } = mockReqRes({ contact: 'test@example.com' });

    await handleCreateOtp(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('should send OTP via email', async () => {
    (service.existUser as jest.Mock).mockResolvedValue(true);
    (service.createOtp as jest.Mock).mockResolvedValue('ABC123');
    (sender.sendOtpEmail as jest.Mock).mockResolvedValue(true);

    const { req, res } = mockReqRes({ contact: 'user@test.com' });
    await handleCreateOtp(req as any, res as any);

    expect(sender.sendOtpEmail).toHaveBeenCalledWith('user@test.com', 'ABC123');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('should send OTP via sms', async () => {
    (service.existUser as jest.Mock).mockResolvedValue(true);
    (service.createOtp as jest.Mock).mockResolvedValue('ABC123');
    (sender.sendOtpSms as jest.Mock).mockResolvedValue(true);

    const { req, res } = mockReqRes({ contact: '0501234567' });
    await handleCreateOtp(req as any, res as any);

    expect(sender.sendOtpSms).toHaveBeenCalledWith('0501234567', 'ABC123');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('handleVerifyOtp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if fields are missing', async () => {
    const { req, res } = mockReqRes({ contact: 'x' });
    await handleVerifyOtp(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('should return 401 if OTP invalid', async () => {
    (service.verifyOtp as jest.Mock).mockResolvedValue(false);
    const { req, res } = mockReqRes({ contact: 'x', otp: '123' });

    await handleVerifyOtp(req as any, res as any);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('should return 200 and token if OTP valid', async () => {
    (service.verifyOtp as jest.Mock).mockResolvedValue(true);
    (service.userIdByContact as jest.Mock).mockResolvedValue('123');

    const { req, res } = mockReqRes({ contact: 'x', otp: '123456' });
    await handleVerifyOtp(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'OTP verified',
        token: expect.any(String),
        user: {
          id: '123',
          contact: 'x'
        }
      })
    );
  });
});



