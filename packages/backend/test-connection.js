const { Sequelize } = require('sequelize');
require('dotenv').config();

const { DATA_USERNAME, PASSWORD, HOST, DATABASE } = process.env;

// יצירת חיבור Sequelize
const sequelize = new Sequelize({
  username: DATA_USERNAME || 'postgres',
  password: PASSWORD || '1234',
  database: DATABASE || 'depark',
  host: HOST || 'localhost',
  dialect: 'postgres',
  logging: console.log
});

// בדיקת חיבור
async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    
    // בדיקת טבלאות
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Tables found:');
    results.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // בדיקת טבלת parkingconfigurations
    try {
      const [parkingConfigs] = await sequelize.query(`
        SELECT * FROM parkingconfigurations LIMIT 3
      `);
      console.log('🅿️ Parking configurations:');
      parkingConfigs.forEach(config => {
        console.log(`  - ID: ${config.id}, Facility: ${config.facility_name}`);
      });
    } catch (error) {
      console.log('⚠️ parkingconfigurations table not found or empty');
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();
