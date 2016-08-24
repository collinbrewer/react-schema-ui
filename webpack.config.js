module.exports = {
	entry: {
		main: ['webpack/hot/dev-server', './demo/main.js'],
		'react-schema-ui': ['./src/react-schema-ui.js']
	},
	output: {
		path: './demo',
		filename: '[name].js'
	},
	externals: {
		'react': {
			root: 'React',
			commonjs2: 'react',
			commonjs: 'react',
			amd: 'react'
		}
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)/,
			exclude: /node_modules/,
			loader: 'react-hot!babel-loader'
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	devServer: {
		contentBase: './demo'
	}
};
