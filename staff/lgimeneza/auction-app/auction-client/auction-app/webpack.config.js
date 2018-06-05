const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cssConfig = [
  'style-loader',
  'css-loader',
  'sass-loader'
];

module.exports = {
  entry: {
    vendor: ['babel-polyfill', 'react', 'react-dom'],
    app: [path.resolve(__dirname, 'src/App.js')],
    bootsrap: [path.resolve(__dirname, 'src/App.js')]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react',
      },
      {
        test: /\.(pug|jade)$/,
        loader: 'pug-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: cssConfig
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        use: 'file-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 8000,
    stats: 'errors-only',
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'My App using pug',
      template: './views/index.pug',
      hash: true,
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true,
        unused: true
      },
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};