"use strict";

var React = require("react");
var ReactDOM = require("react-dom");
var classnames = require("classnames");
var JSONPointer = require("json-pointer");

var PropertySchema = require("./schemas/property-schema.js");
var SchemaPropertyValueViewer = require("./schema-property-value-viewer.js");
var SchemaPropertyValueEditor = require("./schema-property-value-editor.js");
var dispatcher = require("./dispatcher.js");

var getDisplayTypeForProperty = function getDisplayTypeForProperty(property) {

   var displayType = "text";

   if (property.getType() === "boolean") {
      displayType = "checkbox";
   } else if (property.isSecure()) {
      displayType = 'password';
   }

   return displayType;
};

var SchemaPropertyView = React.createClass({
   displayName: "SchemaPropertyView",


   getDefaultProps: function getDefaultProps() {

      var noop = function noop() {};

      return {
         "schema": {},
         "title": "",
         "placeholder": "",
         "value": undefined,
         "displayValue": "",
         "editMode": "form",
         "editable": false,
         "editing": false,
         "inlineBlurMode": "submit", // "submit", "cancel", ""
         "onWantsEdit": noop,
         "onChange": noop,
         renderPropertyViewer: noop,
         renderPropertyEditor: noop,
         displayValueTransformer: function displayValueTransformer(p, v, d) {
            return d;
         }
      };
   },

   getInitialState: function getInitialState() {
      return {
         "editing": this.props.editing
      };
   },

   // componentWillReceiveProps: function(nextProps){
   //    if(this.props.value!==nextProps.value) {
   //       this.setState({
   //          stagedValue: undefined
   //       });
   //    }
   // },

   render: function render() {

      var props = this.props;
      var editMode = props.editMode;
      var editable = this.props.editable;
      var editing = this.state.editing;
      var schema = this.getSchema();
      var value = this.state.stagedValue || this.props.value;
      var displayName = schema.getLabel();
      var placeholder = schema.getPlaceholder();
      var inlineEditingControls;
      var className = classnames({
         "rsui-property-container": true,
         "rsui-editable": editable,
         "rsui-editing": editing,
         "rsui-has-value": !!value,
         "rsui-has-changed": this.hasChanged()
      }, schema.getName(), "rsui-edit-mode-" + editMode);

      // if
      if (editMode === "inline" && editing) {
         inlineEditingControls = this.renderInlineEditingControls();
      }

      // we'll make this tabbable if it's inline mode, editable, but not editing
      var tabIndex = editMode === "inline" && editable && !editing ? "0" : undefined;
      var focusInput;
      var viewerContainer;
      var editorContainer;

      if (editMode === "inline" && editable && !editing) {
         focusInput = React.createElement("input", { ref: "fakeInput", onFocus: this.handleFocus, style: { position: "absolute", opacity: 0 } });
      }

      if (editMode === "inline" ? editing : editable) {
         editorContainer = React.createElement(
            "div",
            { className: "rsui-property-value-editor-container", onKeyDown: this.handleKeyDown, key: "editor" },
            this.renderValueEditor(),
            inlineEditingControls
         );
      } else {
         viewerContainer = React.createElement(
            "div",
            { className: "rsui-property-value-viewer-container", key: "viewer" },
            this.renderValueViewer()
         );
      }

      return React.createElement(
         "div",
         {
            className: className,
            onMouseDown: this.handleMouseDownContainer,
            onClick: this.handleClickContainer,
            ref: "container" },
         React.createElement(
            "label",
            { className: "rsui-property-label", htmlFor: schema.getName() },
            displayName
         ),
         focusInput,
         React.createElement(
            "div",
            { className: "rsui-property-value-container" },
            viewerContainer,
            editorContainer
         )
      );
   },

   renderValueViewer: function renderValueViewer() {
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
            valueViewer = React.createElement(props.propertyViewerClass || SchemaPropertyValueViewer, viewerProps);
         }
      } else {
         valueViewer = React.createElement(
            "div",
            { className: "rsui-property-value-placeholder" },
            placeholder
         );
      }

      return valueViewer;
   },

   renderValueEditor: function renderValueEditor() {

      var props = this.props;
      var schema = this.getSchema();
      var editorProps = {
         ref: schema.getName(),
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
         valueEditor = React.createElement(props.propertyEditorClass || SchemaPropertyValueEditor, editorProps);
      }

      return valueEditor;
   },

   renderInlineEditingControls: function renderInlineEditingControls() {

      var inlineCancelComponent = this.props.inlineCancelComponent || "cancel";
      var inlineConfirmComponent = this.props.inlineConfirmComponent || "confirm";

      var confirmControl;

      if (this.hasChanged()) {
         confirmControl = React.createElement(
            "button",
            { className: "rsui-inline-confirm", tabIndex: "-1", onMouseDown: this.confirmInlineEdit },
            inlineConfirmComponent
         );
      } else {
         confirmControl = React.createElement(
            "span",
            { className: "rsui-inline-confirm" },
            inlineConfirmComponent
         );
      }

      return React.createElement(
         "span",
         { className: "rsui-inline-controls-container" },
         React.createElement(
            "button",
            { className: "rsui-inline-cancel", tabIndex: "-1", onMouseDown: this.cancelInlineEdit },
            inlineCancelComponent
         ),
         confirmControl
      );
   },

   handleKeyDown: function handleKeyDown(e) {

      var keyCode = e.keyCode;

      if (keyCode === 13) // enter > explicit confirm
         {
            this.confirmInlineEdit(e);
         } else if (keyCode === 27) // escape > explicity confirm
         {
            this.cancelInlineEdit(e);
         }
      // else if(keyCode===9) // tab > implicit based on blur mode
      // {
      //    this.endEditSession();
      // }
   },

   handleChange: function handleChange(value) {

      // if the edit mode is inline, we'll apply the changes internally
      if (this.props.editMode === "inline") {
         this.setState({
            stagedValue: value
         });
      } else {
         this.props.onChange(value);
      }
   },

   handleMouseDownContainer: function handleMouseDownContainer(e) {

      if (this.props.editMode === "inline") {
         if (this.state.editing) {
            e.preventDefault();
         }
      }
   },

   handleClickContainer: function handleClickContainer(e) {

      if (this.props.editMode === "inline") {
         if (this.props.editable) {
            this.beginEditSession(e);
         }
      }
   },

   handleFocus: function handleFocus(e) {
      this.beginEditSession(e);
   },

   beginEditSession: function beginEditSession(e) {

      var shouldEdit = this.props.onWantsEdit(this.getSchema(), e);

      if (shouldEdit !== false) {
         // this.setState({
         //    editing: true
         // });
         // FIXME: this may come as a prop from the editor store instead
         this.setState({
            editing: true
         });

         dispatcher.dispatch({
            actionType: "beginEditSession",
            editor: this
         });
      } else {
         this.refs.fakeInput.blur();
         // this.refs.container.blur();
         e && e.preventDefault();
      }
   },

   endEditSession: function endEditSession() {

      // if we're inline editing and nothing has changed, just cancel the edit
      if (this.props.editMode === "inline" && this.state.editing) {
         if (!this.hasChanged()) {
            this.cancelInlineEdit();
         } else if (this.props.inlineBlurMode === "cancel") {
            this.cancelInlineEdit();
         } else if (this.props.inlineBlurMode === "submit") {
            this.confirmInlineEdit();
         }
      }
   },

   /**
    * @return Boolean Returns true if the component or one of it's descendants has focus
    */
   hasFocus: function hasFocus() {
      var el = document.activeElement;
      var us = ReactDOM.findDOMNode(this.refs.container);
      while (el = el.parentElement) {
         if (el === us) {
            return true;
         }
      }
      return false;
   },

   /**
    * @return Boolean True if the component is being edited
    */
   isEditing: function isEditing() {
      return this.state.editing;
   },

   confirmInlineEdit: function confirmInlineEdit(e) {
      e && e.preventDefault();

      if (this.props.editMode === "inline") {
         this.setState({
            stagedValue: undefined,
            editing: false
         });

         this.props.onChange(this.getValue());
      }
   },

   cancelInlineEdit: function cancelInlineEdit() {
      this.setState({
         stagedValue: undefined, // revert
         editing: false
      });
   },

   getSchema: function getSchema() {
      var schema = this.props.schema;
      return 'getName' in schema ? schema : new PropertySchema(schema);
   },

   getValue: function getValue() {
      return this.state.stagedValue !== undefined ? this.state.stagedValue : this.props.value;
   },

   isValid: function isValid() {
      var schema = this.getSchema();

      console.log(schema.isRequired(), this.getValue(), this.state.stagedValue, this.props.value);

      return schema.isRequired() ? this.getValue() !== undefined : true;
   },

   // this is meant to be used only in inline edit mode
   hasChanged: function hasChanged() {
      return this.getValue() !== this.props.value;
   }
});

/**
 * defaultDisplayValueTransformer
 */
var defaultDisplayValueTransformer = function defaultDisplayValueTransformer(property, value, transformer) {

   var displayValue = value;
   var type = property.getType();

   switch (type) {
      case "date":
         {
            displayValue = value && value.toLocaleString();
            break;
         }
   }

   return transformer(property, value, displayValue);
};

module.exports = SchemaPropertyView;