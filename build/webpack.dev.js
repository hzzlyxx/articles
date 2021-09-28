const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../release'),
    stats: 'errors-only',
    compress: true,
    port: 8080,
    hot: true,
    open: true,
    proxy: {
      // '/': {
      //   target: 'http://xxxxxxxx',
      //   changeOrigin: true,
      //   // pathRewrite: { '^/api': '' },
      // },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({}),
    new FriendlyErrorsWebpackPlugin(),
    new ESLintPlugin(),
  ],
});
