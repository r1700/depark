const { Sequelize } = require('sequelize');

async function checkAllTablesInDepark() {
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
    
    // בדיקת כל הטבלאות
    const tables = await sequelize.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public';
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log(`📋 טבלאות במסד נתונים depark (${tables.length} טבלאות):`);
    
    if (tables.length === 0) {
      console.log('❌ אין טבלאות במסד הנתונים!');
    } else {
      tables.forEach((table, index) => {
        console.log(`${index + 1}. ${table.table_name || table.tablename || table.TABLE_NAME || JSON.stringify(table)}`);
      });
      
      // בדוק אם יש טבלה שנראית כמו parking configuration
      const parkingTables = tables.filter(t => {
        const tableName = t.table_name || t.tablename || t.TABLE_NAME || '';
        return tableName.toLowerCase().includes('parking') || 
               tableName.toLowerCase().includes('config');
      });
      
      if (parkingTables.length > 0) {
        console.log('\n🎯 טבלאות שעשויות להיות רלוונטיות:');
        for (let table of parkingTables) {
          const tableName = table.table_name || table.tablename || table.TABLE_NAME;
          console.log(`\n📊 טבלה: ${tableName}`);
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
            
          } catch (err) {
            console.log(`  ❌ שגיאה בקריאת מבנה הטבלה: ${err.message}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAllTablesInDepark();
