const { Sequelize } = require('sequelize');

async function checkParkingConfigTable() {
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
    console.log('✅ חיבור למסד נתונים depark הצליח!');
    
    // בדיקה ספציפית של טבלת parkingconfigurations
    try {
      const columns = await sequelize.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'parkingconfigurations' 
        ORDER BY ordinal_position;
      `, { type: sequelize.QueryTypes.SELECT });
      
      if (columns.length > 0) {
        console.log('🎯 טבלה: parkingconfigurations נמצאה!');
        console.log('  עמודות:');
        columns.forEach(col => {
          console.log(`    - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
        });
        
        // בדוק תוכן
        const data = await sequelize.query(`SELECT * FROM parkingconfigurations;`, { type: sequelize.QueryTypes.SELECT });
        console.log(`  📈 מספר רשומות: ${data.length}`);
        
        if (data.length > 0) {
          console.log('  🔍 רשומות:');
          data.forEach((row, i) => {
            console.log(`    ${i+1}. ID: ${row.id}, שם: ${row.facility_name}, מקומות: ${row.total_surface_spots}`);
          });
        }
      } else {
        console.log('❌ טבלה parkingconfigurations לא נמצאה');
      }
      
    } catch (err) {
      console.log(`❌ שגיאה בגישה לטבלה parkingconfigurations: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkParkingConfigTable();
