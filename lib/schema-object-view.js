"use strict";

/**
 * A configurable react view component, generated from a given object.
 */

var React = require("react");
var classnames = require("classnames");
var SchemaPropertyView = require("./schema-property-view.js");

var ObjectSchema = require("./schemas/object-schema.js");

var SchemaObjectView = React.createClass({
   displayName: "SchemaObjectView",


   getDefaultProps: function getDefaultProps() {

      return {
         schema: undefined,
         value: undefined,
         editMode: "form",
         editing: false,
         editable: false,
         propertyViewers: {},
         propertyEditors: {},
         onWantsEditProperty: function onWantsEditProperty() {},
         onChange: function onChange() {}
      };
   },

   render: function render() {

      var props = this.props;
      var schema = this.getSchema();
      var editMode = props.editMode;
      var editable = props.editable;
      var editing = props.editing;
      var handleWantsEditProperty = props.onWantsEditProperty;
      var value = props.value;
      var propertyNameWhitelist = props.propertyNameWhitelist;
      var propertyNameBlacklist = props.propertyNameBlacklist || [];
      var properties;
      var value;

      // pull in explicity whitelisted or all
      if (propertyNameWhitelist) {
         properties = schema.getProperties().filter(function (property) {
            return propertyNameWhitelist.indexOf(property.getName()) !== -1;
         });
      } else {
         properties = schema.getProperties();
      }

      // filter out the blacklist
      if (propertyNameBlacklist) {
         properties = properties.filter(function (property) {
            return propertyNameBlacklist.indexOf(property.getName()) === -1;
         });
      }

      // render the property views
      var handleChangeProperty = this.props.onChangeProperty;

      var propertyViews = properties.map(function (propertySchema, i) {

         var propertyName = propertySchema.getName();

         var propertyValue = value ? value[propertyName] : undefined;

         var fn;

         if (handleChangeProperty) {
            fn = handleChangeProperty.bind(null, propertySchema);
         }

         return React.createElement(SchemaPropertyView, {
            key: i,
            schema: propertySchema,
            value: propertyValue,
            editMode: editMode,
            editable: editable,
            editing: editing,
            propertyViewerClass: props.propertyViewers[propertySchema.getName()],
            propertyEditorClass: props.propertyEditors[propertySchema.getName()],
            renderPropertyViewer: props.renderPropertyViewer,
            renderPropertyEditor: props.renderPropertyEditor,
            inlineCancelComponent: props.inlineCancelComponent,
            inlineConfirmComponent: props.inlineConfirmComponent,
            displayValueTransformer: props.displayValueTransformer,
            onWantsEdit: handleWantsEditProperty,
            onChange: fn });
      });

      var className = classnames({
         "rsui-schema-container": true,
         "rsui-schema-container-editing": editing
      }, this.props.className);

      return React.createElement(
         "div",
         { className: className },
         propertyViews
      );
   },

   getSchema: function getSchema() {
      var schema = this.props.schema;
      return 'getProperties' in schema ? schema : new ObjectSchema(schema);
   }
});

module.exports = SchemaObjectView;