const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx',
  target: 'web',
  output: {
    path: path.resolve(`${__dirname}`, '../dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.less$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]',
        },
      },
      {
        test: /\.png/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    alias: {
      '@Components': path.resolve('./src/components'),
      '@Hooks': path.resolve('./src/hooks'),
      '@Modules': path.resolve('./src/modules'),
      '@Models': path.resolve('./src/models'),
      '@Store': path.resolve('./src/store'),
      '@Api': path.resolve('./src/api'),
      '@Utils': path.resolve('./src/utils.ts'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Influence',
      inject: 'body',
      template: './public/index.html',
    }),
    new FaviconsWebpackPlugin('./public/assets/logo.png'),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new Dotenv(),
  ],
};
