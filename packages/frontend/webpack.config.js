const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/service-worker.ts',
  output: {
    path: path.resolve(__dirname, './public'),
    publicPath: '/',
    clean: true,
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
      directory: path.join(__dirname, './public'),
      publicPath: '/',
      watchContentBase: true,
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    port: 3000,
  },
  devtool: 'source-map',
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.ts',
      swDest: 'custom-service-worker.js',
    }),
  ],
  optimization: {
    minimize: true,
  },
};