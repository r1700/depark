import path from 'path';
import { appDbConfig } from './config';

export default {
  development: {
    ...appDbConfig,
    dialectOptions: undefined, // No SSL in development
    migrations: {
      path: path.resolve(__dirname, '../../migrations'),
      pattern: /\.(js|ts)$/,
    },
  },
  production: {
    ...appDbConfig,
    migrations: {
      path: path.resolve(__dirname, '../../migrations'),
      pattern: /\.(js|ts)$/,
    },
  },
};

