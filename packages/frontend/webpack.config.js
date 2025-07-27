const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/service-worker.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
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
      directory: path.join(__dirname, 'build'),
      publicPath: '/',
    },
    watchFiles: ['src/**/*'],
    hot: true,
    open: true,
    historyApiFallback: true,
    port: 3000,
  },
  devtool: 'source-map',
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.ts',
      swDest: 'service-worker.js',
    }),
  ],
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
};