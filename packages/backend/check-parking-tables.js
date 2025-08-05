const { Sequelize } = require('sequelize');

async function checkParkingTables() {
  const sequelize = new Sequelize({
    username: 'postgres',
    password: '1234',
    database: 'depark',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('✅ חיבור למסד נתונים depark הצליח!\n');
    
    const parkingTables = ['ParkingSessions', 'ParkingSpots', 'ParkingUsageStats'];
    
    for (let tableName of parkingTables) {
      console.log(`📊 טבלה: ${tableName}`);
      try {
        // בדוק מבנה הטבלה
        const columns = await sequelize.query(`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = '${tableName}' 
          ORDER BY ordinal_position;
        `, { type: sequelize.QueryTypes.SELECT });
        
        console.log('  עמודות:');
        columns.forEach(col => {
          console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
        });
        
        // בדוק תוכן
        const count = await sequelize.query(`SELECT COUNT(*) as count FROM "${tableName}";`, { type: sequelize.QueryTypes.SELECT });
        console.log(`  📈 מספר רשומות: ${count[0].count}`);
        
        if (count[0].count > 0) {
          const sample = await sequelize.query(`SELECT * FROM "${tableName}" LIMIT 2;`, { type: sequelize.QueryTypes.SELECT });
          console.log('  🔍 דוגמאות:');
          sample.forEach((row, i) => {
            console.log(`    ${i+1}. ${JSON.stringify(row).substring(0, 100)}...`);
          });
        }
        
        console.log(''); // שורה ריקה
        
      } catch (err) {
        console.log(`  ❌ שגיאה: ${err.message}\n`);
      }
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkParkingTables();
