var path = require('path');
var webpack = require('webpack');
var TARGET = process.env.TARGET || null;

var config = {
  entry: {
    index: './src/react-schema-ui.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'react-schema-ui.js',
    sourceMapFilename: 'react-schema-ui.sourcemap.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
    { test: /\.(js|jsx)/, loader: 'babel-loader' },
    { test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  plugins: [],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  // externals: {
  //   'react': 'React',
  //   'react-motion': 'ReactMotion',
  //   'react-measure': 'Measure'
  // },
};

if (TARGET === 'minify') {
  config.output.filename = 'react-schema-ui.min.js';
  config.output.sourceMapFilename = 'react-schema-ui.min.js';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
   //  mangle: {
   //    except: ['React', 'ReactMotion', 'Transition', 'Measure']
   //  }
  }));
}

module.exports = config;
