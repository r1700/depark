
console.log('sequelize.config.js');
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });
  
module.exports = require('./packages/backend/src/config/sequelize.config.ts').default;
  