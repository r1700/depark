require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });
  
  // Imports and exports the TS config
module.exports = require('./packages/backend/src/config/sequelize.config.ts').default;
  