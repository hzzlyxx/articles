const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

const pages = [
  { name: 'popup' },
  { name: 'weekly'},
  { name: 'list', template: 'list' },
];

const entry = {};

const genHtmlPluginConfig = (options) => {
  return options.map((option) => {
    entry[option.name] = path.resolve(__dirname, `../src/pages/${option.name}.tsx`);
    return new HtmlWebpackPlugin({
      filename: `${option.name}.html`,
      title: option.title || 'Articles',
      template: path.resolve(__dirname, `../public/${option.template || 'index'}.html`),
      inject: true,
      minify: false,
      chunks: [`${option.name}`],
    });
  });
};

const htmlPluginConfigs = genHtmlPluginConfig(pages);

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, '../chrome'),
    filename: 'js/[name].js',
    publicPath: isDev ? '/' : './',
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          outputPath: 'images',
          name: `[name].[ext]?${new Date().getTime()}`,
        },
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          isDev
            ? {
                loader: 'style-loader',
              }
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../',
                },
              },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    modules: ['node_modules', path.resolve(__dirname, '../src')],
  },
  plugins: [
    ...htmlPluginConfigs,
  ],
};