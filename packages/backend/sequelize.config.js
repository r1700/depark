
console.log('sequelize.config.js');
require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });
  
  // מייבא ומייצא את הקונפיג TS
module.exports = require('./src/config/sequelize.config.ts').default;
  
