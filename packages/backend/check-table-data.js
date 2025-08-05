const { Sequelize } = require('sequelize');

// בדיקת מסדי נתונים קיימים
async function checkDatabases() {
  const sequelize = new Sequelize({
    username: 'postgres',
    password: '1234',
    database: 'postgres', // מסד נתונים ברירת מחדל
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log('✅ חיבור למסד הנתונים הצליח!');
    
    // בדיקת כל מסדי הנתונים
    const databases = await sequelize.query("SELECT datname FROM pg_database WHERE datistemplate = false;", { type: sequelize.QueryTypes.SELECT });
    
    console.log('📋 מסדי נתונים זמינים:');
    databases.forEach((db, index) => {
      console.log(`${index + 1}. ${db.datname}`);
    });
    
    // בדיקה של כל מסד נתונים עבור הטבלה
    for (let db of databases) {
      if (db.datname === 'postgres' || db.datname === 'template0' || db.datname === 'template1') {
        continue; // דלג על מסדי נתונים של מערכת
      }
      
      await checkTableInDatabase(db.datname);
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  } finally {
    await sequelize.close();
  }
}

async function checkTableInDatabase(dbName) {
  const sequelize = new Sequelize({
    username: 'postgres',
    password: '1234',
    database: dbName,
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  });

  try {
    await sequelize.authenticate();
    
    // בדיקה אם הטבלה קיימת
    const tables = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE '%parking%' OR table_name LIKE '%config%');
    `, { type: sequelize.QueryTypes.SELECT });
    
    if (tables.length > 0) {
      console.log(`\n🎯 במסד נתונים "${dbName}" נמצאו טבלאות:`)
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
      
      // בדיקת תוכן הטבלה אם זה נראה כמו שלנו
      for (let table of tables) {
        if (table.table_name.toLowerCase().includes('parking') || table.table_name.toLowerCase().includes('config')) {
          try {
            const data = await sequelize.query(`SELECT COUNT(*) as count FROM "${table.table_name}";`, { type: sequelize.QueryTypes.SELECT });
            console.log(`    📊 ${table.table_name} מכילה ${data[0].count} רשומות`);
            
            if (data[0].count > 0) {
              // הצג כמה רשומות לדוגמה
              const sample = await sequelize.query(`SELECT * FROM "${table.table_name}" LIMIT 3;`, { type: sequelize.QueryTypes.SELECT });
              console.log(`    � דוגמאות:`);
              sample.forEach((row, i) => {
                console.log(`      ${i+1}. ID: ${row.id || row.ID}, שם: ${row.facility_name || row.facilityName || row.name || 'לא ידוע'}`);
              });
            }
          } catch (err) {
            console.log(`    ❌ שגיאה בקריאת ${table.table_name}: ${err.message}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.log(`❌ לא ניתן להתחבר למסד נתונים "${dbName}": ${error.message}`);
  } finally {
    await sequelize.close();
  }
}

checkDatabases();
