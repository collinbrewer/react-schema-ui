var React = require('react');
var classnames = require('classnames');
// var JSONPointer = require('json-pointer');

var PropertySchema = require('./schemas/property-schema.js');
var SchemaPropertyValueViewer = require('./schema-property-value-viewer.js');
var SchemaPropertyValueEditor = require('./schema-property-value-editor.js');
var dispatcher = require('./dispatcher.js');

var getDisplayTypeForProperty = function (property) {
	var displayType = 'text';

	if (property.getType() === 'boolean') {
		displayType = 'checkbox';
	}
	else if (property.isSecure()) {
		displayType = 'password';
	}

	return displayType;
};

/**
 * defaultDisplayValueTransformer
 */
var defaultDisplayValueTransformer = function (property, value, transformer) {
	var displayValue = value;
	var type = property.getType();

	switch (type) {
		case 'date' : {
			displayValue = value && value.toLocaleString();
			break;
		}
	}

	displayValue = transformer(property, value, displayValue);

	return (displayValue ? '' + displayValue : displayValue);
};

var SchemaPropertyView = React.createClass({

	propTypes: {
		value: React.PropTypes.any,
		onChange: React.PropTypes.func,
		inlineCancelComponent: React.PropTypes.element,
		inlineConfirmComponent: React.PropTypes.element,
		editing: React.PropTypes.bool,
		schema: React.PropTypes.object,
		editMode: React.PropTypes.string,
		editable: React.PropTypes.bool,
		displayValueTransformer: React.PropTypes.func,
		onWantsEdit: React.PropTypes.func,
		inlineBlurMode: React.PropTypes.string
	},

	getDefaultProps: function () {
		var noop = function () {};

		return {
			'schema': {},
			'title': '',
			'placeholder': '',
			'value': undefined,
			'displayValue': '',
			'editMode': 'form',
			'editable': false,
			'editing': false,
			'inlineBlurMode': 'submit', // "submit", "cancel", ""
			'onWantsEdit': noop,
			'onChange': noop,
			renderPropertyViewer: noop,
			renderPropertyEditor: noop,
			displayValueTransformer: function (p, v, d) { return d; }
		};
	},

	getInitialState: function () {
		return {
			editing: this.props.editing,
			stagedValue: this.props.value
		};
	},

	componentWillReceiveProps: function (nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setState({
				stagedValue: nextProps.value
			});
		}
	},

	render: function () {
		var props = this.props;
		var editMode = props.editMode;
		var editable = this.props.editable;
		var editing = this.state.editing;
		var schema = this.getSchema();
		var value = this.state.stagedValue;// || this.props.value;
		var displayName = schema.getLabel();
		// var placeholder = schema.getPlaceholder();
		var inlineEditingControls;
		var className = classnames(
			{
				'rsui-property-container': true,
				'rsui-editable': editable,
				'rsui-editing': editing,
				'rsui-has-value': !!value,
				'rsui-has-changed': this.hasChanged()
			},
			schema.getName(),
			'rsui-edit-mode-' + editMode
		);

		// if
		if (editMode === 'inline' && editing) {
			inlineEditingControls = this.renderInlineEditingControls();
		}

		// we'll make this tabbable if it's inline mode, editable, but not editing
		// var tabIndex = ((editMode === 'inline' && editable && !editing) ? '0' : undefined);
		var focusInput;
		var viewerContainer;
		var editorContainer;

		if (editMode === 'inline' && editable && !editing) {
			// focusInput = (<input ref='fakeInput' onFocus={this.handleFocus} style={{position: 'absolute', opacity: 0}} />);
			focusInput = (<input ref={(node) => { this.fakeInput = node; }} onFocus={this.handleFocus} style={{position: 'absolute', opacity: 0}} />);
		}

		if ((editMode === 'inline' ? editing : editable)) {
			editorContainer = (
				<div className='rsui-property-value-editor-container' onKeyDown={this.handleKeyDown} key='editor'>
					{this.renderValueEditor()}
					{inlineEditingControls}
				</div>
			);
		}
		else {
			viewerContainer = (
				<div className='rsui-property-value-viewer-container' key='viewer'>
					{this.renderValueViewer()}
				</div>
			);
		}

		return (
			<div
				className={className}
				onMouseDown={this.handleMouseDownContainer}
				onClick={this.handleClickContainer}
				ref={(node) => { this.container = node; }}
				>
				<label className='rsui-property-label' htmlFor={schema.getName()}>{displayName}</label>
				{focusInput}
				<div className='rsui-property-value-container'>
					{viewerContainer}
					{editorContainer}
				</div>
			</div>
		);
	},

	renderValueViewer: function () {
		var props = this.props;
		var schema = this.getSchema();
		var value = this.getValue();
		var displayValue = defaultDisplayValueTransformer(schema, value, props.displayValueTransformer);
		var placeholder = schema.getPlaceholder();

		if (displayValue) {
			var viewerProps = {
				value: this.getValue(),
				displayValue: displayValue,
				schema: schema
			};
			var valueViewer = props.renderPropertyViewer(viewerProps);

			if (!valueViewer) {
				valueViewer = React.createElement((props.propertyViewerClass || SchemaPropertyValueViewer), viewerProps);
			}
		}
		else {
			valueViewer = (
				<div className='rsui-property-value-placeholder'>
					{placeholder}
				</div>
			);
		}

		return valueViewer;
	},

	renderValueEditor: function () {
		var props = this.props;
		var schema = this.getSchema();
		var editorProps = {
			value: this.getValue(),
			displayType: getDisplayTypeForProperty(schema),
			placeholder: props.placeholder,
			editMode: props.editMode,
			editable: props.editable,
			editing: this.state.editing,
			schema: schema,
			displayValueTransformer: this.props.displayValueTransformer,
			onChange: this.handleChange,
			autoFocus: this.state.editing
		};
		var valueEditor = props.renderPropertyEditor(editorProps);

		if (!valueEditor) {
			valueEditor = React.createElement((props.propertyEditorClass || SchemaPropertyValueEditor), editorProps);
		}

		return valueEditor;
	},

	renderInlineEditingControls: function () {
		var inlineCancelComponent = this.props.inlineCancelComponent || ('cancel');
		var inlineConfirmComponent = this.props.inlineConfirmComponent || ('confirm');

		var confirmControl;

		if (this.hasChanged()) {
			confirmControl = (<button className='rsui-inline-confirm' tabIndex='-1' onMouseDown={this.confirmInlineEdit}>{inlineConfirmComponent}</button>);
		}
		else {
			confirmControl = (<span className='rsui-inline-confirm'>{inlineConfirmComponent}</span>);
		}

		return (
			<span className='rsui-inline-controls-container'>
				<button className='rsui-inline-cancel' tabIndex='-1' onMouseDown={this.cancelInlineEdit}>{inlineCancelComponent}</button>
				{confirmControl}
			</span>
		);
	},

	handleKeyDown: function (e) {
		var keyCode = e.keyCode;

		if (keyCode === 13) { // enter > explicit confirm
			this.confirmInlineEdit(e);
		}
		else if (keyCode === 27) { // escape > explicity confirm
			this.cancelInlineEdit(e);
		}
		// else if(keyCode===9) { // tab > implicit based on blur mode
		//	 this.endEditSession();
		// }
	},

	handleChange: function (value) {
		// if the edit mode is inline, we'll apply the changes internally
		if (this.props.editMode === 'inline') {
			this.setState({
				stagedValue: value
			});
		}
		else {
			this.props.onChange(value);
		}
	},

	handleMouseDownContainer: function (e) {
		if (this.props.editMode === 'inline') {
			if (this.state.editing) {
				e.preventDefault();
			}
		}
	},

	handleClickContainer: function (e) {
		if (this.props.editMode === 'inline') {
			if (this.props.editable) {
				this.beginEditSession(e);
			}
		}
	},

	handleFocus: function (e) {
		this.beginEditSession(e);
	},

	beginEditSession: function (e) {
		var shouldEdit = this.props.onWantsEdit(this.getSchema(), e);

		if (shouldEdit !== false) {
			// this.setState({
			//	 editing: true
			// });
			// FIXME: this may come as a prop from the editor store instead
			this.setState({
				editing: true
			});

			dispatcher.dispatch({
				actionType: 'beginEditSession',
				editor: this
			});
		}
		else {
			this.fakeInput.blur();
			// this.refs.container.blur();
			e && e.preventDefault();
		}
	},

	endEditSession: function () {
		// if we're inline editing and nothing has changed, just cancel the edit
		if (this.props.editMode === 'inline' && this.state.editing) {
			if (!this.hasChanged()) {
				this.cancelInlineEdit();
			}
			else if (this.props.inlineBlurMode === 'cancel') {
				this.cancelInlineEdit();
			}
			else if (this.props.inlineBlurMode === 'submit') {
				this.confirmInlineEdit();
			}
		}
	},

	/**
	 * @return Boolean Returns true if the component or one of it's descendants has focus
	 */
	hasFocus: function () {
		var el = document.activeElement;
		var us = this.container;
		while (el = el.parentElement) { // eslint-disable-line
			if (el === us) {
				return true;
			}
		}
		return false;
	},

	/**
	 * @return Boolean True if the component is being edited
	 */
	isEditing: function () {
		return this.state.editing;
	},

	confirmInlineEdit: function (e) {
		e && e.preventDefault();

		if (this.props.editMode === 'inline') {
			this.setState({
				// stagedValue: this.props.value,
				editing: false
			});

			this.props.onChange(this.state.stagedValue); // now props.value and state.stagedValue should be in sync
		}
	},

	cancelInlineEdit: function () {
		this.setState({
			stagedValue: this.props.value, // revert
			editing: false
		});
	},

	getSchema: function () {
		var schema = this.props.schema;
		return (('getName' in schema) ? schema : new PropertySchema(schema));
	},

	getValue: function () {
		return this.state.stagedValue;// || this.props.value;//(this.state.stagedValue !== undefined ? this.state.stagedValue : this.props.value);
	},

	isValid: function () {
		var schema = this.getSchema();

		return schema.isRequired() ? this.getValue() !== undefined : true;
	},

	// this is meant to be used only in inline edit mode
	hasChanged: function () {
		return true;
		// return (this.state.stagedValue !== this.props.value);
	}
});

module.exports = SchemaPropertyView;
