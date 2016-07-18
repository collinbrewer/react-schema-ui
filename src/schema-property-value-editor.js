var React=require("react");
var ReactDOM=require("react-dom");
var JSONPointer=require("json-pointer");

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
var SchemaPropertyValueEditor=React.createClass({

   getDefaultProps: function(){
      return {
         "value" : "",
         "displayType" : "text",
         "placeholder" : "",
         "editMode" : "form",
         "editable" : false,
         "onChange" : function(){},
         "onSubmit" : function(){}
      };
   },

   getInitialState: function(){
      return {
         "type" : this.props.type
      };
   },

   componentDidMount: function(){
      this.props.autoFocus && this.refs.input.focus();
   },

   render: function(){

      var propertyValueEditor=null;
      var props=this.props;
      var editMode=props.editMode;
      var editable=props.editable;
      var value=props.value;
      var displayType=props.displayType;
      var placeholder=props.placeholder;

      var className="rsui-property-value-editor"
      editable && (className+=" rsui-editable");

      // render the input
      // if(editable)
      {
         if(displayType==="checkbox")
         {
            propertyValueEditor=(
               <input
                  type="checkbox"
                  onChange={this.handleCheckboxChange}
                  />
            );
         }
         else
         {
            var className="rsui-property-value-editor";

            propertyValueEditor=(
               <input
                  ref="input"
                  className={className}
                  type={displayType}
                  placeholder={placeholder}
                  value={value}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  onFocus={this.handleFocus} />
            );
         }
      }

      return propertyValueEditor;
   },

   handleCheckboxChange: function(e){
      this.props.onChange(e.target.checked);
   },

   handleChange: function(e){
      this.props.onChange(e.target.value);
   }
});

module.exports=SchemaPropertyValueEditor;
