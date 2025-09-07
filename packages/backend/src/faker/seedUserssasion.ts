import sequelize from '../config/sequelize';
import { faker } from '@faker-js/faker';

async function seed() {
  const sessions = Array.from({ length: 500000 }, (_, i) => ({
    baseuser_id: i + 1,
    user_type: faker.helpers.arrayElement([1, 2]), 
    token: faker.string.alphanumeric(20),
    refresh_token: faker.string.alphanumeric(20),
    expires_at: new Date(Date.now() + faker.number.int({ min: 1, max: 24 }) * 3600 * 1000),
    is_active: faker.datatype.boolean(),
    ip_address: faker.internet.ipv4(),
    user_agent: faker.internet.userAgent(),
    created_at: new Date(),
    last_activity: new Date(),
    temp_token: faker.string.alphanumeric(20)
  }));

  try {
    await sequelize.getQueryInterface().bulkInsert('usersessions', sessions);
    console.log('UserSessions seed completed!');
  } catch (err) {
    console.error('UserSessions seed error:', err);
  } finally {
    await sequelize.close();
  }
}

seed();

