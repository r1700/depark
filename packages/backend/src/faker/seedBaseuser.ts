import sequelize  from '../config/sequelize';
import { faker } from '@faker-js/faker';

async function seed() {
  const users = Array.from({ length: 500000 }, () => ({
    email: faker.internet.email(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone: `05${faker.number.int({ min: 0, max: 9 })}${faker.number.int({ min: 1000000, max: 9999999 })}`,
    created_at: new Date(),
    updated_at: new Date()
  }));

  try {
    await sequelize.getQueryInterface().bulkInsert('baseuser', users);
    console.log('Seed completed!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await sequelize.close();
  }
}

seed();