import client from './connection'


//Get once
const getRoleById = async (id: string) => {
  try {
    const result = await client.query(`SELECT role FROM adminusers WHERE baseuser_id = $1`, [id]);
    return result.rows[0].role;
  } catch (error: Error | any) {
   
  }
};

const getUserByEmail = async (email: string) => {
  try {
    const result = await client.query(`SELECT * FROM baseuser WHERE email = $1`, [email]);
    return result.rows[0];
  } catch (error: Error | any) {
   
  }
};


export { getRoleById, getUserByEmail }