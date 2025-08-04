import { Sequelize } from 'sequelize';
import config from './sequelize.config'; 

const dbConfig = config.development;

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    logging: false, // אופציונלי: לא להדפיס SQL
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ החיבור למסד הנתונים הצליח.');
  } catch (error) {
    console.error('❌ שגיאה בחיבור למסד הנתונים:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
