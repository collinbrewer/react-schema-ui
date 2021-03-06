var React = require('react');
var SchemaObjectView = require('../../src/react-schema-ui.js').SchemaObjectView;
var DateValueEditor = require('./date-value-editor.js');

require('../../src/css/core.css');

function customPropertyViewer (p) {
	if (p.schema.getName() === 'age') {
		return (<div style={{color: '#ED5565'}}>{p.value}!</div>);
	}

	return null;
}

var Demo = React.createClass({

	propTypes: {
		schema: React.PropTypes.object
	},

	render: function () {
		var schema = {
			schemaType: 'object',
			properties: [
				{
					'schemaType': 'property',
					'name': 'username',
					'type': 'string'
				},

				{
					'schemaType': 'property',
					'name': 'password',
					'type': 'string',
					secure: true
				},

				{
					'schemaType': 'property',
					'name': 'age',
					'type': 'number'
				},

				{
					'schemaType': 'property',
					'name': 'dateCreated',
					'type': 'date',
					'label': 'Date',
					'placeholder': 'date record was created',
					'meta': {
						'displayName': 'Created On'
					}
				},

				{
					'schemaType': 'property',
					'name': 'completed',
					'type': 'boolean'
				}
			]
		};

		var object = this.object;

		if (!object) {
			object = {
				username: 'collinbrewer',
				age: 21
			};

			this.object = object;
		}

		var customTransformer = function (p, v, d) {
			if (p.getType() === 'attribute' && p.getAttributeType() === 'date') {
				if (v) {
					console.log('custom transformer: ', arguments);
					console.log('transforming: ', v);
					d = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][v.getMonth()] + ' ' + v.getDate() + ', ' + v.getFullYear();
				}
			}
			else if (p.getType() === 'boolean') {
				d = v ? 'Yes' : 'No';
			}

			return d;
		};

		return (
			<div className='container' style={{paddingTop: '64px'}}>
				<div className='row'>
					<div className='col-xs-12 text-center'>
						<h1>React Schema UI</h1>
					</div>
				</div>
				<div className='row' style={{paddingTop: '64px'}}>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Readonly Viewer</h2>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									key={1}
									schema={schema}
									displayValueTransformer={customTransformer}
									value={object} />
							</div>
						</div>
					</div>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Form Editor</h2>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									key={2}
									schema={schema}
									value={object}
									editMode='form'
									editable={true}
									propertyEditors={{
										'dateCreated': DateValueEditor
									}}
									displayValueTransformer={customTransformer}
									onChangeProperty={this.handleChangeProperty} />
							</div>
						</div>
					</div>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Inline Editor</h2>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									key={3}
									schema={schema}
									value={object}
									editMode='inline'
									editable={true}
									displayValueTransformer={customTransformer}
									onChangeProperty={this.handleChangeProperty}
									onWantsEditProperty={this.handleWantsEditProperty} />
							</div>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Floating Labels Editor</h2>
								<span className='text-muted'>Using Custom CSS</span>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									className='floating-label'
									key={3}
									schema={schema}
									value={object}
									editMode='inline'
									inlineCancelComponent={<i className='icon ion-ios-close-outline' />}
									inlineConfirmComponent={<i className='icon ion-ios-checkmark-outline' />}
									editable={true}
									displayValueTransformer={customTransformer}
									onChangeProperty={this.handleChangeProperty}
									onWantsEditProperty={this.handleWantsEditProperty} />
							</div>
						</div>
					</div>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Styled Viewer</h2>
								<span className='text-muted'>Using Custom CSS</span>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									className='styled-viewer'
									key={3}
									schema={schema}
									value={object}
									displayValueTransformer={customTransformer}
									renderPropertyViewer={customPropertyViewer} />
							</div>
						</div>
					</div>
					<div className='col-xs-12 col-sm-4'>
						<div className='panel panel-default'>
							<div className='panel-heading'>
								<h2 className='panel-title'>Custom Inline Editors</h2>
							</div>
							<div className='panel-body'>
								<SchemaObjectView
									key={3}
									schema={schema}
									value={object}
									editMode='inline'
									editable={true}
									propertyEditors={{
										'dateCreated': DateValueEditor
									}}
									displayValueTransformer={customTransformer}
									onChangeProperty={this.handleChangeProperty}
									onWantsEditProperty={this.handleWantsEditProperty} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},

	handleWantsEditProperty: function (property) {
		var propertyName = property.getName();

		if (propertyName === 'completed') {
			var d = prompt('Intercepted request to edit property!! \n\nPlease type yes or no:');

			if (d) {
				this.object['completed'] = (d.toLowerCase() === 'yes');

				this.forceUpdate();
			}

			return false;
		}
	},

	handleChangeProperty: function (property, value) {
		this.object[property.getName()] = value;

		this.forceUpdate();
	}
});

module.exports = Demo;
