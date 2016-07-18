var path = require('path');
var nodeModulesDir = path.resolve(__dirname, 'node_modules');

module.exports = {
  entry: {
    index: ['webpack/hot/dev-server', './demo/main.js']
  },
  output: {
    path: './demo',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
       { test: /\.(js|jsx)/, exclude: /node_modules/, loader: 'react-hot!babel-loader'},
       { test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: './demo',
  }
};