var React = require('react');

var DateValueEditor = React.createClass({

	propTypes: {
		autoFocus: React.PropTypes.bool,
		value: React.PropTypes.any,
		onChange: React.PropTypes.func
	},

	componentDidMount: function () {
		this.props.autoFocus && this.refs.month.focus();
	},

	render: function () {
		return (
			<div>
				{this.renderMonthPicker()}
				{this.renderDatePicker()}
				{this.renderYearPicker()}
			</div>
		);
	},

	renderMonthPicker: function () {
		var d = this.props.value || new Date();
		var options = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		return (
			<select style={{display: 'inline-block', width: '33.3%'}} type='text' onChange={this.handleChangeMonth} value={d.getMonth()} ref='month'>
				{options.map(function (o, i) {
					return (
						<option value={i} key={i}>{o}</option>
					);
				})}
			</select>
		);
	},

	renderDatePicker: function () {
		var d = this.props.value || new Date();
		var options = [];

		for (var i = 1; i < 31; i++) {
			options.push(i);
		}

		return (
			<select style={{display: 'inline-block', width: '33.3%'}} type='text' onChange={this.handleChangeDate} value={d.getDate()} ref='date'>
				{options.map(function (o, i) {
					return (
						<option value={i} key={i}>{o}</option>
					);
				})}
			</select>
		);
	},

	renderYearPicker: function () {
		var d = this.props.value || new Date();
		d || (d = new Date());
		var year = (new Date()).getFullYear();
		var options = [];

		for (var i = year; i >= (year - 120); i--) {
			options.push(i);
		}

		return (
			<select style={{display: 'inline-block', width: '33.3%'}} type='text' onChange={this.handleChangeYear} value={d.getFullYear()} ref='year'>
				{options.map(function (o, i) {
					return (
						<option value={o} key={i}>{o}</option>
					);
				})}
			</select>
		);
	},

	handleChangeMonth: function (e) {
		var d = this.props.value || new Date();
		var v = e.target.options[e.target.selectedIndex].value;
		this.props.onChange(new Date(d.getFullYear(), parseInt(v), d.getDate()));
	},

	handleChangeDate: function (e) {
		var d = this.props.value || new Date();
		var v = e.target.options[e.target.selectedIndex].value;
		this.props.onChange(new Date(d.getFullYear(), d.getMonth(), parseInt(v)));
	},

	handleChangeYear: function (e) {
		var d = this.props.value || new Date();
		var v = e.target.options[e.target.selectedIndex].value;
		this.props.onChange(new Date(parseInt(v), d.getMonth(), d.getDate()));
	},

	focus: function () {
		this.refs.month.focus();
	},

	blur: function () {
		// this.refs.month.blur();
		// this.refs.date.blur();
		// this.refs.year.blur();
	}
});

module.exports = DateValueEditor;
