const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/service-worker.ts',
  output: {
    filename: 'service-worker.js',          // רק שם הקובץ
    path: path.resolve(__dirname, 'dist'),  // תיקיית output
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
  },
  watchFiles: ['src/**/*'],
  compress: true,
  port: 3000,
};