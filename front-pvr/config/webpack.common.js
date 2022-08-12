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
