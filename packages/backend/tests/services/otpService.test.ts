import { baseuser, usersessions } from '../../src/model/database-models/user.model';
import sequelize from '../../src/model/database-models/user.model';
import { createOtp, getOtpEntry, removeOtp, verifyOtp, existUser, userIdByContact } from '../../src/services/otp.service';
import { Op } from 'sequelize';

describe('OTP Service', () => {

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  const createUserAndSession = async (contact: string) => {
    const id = `test_user_${Date.now()}`; // יצירת מזהה ייחודי ידני

    const user = await baseuser.create({
      id,
      email: contact.includes('@') ? contact : '',
      phone: contact.includes('@') ? '' : contact,
      first_name: 'test',
      last_name: 'test',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await usersessions.create({
      id: `test_session_${Date.now()}`,
      baseuser_id: id,
      user_type: 'test',
      token: 'testtoken',
      refresh_token: 'testrefresh',
      expires_at: new Date(Date.now() + 60 * 60 * 1000),
      is_active: true,
      ip_address: '127.0.0.1',
      user_agent: 'jest',
      created_at: new Date(),
      last_activity: new Date(),
      temp_token: null,
    });

    return user;
  };

  test('createOtp should generate and store OTP', async () => {
    const contact = 'test@example.com';
    const user = await createUserAndSession(contact);

    const otp = await createOtp(contact);
    expect(otp).toHaveLength(6);

    const session = await usersessions.findOne({ where: { baseuser_id: user.id } });
    expect(session?.temp_token).toBe(otp);
    expect(Number(session?.expires_at)).toBeGreaterThan(Date.now());
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

    const session = await usersessions.findOne({ where: { baseuser_id: user.id } });
    expect(session?.temp_token).toBeNull();
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
    await baseuser.destroy({
      where: {
        id: { [Op.like]: '%test%' }
      }
    });
    await usersessions.destroy({
      where: {
        id: { [Op.like]: '%test%' }
      }
    });
    await sequelize.close();
  });
  
});


