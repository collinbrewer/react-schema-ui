var path = require('path');
var webpack = require('webpack');
var TARGET = process.env.TARGET || null;

var config = {
   entry: {
      'react-schema-ui': './src/react-schema-ui.js'
   },
   output: {
      path: path.join(__dirname, 'dist'),
      publicPath: 'dist/',
      filename: '[name].js',
      sourceMapFilename: 'react-schema-ui.sourcemap.js',
      library: 'react-schema-ui',
      libraryTarget: 'umd'
   },
   module: {
      loaders: [{
         test: /\.(js|jsx)/,
         loader: 'babel-loader'
      }, {
         test: /\.css$/,
         loader: 'style-loader!css-loader'
      }]
   },
   plugins: [],
   resolve: {
      extensions: ['', '.js', '.jsx']
   },
   externals: {
      'react': 'React'
   },
};

config.output.filename = 'react-schema-ui.min.js';
config.output.sourceMapFilename = 'react-schema-ui.min.js';
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
   compress: {
      warnings: false
   },
   mangle: {
      except: ['React']
   }
}));

module.exports = config;
