import { sequelize, User, UserSession } from '../model/database-models/user.model';
import {
  createOtp, getOtpEntry, removeOtp,
  verifyOtp, existUser, userIdByContact
} from '../services/otp.service';
import { Op } from 'sequelize';

describe('OTP Service', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  const createUserAndSession = async (contact: string) => {
  const id = `test_user_${Date.now()}`; // יצירת מזהה ייחודי ידני

  const user = await User.create({
    id,
    email: contact.includes('@') ? contact : '',
    phone: contact.includes('@') ? '' : contact,
    firstName: 'Test',
    lastName: 'User',
    department: 'TestDept',
    employeeId: 'EMP123',
    googleId: 'GOOG123',
    status: 'active',
    maxCarsAllowedParking: 1,
    createdBy: 'tester',
    approvedBy: 'approver',
    approvedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await UserSession.create({
    id: `test_session_${Date.now()}`,
    userId: id,
    userType: 'test',
    token: 'token123',
    refreshToken: 'refresh123',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    isActive: true,
    ipAddress: '127.0.0.1',
    userAgent: 'jest',
    createdAt: new Date(),
    lastActivity: new Date(),
    tempToken: null,
  });

  return user;
};

  test('createOtp should generate and store OTP', async () => {
    const contact = 'test@example.com';
    const user = await createUserAndSession(contact);

    const otp = await createOtp(contact);
    expect(otp).toHaveLength(6);

    const session = await UserSession.findOne({ where: { userId: user.id } });
    expect(session?.tempToken).toBe(otp);
    expect(Number(session?.expiresAt)).toBeGreaterThan(Date.now());
  });

  test('getOtpEntry should return OTP entry', async () => {
    const contact = 'test_get@otp.com';
    const user = await createUserAndSession(contact);
    const otp = await createOtp(contact);

    const entry = await getOtpEntry(contact);
    expect(entry?.otp).toBe(otp);
    expect(entry?.expiresAt).toBeGreaterThan(Date.now());
  });

  test('removeOtp should clear OTP', async () => {
    const contact = 'test_remove@otp.com';
    const user = await createUserAndSession(contact);
    await createOtp(contact);
    await removeOtp(contact);

    const session = await UserSession.findOne({ where: { userId: user.id } });
    expect(session?.tempToken).toBeNull();
  });

  test('verifyOtp should return true for valid OTP', async () => {
    const contact = 'test_check@otp.com';
    await createUserAndSession(contact);
    const otp = await createOtp(contact);

    const result = await verifyOtp(contact, otp);
    expect(result).toBe(true);
  });

  test('verifyOtp should return false for invalid OTP', async () => {
    const contact = 'test_fail@otp.com';
    await createUserAndSession(contact);
    await createOtp(contact);

    const result = await verifyOtp(contact, 'WRONGOTP');
    expect(result).toBe(false);
  });

  test('existUser should return true if user and session exist', async () => {
    const contact = 'test_exist@otp.com';
    await createUserAndSession(contact);
    const result = await existUser(contact);
    expect(result).toBe(true);
  });

  test('existUser should return false if user does not exist', async () => {
    const result = await existUser('test_non@exist.com');
    expect(result).toBe(false);
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        id: { [Op.like]: '%test%' }
      }
    });
    await UserSession.destroy({
       where: {
         id: { [Op.like]: '%test%' }
       }
    });
    await sequelize.close();
  });

});
