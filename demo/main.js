var React = require('react');
var ReactDOM = require('react-dom');
var Demo = require('./js/demo.js');

require('./css/rsui.css');
require('./css/floating-label.css');
require('./css/styled-viewer.css');

ReactDOM.render(
	<Demo />,
	document.getElementById('app-container')
);
