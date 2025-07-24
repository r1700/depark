import client from './connection'


//Get once
const getRole = async (id: string) => {
  try {
    const result = await client.query(`SELECT role FROM "AdminUsers" WHERE id = $1`, [id]);
    console.log(result.rows);
    return result.rows[0].role;
  } catch (err) {
    console.error('Query error');
  }
};

const getId = async (email: string) => {
  try {
    const result = await client.query(`SELECT id FROM "BaseUser" WHERE email = $1`, [email]);
    console.log(result.rows);
    return result.rows[0].id;
  } catch (err) {
    console.error('Query error');
  }
};


export {getRole, getId}