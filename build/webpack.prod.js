/* eslint-disable global-require */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');

const plugins = [];
if (process.env.npm_config_report) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 8081,
    })
  );
}

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map',
  plugins: [
    ...plugins,

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../public/dll/vendor.manifest.json'),
    }),

    new AddAssetHtmlWebpackPlugin([
      {
        filepath: path.resolve(__dirname, '../public', 'dll', 'vendor.dll.js'),
        outputPath: 'vendor',
        publicPath: './vendor',
      },
    ]),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      cacheGroups: {
        vendors: {
          minChunks: 2,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
