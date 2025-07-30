import client from './connection'


//Get once
const getRoleById = async (id: string) => {
  try {
    console.log("hello from getRole");
    const result = await client.query(`SELECT role FROM adminusers WHERE baseuser_id = $1`, [id]);
    console.log(result.rows);
    return result.rows[0].role;
  } catch (error) {
    console.error(error);
  }
};

const getIdByEmail = async (email: string) => {
  try {
    const result = await client.query(`SELECT id FROM baseuser WHERE email = $1`, [email]);
    console.log(result.rows);
    return result.rows[0].id;
  } catch (err) {
    console.error('Query error');
  }
};


export {getRoleById, getIdByEmail}