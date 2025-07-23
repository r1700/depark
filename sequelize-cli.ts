#!/usr/bin/env node
console.log('sequelize-cli.ts is running...');


require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
        module: "commonjs"
    }
});

require('sequelize-cli/bin/sequelize');

