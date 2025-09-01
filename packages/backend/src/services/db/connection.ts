import { Pool } from 'pg';
import { appDbConfig } from '../../config/config';

const client = new Pool({
  user: appDbConfig.username,
  host: appDbConfig.host,
  database: appDbConfig.database,
  password: appDbConfig.password,
  port: appDbConfig.port,
});

export default client;