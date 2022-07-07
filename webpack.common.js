const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    programa: './src/index.js',
  },
  output: {
    filename: '[name].[fullhash].js',
    chunkFilename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'publico'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              {
                tag: 'meta',
                attribute: 'content',
                type: 'src',
                filter: (tag, attribute, attributes, resourcePath) => {
                  for (const attribute of attributes) {
                    if (attribute.value === 'og:image' || attribute.value === 'twitter:image') {
                      return true;
                    }
                  }

                  return false;
                },
              },
            ],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
