import sequelize from '../config/sequelize';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

async function seedAdminUsers() {
  const admins = await Promise.all(
    Array.from({ length: 500000 }, async (_, i) => ({
      baseuser_id: i + 1,
      password_hash: await bcrypt.hash(faker.internet.password({ length: 12 }), 10),
      role: i % 2 === 0 ? 2 : 1,
      permissions: i % 2 === 0 ? ['read', 'write', 'delete'] : ['read', 'write'],
      last_login_at: i % 3 === 0 ? new Date() : null,
    }))
  );

  try {
    await sequelize.getQueryInterface().bulkInsert('adminusers', admins);
    console.log('Admin users seed completed!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await sequelize.close();
  }
}

seedAdminUsers();