import client from './connection';

export async function getId(email: string) {
  try {
    const result = await client.query('SELECT id FROM baseuser WHERE email = $1', [email]);
    return result.rows[0]?.id || null;
  } catch (error) {
    console.error('Error getting ID:', error);
    throw error;
  }
}

export async function getRole(id: string) {
  try {
    const result = await client.query(`
      SELECT 
        bu.id,
        bu.email,
        bu.first_name,
        bu.last_name,
        u.password_hash,
        u.role,
        u.permissions
      FROM baseuser bu
      LEFT JOIN users u ON bu.id = u.baseuser_id
      WHERE bu.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting role:', error);
    throw error;
  }
}