const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (async () => {
  const mainifestJSON = await readFile('./manifest.json', 'utf8');
  const manifest = JSON.parse(mainifestJSON);

  return {
    entry: {
      popup: './popup/index.js',
      background: './background/index.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      modules: [__dirname, 'node_modules'],
      extensions: ['.js', '.json', '.html']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /components\/.*\.html$/,
          exclude: /node_modules/,
          use: 'svelte-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: manifest.name,
        filename: manifest.browser_action.default_popup,
        template: './popup/index.html',
        excludeChunks: ['background']
      }),
      new CopyWebpackPlugin(
        [{ from: 'manifest.json' }, { from: 'assets', to: 'assets' }],
        {
          ignore: ['*.DS_Store']
        }
      )
    ],
    devtool: 'inline-source-map'
  };
})();
