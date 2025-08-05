const { Sequelize } = require('sequelize');

async function addMainConfig() {
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
    
    // הוספת רשומה עם ID מותאם לפרונטנד
    await sequelize.query(`
      INSERT INTO parkingconfigurations (
        facility_name, 
        total_surface_spots, 
        surface_spot_ids, 
        avg_retrieval_time_minutes, 
        max_queue_size, 
        operating_hours, 
        timezone, 
        updated_at, 
        updated_by
      ) VALUES (
        'Main Parking Facility',
        100,
        ARRAY['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'],
        10,
        15,
        '{"monday": "08:00-18:00", "tuesday": "08:00-18:00", "wednesday": "08:00-18:00", "thursday": "08:00-18:00", "friday": "08:00-18:00", "saturday": "09:00-17:00", "sunday": "closed"}',
        'Asia/Jerusalem',
        NOW(),
        'system'
      )
    `);
    
    console.log('✅ נוספה רשומה חדשה!');
    
    // הצגת כל הרשומות
    const data = await sequelize.query(`SELECT * FROM parkingconfigurations ORDER BY id;`, { type: sequelize.QueryTypes.SELECT });
    console.log(`📋 כל הרשומות (${data.length}):`);
    data.forEach((row, i) => {
      console.log(`  ${i+1}. ID: ${row.id}, שם: ${row.facility_name}, מקומות: ${row.total_surface_spots}`);
    });
    
  } catch (error) {
    console.error('❌ שגיאה:', error.message);
  } finally {
    await sequelize.close();
  }
}

addMainConfig();
