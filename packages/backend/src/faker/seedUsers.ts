import sequelize from '../config/sequelize';
import { faker } from '@faker-js/faker';

async function seed() {
  const departments = ['HR', 'ADMIN'];
  const statuses = [1, 2, 3, 4];

  const users = Array.from({ length: 500000 }, (_, i) => ({
    baseuser_id: i + 1,
    department: faker.helpers.arrayElement(departments),
    employee_id: faker.string.alphanumeric(6),
    google_id: faker.string.uuid(),
    phone: `05${faker.number.int({ min: 0, max: 9 })}${faker.number.int({ min: 1000000, max: 9999999 })}`,
    status: faker.helpers.arrayElement(statuses),
    max_cars_allowed_parking: faker.number.int({ min: 1, max: 3 }),
    created_by: 'admin',
    approved_by: faker.datatype.boolean() ? 'admin' : null,
    approved_at: faker.datatype.boolean() ? faker.date.recent() : null,
  }));

  try {
    await sequelize.getQueryInterface().bulkInsert('users', users);
    console.log('Users seed completed!');
  } catch (err) {
    console.error('Users seed error:', err);
  } finally {
    await sequelize.close();
  }
}

seed();