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
 *    onChange: should be called with each change to
 *    onSubmit: should be called when changes are complete
 *    onCancel: called when editing is canceled
 */
var SchemaPropertyValueEditor=React.createClass({

   getDefaultProps: function(){
      return {
         "value" : "",
         "displayType" : "string",
         "placeholder" : "",
         "editMode" : "form",
         "editable" : false,
         "inlineBlurMode" : "submit", // "submit", "cancel", ""
         "displayValueTransformer" : function(p, v, d){ return d; },
         "onWantsConfirmInlineEdit" : function(){},
         "onWantsCancelInlineEdit" : function(){},
         "onChange" : function(){}
      };
   },

   getInitialState: function(){
      return {
         "editing" : false,
         "stagedValue" : this.props.value, 
         "type" : this.props.type
      };
   },

   componentWillReceiveProps: function(nextProps){
      if(nextProps.editing) {
         this.setState({
            value: this.props.value
         });
      }
   },

   componentDidUpdate: function(){
      this.props.autoFocus && this.refs[this.props.schema.getName()].focus();
   },

   render: function(){

      var editMode=this.props.editMode;
      var editable=this.props.editable;
      var editing=this.props.editing;
      // var value=(this.state.stagedValue || this.props.value);
      var value=(editMode==="inline" ? this.state.stagedValue : this.props.value);
      var displayType=this.props.displayType;
      var placeholder=this.props.placeholder;

      var className="rsui-property-value-editor"
      editable && (className+=" rsui-editable");

      // render the input
      if(editable)
      {
         var display;

         if(displayType==="checkbox")
         {
            display=(
               <input
                  type="checkbox"
                  onChange={this.handleChange}
                  />
            );
         }
         else
         {
            var className="rsui-property-value-editor";

            display=(
               <input
                  ref={this.props.schema.getName()}
                  className={className}
                  type="text"
                  placeholder={this.props.placeholder}
                  value={value}
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  onFocus={this.handleFocus} />
            );
         }

         var inlineEditingControls;

         if(editMode==="inline" && editing===true)
         {
            inlineEditingControls=this.renderInlineEditingControls();
         }
      }

      return (
         <div className="rsui-property-editor" key="editor">
            {display}
            {inlineEditingControls}
         </div>
      );
   },

   renderInlineEditingControls: function(){

      var inlineCancelComponent=this.props.inlineCancelComponent || ("cancel")
      var inlineConfirmComponent=this.props.inlineConfirmComponent || ("confirm");

      return (
         <span className="rsui-inline-controls-container">
            <a className="rsui-inline-cancel" href="#" onMouseDown={this.handleMouseDownCancelInlineEdit}>{inlineCancelComponent}</a>
            <a className="rsui-inline-confirm" href="#" onClick={this.handleClickConfirmInlineEdit}>{inlineConfirmComponent}</a>
         </span>
      );
   },

   getValue: function(){
      if(this.props.editMode==="inline") {
         return this.state.stagedValue;
      } else {
         return this.props.value;
      }
   },

   handleKeyDown: function(e){

      if(this.props.editMode==="inline")
      {
         var keyCode=e.keyCode;

         if(keyCode===13) // enter
         {
            this.commitInlineChangesIfNeccessary();

            this.props.onWantsConfirmInlineEdit(e);
         }
         else if(keyCode===27) // escape
         {
            this.handleMouseDownCancelInlineEdit(e);
         }
      }
   },

   handleCheckboxChange: function(e){

      this.setState({
         value: e.target.checked
      });
   },

   handleChange: function(e){

      // if the edit mode is inline, we'll apply the changes internally
      if(this.props.editMode==="inline")
      {
         this.setState({
            stagedValue: e.target.value
         });
      }
      else
      {
         this.props.onChange && this.props.onChange(e.target.value);
      }
   },

   handleFocus: function(e){
      this.props.onFocus && this.props.onFocus(e); // pass it up
   },

   handleBlur: function(e){

      // if we're inline editing and nothing has changed, just cancel the edit
      if(this.props.editMode==="inline" && this.props.editing)
      {
         var currentValue=this.getValue();

         if(this.props.value===currentValue) // no changes
         {
            this.props.onWantsCancelInlineEdit(currentValue);
         }
         else if(this.props.inlineBlurMode==="cancel")
         {
            this.revertInlineEditChanges();
            this.props.onWantsCancelInlineEdit(currentValue);
         }
         else if(this.props.inlineBlurMode==="submit")
         {
            this.commitInlineChangesIfNeccessary();
            this.props.onWantsConfirmInlineEdit(currentValue);
         }
      }

      this.props.onBlur && this.props.onBlur(e); // pass it up
   },

   commitInlineChangesIfNeccessary: function(){

      var currentValue=this.getValue();

      if(this.props.editMode==="inline" && this.props.value!==currentValue)
      {
         this.setState({
            stagedValue: undefined
         });

         this.props.onChange(currentValue);
         this.props.onWantsConfirmInlineEdit(currentValue);
         ReactDOM.findDOMNode(this.refs[this.props.schema.getName()]).blur();
      }
   },

   revertInlineEditChanges: function(){
      // ReactDOM.findDOMNode(this.refs[this.props.schema.getName()]).value=this.props.value;
      this.setState({
         stagedValue: this.props.value
      });
   },

   handleClickConfirmInlineEdit: function(e){

      e.preventDefault();

      this.commitInlineChangesIfNeccessary();
   },

   handleMouseDownCancelInlineEdit: function(e){

      e.preventDefault();

      this.revertInlineEditChanges();

      this.props.onWantsCancelInlineEdit(e);
   }
});

module.exports=SchemaPropertyValueEditor;
