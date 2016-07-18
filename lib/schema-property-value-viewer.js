"use strict";

var React = require("react");

/**
 * Provides a full featured value viewer capable of handling most cases without
 * the need for a custom viewer.
 */
var SchemaPropertyValueViewer = React.createClass({
   displayName: "SchemaPropertyValueViewer",


   getDefaultProps: function getDefaultProps() {
      return {
         "value": "",
         "displayType": "string"
      };
   },

   render: function render() {

      var displayValue = this.props.displayValue;

      return React.createElement(
         "div",
         { className: 'rsui-property-value-viewer' },
         displayValue
      );
   }
});

module.exports = SchemaPropertyValueViewer;