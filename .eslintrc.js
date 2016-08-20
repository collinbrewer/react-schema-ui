module.exports = {
	'extends': ['happiness', 'plugin:react/recommended'],
	'parser': 'babel-eslint',
	'env': {
		'browser': true,
		'mocha': true
	},
	'plugins': [
		'react'
	],
	'rules': {
		'brace-style': [2, 'stroustrup', { 'allowSingleLine': true }],
		'jsx-quotes': [1, 'prefer-single']
	}
};
