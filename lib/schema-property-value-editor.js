"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var JSONPointer = require("json-pointer");

/**
 * Default property editor relying on standard HTML form inputs
 * Capable of editing types:
 *    - string: text input
 *    - boolean: checkbox
 *
 * TODO: Need to establish a protocol for editors to follow for custom editors
 * RSUIValueEditorProtocol
 *    focus: called when the editor should get focus
 *    onChange: should be called with each change to
 *    onSubmit: should be called when changes are complete
 *    onCancel: should be called if editing should be canceled
 */
var SchemaPropertyValueEditor = React.createClass({
   displayName: "SchemaPropertyValueEditor",


   getDefaultProps: function getDefaultProps() {
      return {
         "value": "",
         "displayType": "text",
         "placeholder": "",
         "editMode": "form",
         "editable": false,
         "onChange": function onChange() {},
         "onSubmit": function onSubmit() {}
      };
   },

   getInitialState: function getInitialState() {
      return {
         "type": this.props.type
      };
   },

   componentDidMount: function componentDidMount() {
      this.props.autoFocus && this.refs.input.focus();
   },

   render: function render() {

      var propertyValueEditor = null;
      var props = this.props;
      var editMode = props.editMode;
      var editable = props.editable;
      var value = props.value;
      var displayType = props.displayType;
      var placeholder = props.placeholder;

      var className = "rsui-property-value-editor";
      editable && (className += " rsui-editable");

      // render the input
      // if(editable)
      {
         if (displayType === "checkbox") {
            propertyValueEditor = React.createElement("input", {
               type: "checkbox",
               onChange: this.handleCheckboxChange
            });
         } else {
            var className = "rsui-property-value-editor";

            propertyValueEditor = React.createElement("input", {
               ref: "input",
               className: className,
               type: displayType,
               placeholder: placeholder,
               value: value,
               onChange: this.handleChange,
               onBlur: this.handleBlur,
               onFocus: this.handleFocus });
         }
      }

      return propertyValueEditor;
   },

   handleCheckboxChange: function handleCheckboxChange(e) {
      this.props.onChange(e.target.checked);
   },

   handleChange: function handleChange(e) {
      this.props.onChange(e.target.value);
   }
});

module.exports = SchemaPropertyValueEditor;