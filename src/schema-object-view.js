/**
 * A configurable react view component, generated from a given object.
 */

var React = require('react');
var classnames = require('classnames');
var SchemaPropertyView = require('./schema-property-view.js');

var ObjectSchema = require('./schemas/object-schema.js');

var SchemaObjectView = React.createClass({

	propTypes: {
		propertyNameWhitelist: React.PropTypes.array,
		propertyNameBlacklist: React.PropTypes.array,
		onChangeProperty: React.PropTypes.func,
		className: React.PropTypes.string,
		schema: React.PropTypes.object
	},

	getDefaultProps: function () {
		return {
			schema: undefined,
			value: undefined,
			editMode: 'form',
			editing: false,
			editable: false,
			propertyViewers: {},
			propertyEditors: {},
			onWantsEditProperty: function () {},
			onChange: function () {}
		};
	},

	getWhiteBlackProperties: function () {
		var whiteBlackProperties = this.whiteBlackProperties;

		if (!whiteBlackProperties) {
			var schema = this.getSchema();
			var propertyNameWhitelist = this.props.propertyNameWhitelist;
			var propertyNameBlacklist = (this.props.propertyNameBlacklist || []);
			whiteBlackProperties = schema.getProperties();

			// pull in explicity whitelisted or all
			if (propertyNameWhitelist) {
				whiteBlackProperties = whiteBlackProperties.filter(function (property) {
					return (propertyNameWhitelist.indexOf(property.getName()) !== -1);
				});
			}

			// filter out the blacklist
			if (propertyNameBlacklist) {
				whiteBlackProperties = whiteBlackProperties.filter(function (property) {
					return (propertyNameBlacklist.indexOf(property.getName()) === -1);
				});
			}

			this.whiteBlackProperties = whiteBlackProperties;
		}

		return whiteBlackProperties;
	},

	render: function () {
		var props = this.props;
		// var schema = this.getSchema();
		var editMode = props.editMode;
		var editable = props.editable;
		var editing = props.editing;
		var handleWantsEditProperty = props.onWantsEditProperty;
		var value = props.value;
		var properties = this.getWhiteBlackProperties();

		// render the property views
		var handleChangeProperty = this.props.onChangeProperty;

		var propertyViews = properties.map(function (propertySchema, i) {
			var propertyName = propertySchema.getName();
			var propertyValue = value ? value[propertyName] : undefined;
			var fn;

			if (handleChangeProperty) {
				fn = handleChangeProperty.bind(null, propertySchema);
			}

			return (
				<SchemaPropertyView
					key={i}
					schema={propertySchema}
					value={propertyValue}
					editMode={editMode}
					editable={editable}
					editing={editing}
					propertyViewerClass={props.propertyViewers[propertyName]}
					propertyEditorClass={props.propertyEditors[propertyName]}
					renderPropertyViewer={props.renderPropertyViewer}
					renderPropertyEditor={props.renderPropertyEditor}
					inlineCancelComponent={props.inlineCancelComponent}
					inlineConfirmComponent={props.inlineConfirmComponent}
					displayValueTransformer={props.displayValueTransformer}
					onWantsEdit={handleWantsEditProperty}
					onChange={fn}
					/>
			);
		});

		var className = classnames(
			{
				'rsui-schema-container': true,
				'rsui-schema-container-editing': editing
			},
			this.props.className
		);

		return (
			<div className={className}>
				{propertyViews}
			</div>
		);
	},

	getSchema: function () {
		var schema = this.props.schema;
		return (('getProperties' in schema) ? schema : new ObjectSchema(schema));
	},

	isValid: function () {
		let {value} = this.props;
		let schema = this.getSchema();

		return schema.getProperties().reduce((isValid, propertySchema) => {
			var propertyName = propertySchema.getName();
			var propertyValue = value ? value[propertyName] : undefined;

			return isValid && (propertySchema.isRequired() ? propertyValue !== undefined : true);
		}, true);
	}
});

module.exports = SchemaObjectView;
