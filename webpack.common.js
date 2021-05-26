const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        include: path.resolve(__dirname, 'src'),
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        include: path.resolve(__dirname, 'src'),
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new FaviconsWebpackPlugin('./src/logo.png'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Brandon Harrison Portfolio',
    }),
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
